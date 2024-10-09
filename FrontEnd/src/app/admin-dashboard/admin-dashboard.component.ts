import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SvgsComponent } from "../svgs/svgs.component";
import { ModuleComponent } from '../pages/module/module.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ModuleComponent, SvgsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'] // Corrige la propiedad de estilo
})
export class AdminDashboardComponent {
  // Almacena el nombre del submenú abierto
  openDropdown: string | null = null;

  // Estado de los menús de perfil y notificaciones
  isProfileMenuOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  notificationCount: number = 3; // Cambia según tu lógica
  notifications: string[] = [
    'Notificación 1',
    'Notificación 2',
    'Notificación 3'
  ];

  // Abre o cierra el submenú según sea necesario
  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
  }
 
  // Verifica si el submenú está abierto
  isDropdownOpen(menu: string): boolean {
    return this.openDropdown === menu;
  }

  constructor(private router: Router) {}

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isNotificationsOpen = false; // Cerrar el menú de notificaciones si está abierto
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isProfileMenuOpen = false; // Cerrar el menú de perfil si está abierto
  }

  logout() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}
