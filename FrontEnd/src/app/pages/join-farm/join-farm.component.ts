import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-join-farm',
  standalone: true,
  templateUrl: './join-farm.component.html',
  styleUrls: ['./join-farm.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
})
export class JoinFarmComponent implements OnInit {
  formData: any = {
    identificationNumber: '',
    codigoUnico: ''
  };
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
    typeDocument: 'CC', 
    numberDocument: '', 
    state: true 
  };

  private personApiUrl = 'http://localhost:9191/api/Person';
  private joinApiUrl = 'http://localhost:9191/api/JoinFarmPerson/join';
  private farmApiUrl = 'http://localhost:9191/api/CollectorFarm/person/farm';
  
  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const personId = localStorage.getItem('personId');

      if (!personId) {
        Swal.fire('Error', 'No se encontró el ID del recolector. Por favor inicia sesión nuevamente.', 'error');
        return;
      }

      // Obtener los datos de la persona y luego verificar si está unido a una finca
      this.getPersonData(personId);
    }
  }
  
  private getPersonData(personId: string): void {
    this.http.get(`${this.personApiUrl}/${personId}`).subscribe(
      (response: any) => {
        if (response) {
          this.person = response;
          this.formData.identificationNumber = this.person.numberDocument;

          // Verificar si el usuario ya está unido a una finca
          this.checkFarmJoinStatus(personId);
        } else {
          Swal.fire('Error', 'No se pudo obtener la información del recolector.', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'Error al conectar con el servidor. Inténtalo más tarde.', 'error');
      }
    );
  }

  private checkFarmJoinStatus(personId: string): void {
    this.http.get(`${this.farmApiUrl}/${personId}`).subscribe(
      (response: any) => {
        if (response && response.farmId) {
          // Guardar el estado de la finca en el localStorage
          localStorage.setItem('farmId', response.farmId);
          localStorage.setItem('isJoinedToFarm', 'true');

          // Redirigir al dashboard si está unido a una finca
          this.router.navigate(['/recolector-dashboard']);
        } else {
          // Si no está unido a una finca, mostrar la opción para unirse
          localStorage.setItem('isJoinedToFarm', 'false');
          // No redirigir aquí, permanecer en la vista de unión
        }
      },
      (error) => {
        Swal.fire('Error', 'Error al conectar con el servidor. Inténtalo más tarde.', 'error');
      }
    );
  }

  onSubmit(): void {
    if (!this.formData.identificationNumber || !this.formData.codigoUnico) {
      Swal.fire('Advertencia', 'El número de identificación y el código de finca son requeridos.', 'warning');
      return;
    }

    this.http.post(this.joinApiUrl, this.formData, { observe: 'response' }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          const farmId = response.body?.farmId;
          const successMessage = response.body?.message || 'Unión exitosa a la finca.';

          if (farmId) {
            // Guardar el ID de la finca en localStorage y en el servidor
            localStorage.setItem('farmId', farmId);
            localStorage.setItem('isJoinedToFarm', 'true');
            
            Swal.fire('Éxito', successMessage, 'success').then(() => {
              this.router.navigate(['/recolector-dashboard']);
            });
          } else {
            Swal.fire('Error', 'No se recibió el ID de la finca. Intenta nuevamente.', 'error');
          }
        } else {
          Swal.fire('Advertencia', 'No se pudo unir a la finca. Intenta nuevamente.', 'warning');
        }
      },
      (error) => {
        Swal.fire('Error', 'No se pudo unir a la finca. Verifica el número de identificación y código.', 'error');
      }
    );
  }
}
