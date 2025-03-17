import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { UsersListComponent } from '../components/users-list/users-list.component';
import { authGuard } from '../guards/auth.guard';
import { AdminAuthComponent } from '../components/admin-auth/admin-auth.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginFormComponent},
    { path: 'admin-auth', component: AdminAuthComponent},
    { path: 'users', component: UsersListComponent,canActivate:[authGuard]}
];
