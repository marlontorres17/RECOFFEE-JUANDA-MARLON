import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-collector-farm',
  standalone: true,
  templateUrl: './collector-farm.component.html',
  styleUrls: ['./collector-farm.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
})
export class CollectorFarmComponent {
  farmCode: string = '';
  collectors: any[] = [];
  private apiUrl = 'http://localhost:9191/api/CollectorFarm/collectorsByFarmCode';

  constructor(private http: HttpClient) {}

  fetchCollectors(): void {
    if (!this.farmCode) {
      alert('El código de finca es requerido.');
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}/${this.farmCode}`).subscribe(
      (response) => {
        this.collectors = response;
      },
      (error) => {
        console.error('Error:', error);
        alert('Ocurrió un error al obtener los recolectores. Por favor, intenta nuevamente.');
      }
    );
  }
}
