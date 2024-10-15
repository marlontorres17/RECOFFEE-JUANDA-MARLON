import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: any[] = [];
  person: any = { id: 0, firstName: '', secondName: '', firstLastName: '', secondLastName: '', email: '', dateOfBirth: '', gender: '', cityId: 0, typeDocument: 'CC', numberDocument: '', state: true };
  cities: any[] = [];
  filteredCities: any[] = [];
  selectedCity = '';
  closeResult = '';
  showDropdown: boolean = false; // Para controlar la visibilidad del dropdown


  private personApiUrl = 'http://localhost:9191/api/Person';
  private citiesApiUrl = 'http://localhost:9191/api/City';
  private ageCheckUrl = 'http://localhost:9191/api/Person/check-age'; // Asegúrate de tener el endpoint correcto

  dateOfBirthInvalid = false;
  documentNumberInvalid = false;

  @ViewChild('personModal') personModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getPersons();
    this.getCities();
  }

  getPersons(): void {
    this.http.get<any[]>(this.personApiUrl).subscribe(
      (persons) => {
        this.persons = persons;
        this.cdr.detectChanges();
        console.log('Persons fetched:', this.persons);
      },
      (error) => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  getCities(): void {
    this.http.get<any[]>(this.citiesApiUrl).subscribe(
      (cities) => {
        this.cities = cities;
        this.filteredCities = [...this.cities];
        this.cdr.detectChanges();
        console.log('Cities fetched:', this.cities);
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
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
  isValidEmail(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com'];
    const emailDomain = this.person.email.split('@')[1];
    return emailPattern.test(this.person.email) && allowedDomains.includes(emailDomain);
  }
  onSubmit(form: NgForm): void {

 

    if (!this.isFormValid()) {
      return;
    }

    this.setDateOfBirth(this.person.dateOfBirth);

    this.checkAge().then(isEligible => {
      if (isEligible) {
        const personDto = { ...this.person };

        if (this.person.id === 0) {
          // Add a new person
          this.http.post(this.personApiUrl, personDto).subscribe(() => {
            this.getPersons();
            this.resetForm();
            Swal.fire('Éxito', 'Persona creada exitosamente', 'success');
          });
        } else {
          // Update an existing person
          this.http.put(`${this.personApiUrl}/${this.person.id}`, personDto).subscribe(() => {
            this.getPersons();
            this.resetForm();
            Swal.fire('Éxito', 'Persona actualizada exitosamente', 'success');
          });
        }
        this.modalService.dismissAll();
      } else {
        Swal.fire('Error', 'La persona no es elegible debido a su edad.', 'error');
      }
    }).catch(error => {
      Swal.fire('Error', error, 'error');
    });
  }

  editPerson(person: any): void {
    this.person = { ...person };

    if (this.person.dateOfBirth) {
      this.person.dateOfBirth = new Date(this.person.dateOfBirth).toISOString().split('T')[0];
    }

    this.selectedCity = this.getCityName(person.cityId);
    this.modalService.open(this.personModal);
  }

  deletePerson(id: number): void {
    Swal.fire({
      title: 'Estás de acuerdo?',
      text: 'Estás a punto de eliminar esta persona. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.personApiUrl}/${id}`).subscribe(() => {
          this.getPersons();
          Swal.fire('Eliminada!', 'Persona eliminada.', 'success');
        });
      }
    });
  }

  openModal(): void {
    this.resetForm();
    this.modalService.open(this.personModal);
  }

  filterCities(): void {
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(this.selectedCity.toLowerCase())
    );
  }

  selectCity(city: any): void {
    this.person.cityId = city.id;
    this.selectedCity = city.name;
    this.filteredCities = [];
    this.showDropdown = false;  // Ocultar la lista después de seleccionar
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;  // Retardo para permitir la selección de una opción antes de ocultar
    }, 200);
  }


  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : 'Unknown';
  }

  resetForm(): void {
    this.person = { id: 0, firstName: '', secondName: '', firstLastName: '', secondLastName: '', email: '', dateOfBirth: '', gender: '', cityId: 0, typeDocument: 'CC', numberDocument: '', state: true };
    this.selectedCity = '';
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

    if (!this.isValidEmail()) {
      Swal.fire('Error', 'Ingrese un correo electrónico válido de gmail, outlook o hotmail.', 'error');
      return false;
    }

    if (!this.validateDocumentNumber(this.person.numberDocument) || !this.validateDocumentNumberLength(this.person.numberDocument)) {
      Swal.fire('Error', 'El número de documento debe tener entre 6 y 10 dígitos y no puede ser negativo.', 'error');
      return false;
    }

    return true;
  }

  areAllFieldsFilled(): boolean {
    return (
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

  validateDocumentNumber(number: string): boolean {
    return Number(number) >= 0;
  }

  validateDocumentNumberLength(number: string): boolean {
    return number.length >= 6 && number.length <= 10;
  }

}
