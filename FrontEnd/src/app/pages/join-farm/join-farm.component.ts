import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';

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

  private joinApiUrl = 'http://localhost:9191/api/JoinFarmPerson/join';
  private farmApiUrl = 'http://localhost:9191/api/CollectorFarm/person';
  
  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const personId = localStorage.getItem('personId');

      if (!personId) {
        console.warn('No se encontró personId en localStorage. Redirigiendo al login.');
        this.router.navigate(['/login']);
        return;
      }

      // Verificar si el usuario ya está unido a una finca
      this.http.get(`${this.farmApiUrl}/${personId}`).subscribe(
        (response: any) => {
          if (response && response.id) { // Cambié 'farmId' a 'id', ya que podría no estar definido en el DTO
            localStorage.setItem('farmId', response.id);
            localStorage.setItem('isJoinedToFarm', 'true');
            this.router.navigate(['/recolector-dashboard']);
          } else {
            console.warn('El recolector no está unido a ninguna finca.');
          }
        },
        (error) => {
          if (error.status === 404) {
            console.error('No se encontró el recolector. Asegúrate de que el ID sea correcto.');
            alert('No se encontró el recolector. Por favor verifica el ID.');
          } else {
            console.error('Error al verificar la finca del recolector:', error);
            alert('Error al conectar con el servidor. Inténtalo más tarde.');
          }
        }
      );
    }
  }

  onSubmit(): void {
    if (!this.formData.identificationNumber || !this.formData.codigoUnico) {
      alert('Número de identificación y código de finca son requeridos.');
      return;
    }

    this.http.post(this.joinApiUrl, this.formData, { observe: 'response', responseType: 'text' }).subscribe(
      (response) => {
        if (response.status === 200 || response.status === 204) {
          alert('Te has unido exitosamente a la finca.');
          localStorage.setItem('isJoinedToFarm', 'true');

          this.router.navigate(['/recolector-dashboard']).then(() => {
            window.history.pushState(null, '', window.location.href);
          });
        }
      },
      (error) => {
        console.error('Error:', error);
        alert('Error al unirse a la finca.');
      }
    );
  }
}
