import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-farm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.css']
})
export class FarmComponent implements OnInit {
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
  persons: any[] = [];
  cities: any[] = [];
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Farm';
  private personApiUrl = 'http://localhost:9191/api/Person';
  private cityApiUrl = 'http://localhost:9191/api/City';

  @ViewChild('farmModal') farmModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

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
      this.http.post(this.apiUrl, farmDto).subscribe(() => {
        this.getFarms();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Farm created successfully', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.farm.id}`, farmDto).subscribe(() => {
        this.getFarms();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Farm updated successfully', 'success');
      });
    }
  }

  openModal(farm: any = { id: 0, state: true, name: '', description: '', sizeMeter: 0, coordinate: '', personId: 0, cityId: 0 }): void {
    this.farm = { ...farm };
    this.modalService.open(this.farmModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editFarm(farm: any): void {
    this.openModal(farm);
  }

  deleteFarm(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar esta. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getFarms();
          Swal.fire('Deleted!', 'Farm has been deleted.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.farm = { id: 0, state: true, name: '', description: '', sizeMeter: 0, coordinate: '', personId: 0, cityId: 0 };
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
