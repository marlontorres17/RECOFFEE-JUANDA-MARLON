import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  cities: any[] = [];
  departments: any[] = [];
  city: any = { id: 0, name: '', description: '', coordinate: '', departmentId: 0, state: true };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/City';
  private departmentApiUrl = 'http://localhost:9191/api/Department';

  @ViewChild('cityModal') cityModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getCities();
    this.getDepartments();
  }

  getCities(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (cities) => {
        this.cities = cities;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  getDepartments(): void {
    this.http.get<any[]>(this.departmentApiUrl).subscribe(
      (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    const cityDto = { ...this.city };

    if (this.city.id === 0) {
      this.http.post(this.apiUrl, cityDto).subscribe(() => {
        this.getCities();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Ciudad creada exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.city.id}`, cityDto).subscribe(() => {
        this.getCities();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Ciudad actualizada exitosamente', 'success');
      });
    }
  }

  openModal(city: any = { id: 0, name: '', description: '', coordinate: '', departmentId: 0, state: true }): void {
    this.city = { ...city };
    this.modalService.open(this.cityModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editCity(city: any): void {
    this.openModal(city);
  }

  deleteCity(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar esta ciudad. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getCities();
          Swal.fire('Deleted!', 'Ciudad eliminada.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.city = { id: 0, name: '', description: '', coordinate: '', departmentId: 0, state: true };
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

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  }
}
