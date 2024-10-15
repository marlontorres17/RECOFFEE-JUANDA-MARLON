import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NgbModule, HttpClientModule],

  
})
export class ResetPasswordComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;
  resetCodeSent: boolean = false;
  errorMessage: string = '';
  userEmail: string = ''; // Almacenar el email del usuario
  private apiUrl = 'http://localhost:9191/api/user'; // Cambia esto a la URL de tu API

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Validaciones para solicitar el código
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
    });

    // Validaciones para restablecer la contraseña
    this.resetForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Email deshabilitado
      resetCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]], // 6 números
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    });
  }

  // Validación de dominio específico (ejemplo: solo acepta '@gmail.com')
  emailDomainValidator(control: any) {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [_, domain] = email.split('@');
      if (domain !== 'gmail.com') {
        return { emailDomain: true };
      }
    }
    return null;
  }

  // Validación para contraseña (mínimo 8 caracteres, 1 mayúscula, 1 número, 1 especial)
  passwordValidator(control: any) {
    const password = control.value;
    if (!password.match(/[A-Z]/) || !password.match(/[0-9]/) || !password.match(/[\W_]/)) {
      return { passwordStrength: true };
    }
    return null;
  }

  // Solicitar código de restablecimiento
  onRequestReset() {
    if (this.requestForm.invalid) return;

    this.userEmail = this.requestForm.value.email; // Guardar el email ingresado

    this.http.post(`${this.apiUrl}/forgot-password`, { email: this.userEmail }, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.resetCodeSent = true;
          this.resetForm.get('email')?.setValue(this.userEmail); // Asignar email al segundo formulario
        },
        error: () => this.errorMessage = 'No se pudo enviar el código. Verifica el correo.'
      });
  }

  // Restablecer contraseña
  onResetPassword() {
    if (this.resetForm.invalid) return;

    const body = {
      email: this.userEmail, // Reutilizar el email guardado
      resetCode: this.resetForm.value.resetCode,
      newPassword: this.resetForm.value.newPassword
    };

    this.http.post(`${this.apiUrl}/reset-password`, body, { responseType: 'text' })
      .subscribe({
        next: () => {
          alert('¡Contraseña restablecida con éxito!');
          this.router.navigate(['/login']);
        },
        error: () => this.errorMessage = 'El código es inválido o ha expirado.'
      });
  }
}