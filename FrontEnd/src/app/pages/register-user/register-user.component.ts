import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
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

  private userApiUrl = 'http://localhost:9191/api/User/register';
  private cityApiUrl = 'http://localhost:9191/api/City';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.getCities();
    this.enableExternalScroll();  // Habilitar desplazamiento externo
  }

  getCities(): void {
    this.http.get<any[]>(this.cityApiUrl).subscribe(
      (cities) => {
        this.cities = cities;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  onSubmit(form: NgForm): void {
    const payload = {
      user: {
        ...this.user, // Incluye todos los campos del objeto user
      },
      person: {
        ...this.person // Incluye todos los campos del objeto person
      },
      roleName: this.roleName // Incluye roleName directamente aquí
    };

    console.log('Payload enviado:', payload); // Verifica qué estás enviando

    this.http.post(this.userApiUrl, payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Usuario registrado exitosamente', 'success');
        this.showLoginButton = true; // Mostrar el botón de iniciar sesión
        form.resetForm();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo registrar al usuario', 'error');
        console.error('Error registrando usuario:', error);
      }
    });
  }

  private resetForm(): void {
    this.user = { id: 0, state: true, userName: '', password: '' };
    this.person = {
      id: 0, state: true, firstName: '', secondName: '', firstLastName: '',
      secondLastName: '', email: '', dateOfBirth: '', gender: '', cityId: 0, typeDocument: '', numberDocument: ''
    };
    this.roleName = 'usuario'; // Resetear roleName
  }

  // Método para redirigir al componente de inicio de sesión
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Método para habilitar el desplazamiento externo
  enableExternalScroll(): void {
    const registerContainer = document.querySelector('.register-container') as HTMLElement;

    document.body.addEventListener('wheel', (event) => {
      // Verifica si el cursor está fuera del contenedor de registro
      if (!registerContainer.contains(event.target as Node)) {
        event.preventDefault();  // Previene el desplazamiento del body
        registerContainer.scrollTop += event.deltaY;  // Desplaza el contenedor
      }
    });
  }
}