import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: any[] = [];
  role: any = { id: 0, name: '', description: '', state: false };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/Role';

  @ViewChild('roleModal') roleModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (roles) => {
        this.roles = roles;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    const roleDto = { ...this.role };

    if (this.role.id === 0) {
      this.http.post(this.apiUrl, roleDto).subscribe(() => {
        this.getRoles();  
        form.resetForm();  
        this.resetForm();  
        Swal.fire('Success', 'Rol creado exitosamente!', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.role.id}`, roleDto).subscribe(() => {
        this.getRoles();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Rol actualizado exitosamente!', 'success');
      });
    }
  }

  editRole(role: any): void {
    this.role = { ...role };
    this.openModal();
  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Estás de acuerdo?',
      text: `Estás a punto de eliminar este rol. ¡Esta acción no se puede deshacer!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getRoles();
          Swal.fire('Deleted!', 'Rol eliminado.', 'success');
        });
      }
    });
  }

  openModal(): void {
    this.modalService.open(this.roleModal).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  resetForm(): void {
    this.role = { id: 0, name: '', description: '', state: false };
  }
}
