import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];
  countries: any[] = [];
  department: any = { id: 0, name: '', code: '', description: '', countryId: 0, state: true };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Department';
  private countryApiUrl = 'http://localhost:9191/api/Country';

  @ViewChild('departmentModal') departmentModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getCountries();
  }

  getDepartments(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  getCountries(): void {
    this.http.get<any[]>(this.countryApiUrl).subscribe(
      (countries) => {
        this.countries = countries;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    const departmentDto = { ...this.department };

    if (this.department.id === 0) {
      this.http.post(this.apiUrl, departmentDto).subscribe(() => {
        this.getDepartments();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Departamento creado exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.department.id}`, departmentDto).subscribe(() => {
        this.getDepartments();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Departamento actualizado exitosamente', 'success');
      });
    }
  }

  openModal(department: any = { id: 0, name: '', code: '', description: '', countryId: 0, state: true }): void {
    this.department = { ...department };
    this.modalService.open(this.departmentModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editDepartment(department: any): void {
    this.openModal(department);
  }

  deleteDepartment(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar este departamento. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getDepartments();
          Swal.fire('Deleted!', 'Departamento eliminado.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.department = { id: 0, name: '', code: '', description: '', countryId: 0, state: true };
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

  getCountryName(countryId: number): string {
    const country = this.countries.find(c => c.id === countryId);
    return country ? country.name : 'N/A';
  }
}
