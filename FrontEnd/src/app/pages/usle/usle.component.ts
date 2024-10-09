import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule
  ],
  templateUrl: './usle.component.html',
  styleUrls: ['./usle.component.css']
})
export class UsleComponent implements OnInit {
  usles: any[] = [];
  users: any[] = [];
  roles: any[] = [];
  usle: any = { id: 0, state: true, roleId: 0, userId: 0 };
  closeResult = '';
  private apiUrl = 'http://localhost:9191/api/UserRole';
  private userApiUrl = 'http://localhost:9191/api/User';
  private roleApiUrl = 'http://localhost:9191/api/Role';

  @ViewChild('usleModal') usleModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUsles();
    this.getUsers();
    this.getRoles();
  }

  getUsles(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (usles) => {
        this.usles = usles;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching user roles:', error);
      }
    );
  }

  getUsers(): void {
    this.http.get<any[]>(this.userApiUrl).subscribe(
      (users) => {
        this.users = users;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getRoles(): void {
    this.http.get<any[]>(this.roleApiUrl).subscribe(
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
    const usleDto = { ...this.usle };

    if (this.usle.id === 0) {
      this.http.post(this.apiUrl, usleDto).subscribe(() => {
        this.getUsles();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'User role created successfully', 'success');
      });
    } else {
      this.http.put(`${this.apiUrl}/${this.usle.id}`, usleDto).subscribe(() => {
        this.getUsles();
        form.resetForm();
        this.resetForm();
        Swal.fire('Success', 'User role updated successfully', 'success');
      });
    }
  }

  openModal(usle?: any): void {
    if (usle) {
      this.usle = { ...usle };
    } else {
      this.resetForm();
    }
    this.modalService.open(this.usleModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  editUsle(usle: any): void {
    this.openModal(usle);
  }

  deleteUsle(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.getUsles();
          Swal.fire('Deleted!', 'User role has been deleted.', 'success');
        });
      }
    });
  }

  resetForm(): void {
    this.usle = { id: 0, state: true, roleId: 0, userId: 0 };
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.userName : 'N/A';
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
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
