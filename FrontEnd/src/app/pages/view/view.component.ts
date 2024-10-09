import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  views: any[] = [];
  modules: any[] = [];
  view: any = { id: 0, name: '', description: '', route: '', moduleId: 0, state: true };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/View';
  private moduleApiUrl = 'http://localhost:9191/api/Module';

  @ViewChild('viewModal') viewModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getViews();
    this.getModules();
  }

  getViews(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (views) => {
        this.views = views;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching views:', error);
      }
    );
  }

  getModules(): void {
    this.http.get<any[]>(this.moduleApiUrl).subscribe(
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
    const viewDto = { ...this.view };

    if (this.view.id === 0) {
      this.http.post(this.apiUrl, viewDto).subscribe(() => {
        this.getViews();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Vista Creada exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.view.id}`, viewDto).subscribe(() => {
        this.getViews();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'Vista actualizada exitosamente', 'success');
      });
    }
  }

  openModal(view: any = { id: 0, name: '', description: '', route: '', moduleId: 0, state: true }): void {
    this.view = { ...view };
    this.modalService.open(this.viewModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editView(view: any): void {
    this.openModal(view);
  }

  deleteView(id: number): void {
    Swal.fire({
      title: 'Estás seguro??',
      text: 'Estás a punto de eliminar esta vista. ¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c3ce6',
      cancelButtonColor: '#1a0028',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getViews();
          Swal.fire('Deleted!', 'Vista eliminada.', 'success');
        });
      }
    });
  }

  private resetForm(): void {
    this.view = { id: 0, name: '', description: '', route: '', moduleId: 0, state: true };
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

  getModuleName(moduleId: number): string {
    const module = this.modules.find(m => m.id === moduleId);
    return module ? module.name : 'N/A';
  }
}
