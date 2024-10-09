import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-crear-finca',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './crear-finca.component.html',
  styleUrls: ['./crear-finca.component.css']
})
export class CrearFincaComponent implements OnInit {
  farms: any[] = [];
  farm: any = {
    id: 0,
    state: true,
    name: '',
    description: '',
    sizeMeter: 0,
    coordinate: '',
    personId: 0,
    cityId: 0
  };
  lot: any = {
    id: 0,
    state: true,
    name: '',
    description: '',
    sizeMeters: "",
    farmId: 0
  };
  persons: any[] = [];
  cities: any[] = [];
  farmId: number = 0;
  private apiUrl = 'http://localhost:9191/api/Farm';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private cityApiUrl = 'http://localhost:9191/api/City';
  private lotApiUrl = 'http://localhost:9191/api/Lot';

  @ViewChild('farmModal') farmModal!: TemplateRef<any>;
  @ViewChild('lotModal') lotModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    this.getFarms();
    this.getPersons();
    this.getCities();
  }

  getFarms(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (farms) => {
        this.farms = farms;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching farms:', error);
      }
    );
  }

  getPersons(): void {
    this.http.get<any[]>('http://localhost:9191/api/Person/admins').subscribe(
      (persons) => {
        this.persons = persons;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching persons with admin role:', error);
      }
    );
  }
  

  /*getPersons(): void {
    this.http.get<any[]>(this.personApiUrl).subscribe(
      (persons) => {
        this.persons = persons;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching persons:', error);
      }
    );
  }
*/
  viewLots(farmId: number): void {
    this.router.navigate(['/seguridad/lotes', farmId]);
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

  getPersonName(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? person.firstName : 'N/A';
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : 'N/A';
  }

  onSubmit(form: NgForm): void {
    const farmDto = { ...this.farm };

    if (this.farm.id === 0) {
      this.http.post(this.apiUrl, farmDto).subscribe(
        (response) => {
          this.getFarms();
          Swal.fire('Éxito', 'Finca agregada correctamente', 'success');
        },
        (error) => {
          console.error('Error adding farm:', error);
        }
      );
    } else {
      this.http.put(`${this.apiUrl}/${this.farm.id}`, farmDto).subscribe(
        (response) => {
          this.getFarms();
          Swal.fire('Éxito', 'Finca actualizada correctamente', 'success');
        },
        (error) => {
          console.error('Error updating farm:', error);
        }
      );
    }

    form.reset();
    this.modalService.dismissAll();
  }

  onSubmitLot(form: NgForm): void {
    const lotDto = { ...this.lot };

    if (this.lot.id === 0) {
      this.http.post(this.lotApiUrl, lotDto).subscribe(
        (response) => {
          this.getFarms();
          Swal.fire('Éxito', 'Lote agregado correctamente', 'success');
        },
        (error) => {
          console.error('Error adding lot:', error);
        }
      );
    } else {
      this.http.put(`${this.lotApiUrl}/${this.lot.id}`, lotDto).subscribe(
        (response) => {
          this.getFarms();
          Swal.fire('Éxito', 'Lote actualizado correctamente', 'success');
        },
        (error) => {
          console.error('Error updating lot:', error);
        }
      );
    }

    form.reset();
    this.modalService.dismissAll();
  }

  editFarm(farm: any): void {
    this.farm = { ...farm };
    this.modalService.open(this.farmModal);
  }

  deleteFarm(farmId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${farmId}`).subscribe(
          () => {
            this.getFarms();
            Swal.fire('Eliminado!', 'La finca ha sido eliminada.', 'success');
          },
          (error) => {
            console.error('Error deleting farm:', error);
          }
        );
      }
    });
  }

  openFarmModal(): void {
    this.farm = { id: 0, state: true, name: '', description: '', sizeMeter: "", coordinate: '', personId: 0, cityId: 0 };
    this.modalService.open(this.farmModal);
  }

  openLotModal(farmId: number): void {
    this.lot = { id: 0, state: true, name: '', description: '', sizeMeters: "", farmId: farmId };
    this.modalService.open(this.lotModal);
  }
}
