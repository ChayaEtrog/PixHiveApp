import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { UsersListComponent } from '../components/users-list/users-list.component';
import { authGuard } from '../guards/auth.guard';
import { AdminAuthComponent } from '../components/admin-auth/admin-auth.component';
import { UserDetailsComponent } from '../components/user-details/user-details.component';
import { AddUserComponent } from '../components/add-user/add-user.component';
import { MessagesListComponent } from '../components/messages-list/messages-list.component';
import { UserStatisticsComponent } from '../components/user-statistics/user-statistics.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginFormComponent},
    { path: 'admin-auth', component: AdminAuthComponent},
    { path: 'users', component: UsersListComponent,canActivate:[authGuard]},
    { path: 'user/:id', component: UserDetailsComponent,canActivate:[authGuard] },
    { path: 'add-user', component: AddUserComponent ,canActivate:[authGuard]},
    { path: 'messages', component: MessagesListComponent,canActivate:[authGuard] },
    { path: 'user-statistics', component: UserStatisticsComponent,canActivate:[authGuard] },
];
