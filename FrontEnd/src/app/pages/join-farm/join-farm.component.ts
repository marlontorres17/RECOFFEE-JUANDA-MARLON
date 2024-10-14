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
        console.log('personId desde localStorage:', personId);

        if (!personId) {
            Swal.fire('Error', 'No se encontró el ID del recolector. Por favor inicia sesión nuevamente.', 'error');
            return;
        }

        // Obtener los datos de la persona
        this.http.get(`${this.personApiUrl}/${personId}`).subscribe(
            (response: any) => {
                if (response) {
                    this.person = response;
                    this.formData.identificationNumber = this.person.numberDocument;

                    // Verificar si el usuario ya está unido a una finca
                    this.http.get(`${this.farmApiUrl}/${personId}`).subscribe(
                        (response: any) => {
                            console.log('Respuesta de la API de finca:', response); // Ver respuesta de la API
                            
                            if (response && response.id) {
                                console.log('Unido a finca, guardando farmId:', response.id);
                                localStorage.setItem('farmId', response.id);
                                localStorage.setItem('isJoinedToFarm', 'true'); // Guardar estado
                                this.router.navigate(['/recolector-dashboard']); // Redirigir al dashboard
                            } else {
                                console.log('El recolector aún no está unido a ninguna finca.');
                                Swal.fire('Info', 'No estás unido a ninguna finca.', 'info');
                            }
                        },
                        (error) => {
                            console.error('Error al verificar la finca del recolector:', error);
                            Swal.fire('Error', 'Error al conectar con el servidor. Inténtalo más tarde.', 'error');
                        }
                    );
                } else {
                    console.error('No se pudo obtener la persona.');
                    Swal.fire('Error', 'No se pudo obtener la información del recolector.', 'error');
                }
            },
            (error) => {
                console.error('Error al obtener la persona:', error);
                Swal.fire('Error', 'Error al conectar con el servidor. Inténtalo más tarde.', 'error');
            }
        );
    }
}

onSubmit(): void {
  if (!this.formData.identificationNumber || !this.formData.codigoUnico) {
      Swal.fire('Advertencia', 'El número de identificación y el código de finca son requeridos.', 'warning');
      return;
  }

  console.log('Datos enviados:', this.formData);

  this.http.post(this.joinApiUrl, this.formData, { observe: 'response' }).subscribe(
      (response: any) => {
          console.log('Respuesta del servidor al unir a la finca:', response);
          if (response.status === 200) {
              const farmId = response.body?.farmId;
              const successMessage = response.body?.message || 'Unión exitosa a la finca.';

              console.log('ID de la finca:', farmId);

              if (farmId) {
                  Swal.fire('Éxito', successMessage, 'success').then(() => {
                      localStorage.setItem('isJoinedToFarm', 'true'); // Guardar estado
                      localStorage.setItem('farmId', farmId); // Guardar farmId

                      console.log('isJoinedToFarm guardado:', localStorage.getItem('isJoinedToFarm'));
                      console.log('farmId guardado:', localStorage.getItem('farmId'));

                      setTimeout(() => {
                          this.router.navigate(['/recolector-dashboard']).then(() => {
                              window.history.pushState(null, '', window.location.href);
                          });
                      }, 1000);
                  });
              } else {
                  Swal.fire('Error', 'No se recibió el ID de la finca. Intenta nuevamente.', 'error');
              }
          } else {
              Swal.fire('Advertencia', 'No se pudo unir a la finca. Intenta nuevamente.', 'warning');
          }
      },
      (error) => {
          console.error('Error:', error);
          Swal.fire('Error', 'No se pudo unir a la finca. Verifica el número de identificación y código.', 'error');
      }
  );
}
}