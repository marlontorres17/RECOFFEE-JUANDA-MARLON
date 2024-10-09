import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgsComponent } from "../../svgs/svgs.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, RouterLinkActive, SvgsComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private http: HttpClient) {} // Inyectar HttpClient

  onSubmit(contactForm: NgForm) {
    const { name, email, message } = contactForm.value;

    // Enviar el correo electrónico
    const formData = { name, email, message };

    this.http.post('http://localhost:9191/api/email/send', formData).subscribe(
      (response) => {
        console.log('Correo enviado exitosamente:', response);
        contactForm.reset(); // Resetea el formulario después de enviar
        alert('¡Mensaje enviado exitosamente!');
      },
      (error) => {
        console.error('Error al enviar el correo:', error);
        alert('Error al enviar el mensaje. Intenta nuevamente.');
      }
    );
  }

  navigateTo(section: string) {
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
