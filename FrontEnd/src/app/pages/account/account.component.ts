import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
  ],
})
export class AccountComponent implements OnInit {
  user: any = { id: 0, userName: '', personId: 0, state: true };
  person: any = {
    id: 0,
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    cityId: 0,
    typeDocument: 'ID',
    numberDocument: '',
    state: true,
  };

  cities: any[] = [];
  private userApiUrl = 'http://localhost:9191/api/User';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private cityApiUrl = 'http://localhost:9191/api/City';

  originalUser: any = {};
  originalPerson: any = {};

  userFormChanged = false;
  personFormChanged = false;

  // Para mostrar el mensaje de error si la fecha de nacimiento no es válida
  dateErrorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUserData();
    this.getCities();
  }

  getUserData(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`${this.userApiUrl}/${userId}`).subscribe(
        (userData) => {
          this.user = { ...userData };
          this.originalUser = { ...userData };
          this.getPersonData(userData.personId);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  getPersonData(personId: number): void {
    this.http.get<any>(`${this.personApiUrl}/${personId}`).subscribe(
      (personData) => {
        if (personData.dateOfBirth) {
          personData.dateOfBirth = personData.dateOfBirth.split('T')[0];
        }
        this.person = { ...personData };
        this.originalPerson = { ...personData };
      },
      (error) => {
        console.error('Error fetching person data:', error);
      }
    );
  }

  getCities(): void {
    this.http.get<any[]>(this.cityApiUrl).subscribe(
      (citiesData) => {
        this.cities = citiesData;
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  checkUserFormChanges(): void {
    this.userFormChanged = JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
  }

  checkPersonFormChanges(): void {
    this.personFormChanged = JSON.stringify(this.person) !== JSON.stringify(this.originalPerson);
  }

  // Función para validar la fecha de nacimiento
  validateDateOfBirth(): void {
    const currentDate = new Date();
    const birthDate = new Date(this.person.dateOfBirth);

    // Calcular la edad
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    // Ajustar la edad si el cumpleaños aún no ha ocurrido en el año actual
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    // Validar si la edad es mayor a 14 años, menor a 85, y que no sea una fecha futura
    if (birthDate > currentDate) {
      this.dateErrorMessage = 'La fecha de nacimiento no puede ser en el futuro.';
    } else if (age < 14) {
      this.dateErrorMessage = 'La edad mínima es de 14 años.';
    } else if (age > 85) {
      this.dateErrorMessage = 'La edad máxima es de 85 años.';
    } else {
      this.dateErrorMessage = ''; // Limpiar mensaje si la fecha es válida
    }
  }

  updateUser(): void {
    if (this.userFormChanged) {
      const updatedUser = { ...this.user };
      this.http.put(`${this.userApiUrl}/${updatedUser.id}`, updatedUser).subscribe(
        () => {
          Swal.fire('Success', 'Usuario actualizado exitosamente', 'success');
          this.originalUser = { ...updatedUser }; // Actualizamos el valor original
          this.userFormChanged = false;
        },
        (error) => {
          console.error('Error updating user:', error);
          Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
      );
    }
  }

  updatePerson(): void {
    // Solo actualizar si no hay errores en la fecha de nacimiento
    if (this.personFormChanged && !this.dateErrorMessage) {
      const updatedPerson = { ...this.person };
      this.http.put(`${this.personApiUrl}/${updatedPerson.id}`, updatedPerson).subscribe(
        () => {
          Swal.fire('Success', 'Datos personales actualizados exitosamente', 'success');
          this.originalPerson = { ...updatedPerson }; // Actualizamos el valor original
          this.personFormChanged = false;
        },
        (error) => {
          console.error('Error updating person:', error);
          Swal.fire('Error', 'No se pudieron actualizar los datos personales', 'error');
        }
      );
    }
  }
}
