// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ModuleComponent } from './pages/module/module.component';
import { PersonComponent } from './pages/person/person.component';
import { ViewComponent } from './pages/view/view.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';
import { RoleComponent } from './pages/role/role.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { CountryComponent } from './pages/country/country.component';
import { DepartmentComponent } from './pages/department/department.component';
import { CityComponent } from './pages/city/city.component';
import { FarmComponent } from './pages/farm/farm.component';
import { LotComponent } from './pages/lot/lot.component';
import { BenefitComponent } from './pages/benefit/benefit.component';
import { PersonBenefitComponent } from './pages/person-benefit/person-benefit.component';
import { HarvestComponent } from './pages/harvest/harvest.component';
import { LiquidationComponent } from './pages/liquidation/liquidation.component';
import { CollectionDetailComponent } from './pages/collection-detail/collection-detail.component';
import { CrearFincaComponent } from './pages/crear-finca/crear-finca.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { HomeRecolectorComponent } from './pages/home-recolector/home-recolector.component';
import { JoinFarmComponent } from './pages/join-farm/join-farm.component';
import { UsleComponent } from './pages/usle/usle.component';
import { RoviComponent } from './pages/rovi/rovi.component';
import { RecolectorDashboardComponent } from './recolector-dashboard/recolector-dashboard.component';
import { CollectorFarmComponent } from './pages/collector-farm/collector-farm.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeUsuarioComponent } from './pages/home-usuario/home-usuario.component';
import { UsuarioDashboardComponent } from './usuario-dashboard/usuario-dashboard.component';

export const routes: Routes = [
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'homeAdmin', component: HomeComponent },
      { path: 'modulo', component: ModuleComponent },
      { path: 'role', component: RoleComponent },
      { path: 'rovi', component: RoviComponent },
      { path: 'person', component: PersonComponent },
      { path: 'user', component: UserComponent },
      { path: 'userRol', component: UsleComponent },
      { path: 'view', component: ViewComponent },
      { path: 'country', component: CountryComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'city', component: CityComponent },
      { path: 'farm', component: FarmComponent },
      { path: 'lot', component: LotComponent },
      { path: 'benefit', component: BenefitComponent },
      { path: 'person-benefit', component: PersonBenefitComponent },
      { path: 'harvest', component: HarvestComponent },
      { path: 'liquidation', component: LiquidationComponent },
      { path: 'collection-detail', component: CollectionDetailComponent },
      { path: 'crear-finca', component: CrearFincaComponent },
      { path: 'ver-finca', component: CollectorFarmComponent },
      { path: '', redirectTo: 'homeAdmin', pathMatch: 'full' } // Redirección por defecto
    ]
  },

  {
    path: 'recolector-dashboard',
    component: RecolectorDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'homeRecolector', component: HomeRecolectorComponent },
      { path: 'benefit', component: BenefitComponent },
      { path: 'person-benefit', component: PersonBenefitComponent },
      { path: 'liquidation', component: LiquidationComponent },
      { path: '', redirectTo: 'homeRecolector', pathMatch: 'full' }
    ]
  },

  {
    path: 'usuario-dashboard',
    component: UsuarioDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'homeUser', component: HomeUsuarioComponent },
      { path: '', redirectTo: 'homeUser', pathMatch: 'full' }
    ]
  },

  { path: 'join-farm', component: JoinFarmComponent },
  {path: 'landing', component: LandingComponent},
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },  
  { path: '**', redirectTo: '/landing' } 
  
  
];
