import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SvgsComponent } from "../svgs/svgs.component";
import { ModuleComponent } from '../pages/module/module.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ModuleComponent, SvgsComponent],
  templateUrl: './usuario-dashboard.component.html',
  styleUrl: './usuario-dashboard.component.css'
})
export class UsuarioDashboardComponent {
 // Almacena el nombre del submenú abierto
 openDropdown: string | null = null;

 // Abre o cierra el submenú según sea necesario
 toggleDropdown(menu: string) {
   this.openDropdown = this.openDropdown === menu ? null : menu;
 }

 // Verifica si el submenú está abierto
 isDropdownOpen(menu: string): boolean {
   return this.openDropdown === menu;
 }
constructor(private router: Router) {}
logout() {
  localStorage.clear(); 
  this.router.navigate(['/login']);
}
}
