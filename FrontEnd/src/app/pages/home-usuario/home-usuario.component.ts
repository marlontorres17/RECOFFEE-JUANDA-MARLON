import { Component } from '@angular/core';
import { SvgsComponent } from '../../svgs/svgs.component';
import { ModuleComponent } from '../module/module.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ModuleComponent,
    SvgsComponent,
    HttpClientModule
  ],
  templateUrl: './home-usuario.component.html',
  styleUrls: ['./home-usuario.component.css']
})
export class HomeUsuarioComponent {
  private baseUrl = 'http://localhost:9191/api/User'; 

  constructor(private http: HttpClient, private router: Router) {}

  navigateToAdmin() {
    this.assignRole('admin');
  }

  navigateToCollector() {
    this.assignRole('recolector');
  }

  private assignRole(newRoleName: string) {
    const userId = this.getUser();

    if (userId === null) {
        console.error('User ID no encontrado.');
        alert('Error: Usuario no encontrado. Por favor, inicia sesión nuevamente.');
        return;
    }

    console.log('Asignando rol:', newRoleName, 'a User ID:', userId);

    const body = JSON.stringify(newRoleName);

    this.http.put(`${this.baseUrl}/${userId}/role`, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
        response => {
            console.log('Rol asignado con éxito', response);

            // Actualizar el localStorage
            localStorage.setItem('userRole', newRoleName);
            localStorage.setItem('roleId', newRoleName); // Asegúrate de actualizar el roleId aquí

            // Redirigir sin recargar la página
            if (newRoleName === 'admin') {
                this.router.navigate(['/admin-dashboard']);
            } else if (newRoleName === 'recolector') {
                this.router.navigate(['/recolector-dashboard']);
            }
        },
        (error: HttpErrorResponse) => {
            // Verificar si el estado es 200 pero Angular lo trata como error
            if (error.status === 200) {
                console.log('Rol actualizado exitosamente, pero Angular lo interpretó como error.');

                // Actualizar el localStorage
                localStorage.setItem('userRole', newRoleName);
                localStorage.setItem('roleId', newRoleName); // Asegúrate de actualizar el roleId aquí

                // Redirigir a la página correcta
                if (newRoleName === 'admin') {
                    this.router.navigate(['/admin-dashboard']);
                } else if (newRoleName === 'recolector') {
                    this.router.navigate(['/recolector-dashboard']);
                }
            } else {
                console.error('Error real al asignar el rol', error);
                alert('Error al asignar el rol. Por favor, intenta nuevamente.');
            }
        }
    );
}


  private getUser(): number | null {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);
    return userId ? parseInt(userId, 10) : null;
  }
}
