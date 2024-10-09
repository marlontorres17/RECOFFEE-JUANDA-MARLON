import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  modules: any[] = [];
  module: any = { id: 0, name: '', description: '', code: '', state: false };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/Api/Module';

  @ViewChild('moduleModal') moduleModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getModules();
  }

  getModules(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (modules) => {
        this.modules = modules;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching modules:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    const moduleDto = { ...this.module };

    if (this.module.id === 0) {
      this.http.post(this.apiUrl, moduleDto).subscribe(() => {
        this.getModules();  
        form.resetForm();  
        this.resetForm();  
        Swal.fire('Success', 'Modulo creado exitosamente!', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.module.id}`, moduleDto).subscribe(() => {
        this.getModules();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Modulo actualizado exitosamente!', 'success');
      });
    }
  }

  openModal(module: any = { id: 0, name: '', description: '', code: '', state: false }): void {
    this.module = { ...module };
    this.modalService.open(this.moduleModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editModule(module: any): void {
    this.openModal(module);
  }

  deleteModule(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar este modulo. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getModules();
          Swal.fire('Deleted!', 'Modulo eliminado.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.module = { id: 0, name: '', description: '', code: '', state: false };
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
