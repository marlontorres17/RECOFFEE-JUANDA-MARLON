import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Asegúrate de que esto esté disponible solo en el entorno del navegador
  if (typeof window !== 'undefined') {
    
    // Permitir acceso a la página de landing
    if (route.url[0]?.path === 'landing') {
      return true;  
    }

    // Verificar el estado de autenticación
    const isLogged = localStorage.getItem('isLogged') === 'true';
    const roleId = localStorage.getItem('roleId');
    const farmId = localStorage.getItem('farmId');

if (!isLogged) {
    console.log('No está logueado, redirigiendo a /login');
    router.navigate(['/login']);
    return false;
}

// Verificar si el recolector tiene una finca asociada
// En el authGuard
if (roleId === 'recolector' && !farmId) {
  console.log('Recolector sin finca asociada, redirigiendo a /join-farm');
  router.navigate(['/join-farm']);
  return false;
}


    // Control de acceso por roles
    // Admin dashboard
    if (route.url[0]?.path === 'admin-dashboard' && roleId !== 'admin') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

    // Recolector dashboard
    if (route.url[0]?.path === 'recolector-dashboard' && roleId !== 'recolector') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }

    // Usuario dashboard
    if (route.url[0]?.path === 'usuario-dashboard' && roleId !== 'usuario') {
      console.log('Rol no autorizado, redirigiendo a /login');
      router.navigate(['/login']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
