import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-user',
  standalone: true,
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, NgbModule],
})
export class RegisterUserComponent implements OnInit {
  user = {
    id: 0,
    state: true,
    userName: '',
    password: ''
  };

  person = {
    id: 0,
    state: true,
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    cityId: 0,
    typeDocument: '',
    numberDocument: ''
  };

  roleName: string = 'usuario'; // Campo roleName en el componente
  cities: any[] = [];
  showLoginButton = false; // Control para mostrar el botón de iniciar sesión
  isBrowser: boolean;
  passwordInvalid = false;
  dateOfBirthInvalid = false;
  documentNumberInvalid = false; // Nueva propiedad para validar el número de documento

  private userApiUrl = 'http://localhost:9191/api/User/register';
  private cityApiUrl = 'http://localhost:9191/api/City';
  private ageCheckUrl = 'http://localhost:9191/api/Person/check-age'; // Endpoint para verificar la edad

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.getCities();
    if (this.isBrowser) {
      this.enableExternalScroll();
    }
  }

  getCities(): void {
    this.http.get<any[]>(this.cityApiUrl).subscribe(
      (cities) => {
        this.cities = cities;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching cities:', error);
        Swal.fire('Error', 'Error al obtener las ciudades. Intente de nuevo más tarde.', 'error');
      }
    );
  }

  togglePasswordVisibility() {
    if (this.isBrowser) {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  }

  setDateOfBirth(date: string) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    this.person.dateOfBirth = `${year}-${month}-${day}`;
  }

  checkAge(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post(this.ageCheckUrl, this.person).subscribe({
        next: (response: any) => {
          resolve(response.isEligible);
        },
        error: (error) => {
          console.error('Error al verificar la edad:', error);
          reject('Error al verificar la edad. Intente de nuevo.');
        }
      });
    });
  }

  onSubmit(form: NgForm): void {
    // Resetear las validaciones antes de verificar
    this.resetValidationErrors();

    // Validar el formulario
    if (!this.isFormValid()) {
      return;
    }

    this.setDateOfBirth(this.person.dateOfBirth);

    this.checkAge()
      .then(isEligible => {
        if (isEligible) {
          const payload = {
            user: {
              ...this.user,
            },
            person: {
              ...this.person
            },
            roleName: this.roleName
          };

          this.http.post(this.userApiUrl, payload).subscribe({
            next: () => {
              Swal.fire('Éxito', 'Usuario registrado exitosamente', 'success').then(() => {
                // Esperar 1 segundo antes de redirigir al login
                setTimeout(() => {
                  this.navigateToLogin(); // Redirigir a la página de inicio de sesión
                }, 100);
              });
              this.showLoginButton = true;
              form.resetForm();
              this.resetForm();
            },
            error: (error) => {
              console.error('Error registrando usuario:', error);
              Swal.fire('Error', 'No se pudo registrar al usuario. Intente de nuevo.', 'error');
            }
          });
        } else {
          Swal.fire('Error', 'La persona no es elegible para el registro debido a la edad.', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Error', error, 'error');
      });
  }

  isFormValid(): boolean {
    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    if (!this.isValidDateOfBirth()) {
      Swal.fire('Error', 'La fecha de nacimiento es inválida o la persona debe tener al menos 14 años.', 'error');
      return false;
    }

    if (!this.validateDocumentNumber(this.person.numberDocument) || !this.validateDocumentNumberLength(this.person.numberDocument)) {
      Swal.fire('Error', 'El número de documento debe tener entre 6 y 10 dígitos y no puede ser negativo.', 'error');
      return false;
    }

    if (!this.validatePassword(this.user.password)) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.', 'error');
      return false;
    }

    if (!this.isValidEmail()) {
      Swal.fire('Error', 'Ingrese un correo electrónico válido de gmail, outlook o hotmail.', 'error');
      return false;
    }

    if (this.user.userName.length > 20) {
      Swal.fire('Error', 'El nombre de usuario no puede exceder los 20 caracteres.', 'error');
      return false;
    }

    return true;
  }

  areAllFieldsFilled(): boolean {
    return (
      this.user.userName.trim() !== '' &&
      this.user.password.trim() !== '' &&
      this.person.firstName.trim() !== '' &&
      this.person.firstLastName.trim() !== '' &&
      this.person.email.trim() !== '' &&
      this.person.dateOfBirth.trim() !== '' &&
      this.person.gender.trim() !== '' &&
      this.person.cityId !== 0 &&
      this.person.typeDocument.trim() !== '' &&
      this.person.numberDocument.trim() !== ''
    );
  }

  isValidDateOfBirth(): boolean {
    const dateOfBirth = new Date(this.person.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    const dayDiff = today.getDate() - dateOfBirth.getDate();

    if (dateOfBirth > today || (age === 14 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))) || age < 14) {
      return false;
    }
    return true;
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;
    return passwordPattern.test(password);
  }

  validateDocumentNumber(number: string): boolean {
    return Number(number) >= 0;
  }

  validateDocumentNumberLength(number: string): boolean {
    return number.length >= 6 && number.length <= 10;
  }

  isValidEmail(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = ['gmail.com'];
    const emailDomain = this.person.email.split('@')[1];
    return emailPattern.test(this.person.email) && allowedDomains.includes(emailDomain);
  }

  private resetValidationErrors(): void {
    this.passwordInvalid = false;
    this.documentNumberInvalid = false;
  }

  private resetForm(): void {
    this.user = { id: 0, state: true, userName: '', password: '' };
    this.person = {
      id: 0, state: true, firstName: '', secondName: '', firstLastName: '',
      secondLastName: '', email: '', dateOfBirth: '', gender: '', cityId: 0, typeDocument: '', numberDocument: ''
    };
    this.roleName = 'usuario';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  enableExternalScroll(): void {
    const registerContainer = document.querySelector('.register-container') as HTMLElement;

    document.body.addEventListener('wheel', (event) => {
      if (registerContainer) {
        registerContainer.scrollTop += event.deltaY;
      }
    });
  }
}
