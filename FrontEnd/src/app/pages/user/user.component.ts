import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  persons: any[] = [];
  user: any = { id: 0, userName: '', password: '', personId: 0, state: true };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/User';
  private personApiUrl = 'http://localhost:9191/api/Person';

  passwordInvalid = false;

  @ViewChild('userModal') userModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUsers();
    this.getPersons();
  }

  getUsers(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (users) => {
        this.users = users;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching users:', error);
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

  onSubmit(form: NgForm): void {

    if (!this.isFormValid()) {
      return;
    }
    const userDto = { ...this.user };

    if (this.user.id === 0) {
      this.http.post(this.apiUrl, userDto).subscribe(() => {
        this.getUsers();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Usuario creado exitosamente', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.user.id}`, userDto).subscribe(() => {
        this.getUsers();
        form.resetForm();
        this.resetForm();
        Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
      });
    }
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;
    return passwordPattern.test(password);
  }

  openModal(user: any = { id: 0, userName: '', password: '', personId: 0, state: true }): void {
    this.user = { ...user };
    this.modalService.open(this.userModal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editUser(user: any): void {
    this.openModal(user);
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Estás de acuerdo?',
      text: `Estás a punto de eliminar este usuario. ¡Esta acción no se puede deshacer!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getUsers();
          Swal.fire('Eliminado!', 'Usuario eliminado.', 'success');
        });
      }
    });
  }

  resetForm(): void {
    this.user = { id: 0, userName: '', password: '', personId: 0, state: true };
  }

  getPersonName(personId: number): string {
    const person = this.persons.find(p => p.id === personId);
    return person ? `${person.firstName} ${person.firstLastName}` : 'N/A';
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

  isFormValid(): boolean {

    if (!this.areAllFieldsFilled()) {
      Swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
      return false;
    }

    if (!this.validatePassword(this.user.password)) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.', 'error');
      return false;
    }

    if (this.user.userName.length > 20) {
      Swal.fire('Error', 'El nombre de usuario no puede exceder los 20 caracteres.', 'error');
      return false;
    }

    return true;
  }

  areAllFieldsFilled(): boolean {
    return (
      this.user.userName.trim() !== '' &&
      this.user.password.trim() !== '' &&
      this.user.personId.trim() !== ''
    );
  }
}
