import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-home-recolector',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Agrega CommonModule aquí
  templateUrl: './home-recolector.component.html',
  styleUrls: ['./home-recolector.component.css']
})
export class HomeRecolectorComponent implements OnInit {
  selectedFarm: any; // Cambia el tipo según tu modelo de datos
  persons: any[] = []; // Array para almacenar las personas

  private farmApiUrl = 'http://localhost:9191/api/CollectorFarm/person';
  private personApiUrl = 'http://localhost:9191/api/Person'; // Endpoint para obtener personas

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getFarmData();
    this.getPersons(); // Llama al método para cargar las personas
  }

  getFarmData(): void {
    const personId = localStorage.getItem('personId'); // Obtener el ID de la persona desde localStorage

    if (personId) {
      this.http.get(`${this.farmApiUrl}/${personId}`).subscribe(
        (data) => {
          this.selectedFarm = data; // Asigna los datos de la finca a selectedFarm
        },
        (error) => {
          console.error('Error al obtener los datos de la finca:', error);
        }
      );
    } else {
      console.error('No se encontró el ID de la persona en localStorage');
    }
  }

  getPersons(): void {
    this.http.get<any[]>(this.personApiUrl).subscribe(
      (data) => {
        this.persons = data; // Cargar las personas
      },
      (error) => {
        console.error('Error al obtener las personas:', error);
      }
    );
  }

  getPersonFullNameById(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? `${person.firstName} ${person.secondLastName}` : 'Desconocido';
  }
}
