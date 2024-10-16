import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SvgsComponent } from "../svgs/svgs.component";
import { ModuleComponent } from '../pages/module/module.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recolector-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ModuleComponent, SvgsComponent],
  templateUrl: './recolector-dashboard.component.html',
  styleUrl: './recolector-dashboard.component.css'
})
export class RecolectorDashboardComponent {
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

  logout(): void {
    // Elimina todos los datos del localStorage, excepto los relacionados con la finca
    const farmId = localStorage.getItem('farmId');
    const isJoinedToFarm = localStorage.getItem('isJoinedToFarm');
  
    localStorage.clear();
  
    // Si el usuario estaba unido a una finca, vuelve a guardar esos valores en localStorage
    if (farmId && isJoinedToFarm === 'true') {
      localStorage.setItem('farmId', farmId);
      localStorage.setItem('isJoinedToFarm', 'true');
    }
  
    // Redirigir al login u otra página
    this.router.navigate(['/login']);
  }
}
