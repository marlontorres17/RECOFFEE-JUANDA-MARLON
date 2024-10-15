import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink, RouterLinkActive]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('isLogged') === 'true';
      const roleId = localStorage.getItem('roleId');
      const farmId = localStorage.getItem('farmId');
  
      // Redirigir al dashboard correspondiente basado en el rol
      if (isLogged) {
        if (roleId === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (roleId === 'recolector') {
          if (farmId) {
            // Si ya está unido a una finca, redirigir al dashboard del recolector
            this.router.navigate(['/recolector-dashboard']);
          } else {
            // Si no tiene finca asociada, redirigir a unirse a una finca
            this.router.navigate(['/join-farm']);
          }
        } else {
          this.router.navigate(['/usuario-dashboard']);
        }
      }
    }
  }
  
  login() {
    if (this.loginForm.invalid) {
      // Mostrar alerta si el formulario es inválido
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const loginPayload = this.loginForm.value;

    this.http.post<any>('http://localhost:9191/api/Login/login', loginPayload)
      .subscribe(
        response => {
          console.log('Respuesta completa del backend:', response);

          // Verificar si el campo userId está presente en la respuesta
          if (response && response.userId) {
            const userId = response.userId; // Aquí obtenemos el userId directamente de la respuesta
            const personId = response.personId; // Obtiene el personId
            const roles = response.roles || [];
            const farmId = response.farmId;

            console.log('UserId:', userId); // Depurar: Verificar el userId
            console.log('PersonId:', personId); // Depurar: Verificar el personId
            console.log('Roles:', roles); // Depurar: Verificar los roles

            // Asegurarse de que el userId y personId estén presentes
            if (userId && personId && roles.length > 0) {
              // Guardar datos en el localStorage
              localStorage.setItem('userId', userId.toString()); // Guardamos el userId
              localStorage.setItem('personId', personId.toString()); // Guardamos el personId
              localStorage.setItem('isLogged', 'true');
              localStorage.setItem('roleId', roles[0]); // Guardamos el primer rol
              console.log('FarmId:', farmId);

              // Verificar si el rol es de recolector y redirigir
              if (roles[0] === 'recolector') {
                const farmId = response.farmId;
                if (farmId) {
                  localStorage.setItem('farmId', farmId);
                  localStorage.setItem('isJoinedToFarm', 'true'); 
                  
                  this.router.navigate(['/recolector-dashboard']); // Redirige al dashboard
                } else {
                  localStorage.setItem('isJoinedToFarm', 'false'); // Actualiza el estado de unión a finca
                  this.router.navigate(['/join-farm']); // Redirige si no está unido a una finca
                }
              } 
              // **Aquí está el cambio para el admin**
              else if (roles[0] === 'admin') {
                localStorage.setItem('farmId', ''); // Almacena un valor vacío o null para la finca
                this.router.navigate(['/admin-dashboard']); // Redirige al dashboard del admin
              } else {
                this.router.navigate(['/usuario-dashboard']);
              }
            } else {
              this.errorMessage = 'Error de autenticación. Intenta nuevamente.';
              console.error('Error: userId o personId no están presentes en la respuesta');
            }
          } else {
            this.errorMessage = 'Error de autenticación. Intenta nuevamente.';
            console.error('Error: No se recibió userId en la respuesta');
          }
        },
        error => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
        }
      );
  }
}
