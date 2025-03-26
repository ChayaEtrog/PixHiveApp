import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginFormComponent } from "../login-form/login-form.component";
import { RegisterFormComponent } from "../register-form/register-form.component";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 public authService = inject(AuthService);
 
  isLogInOpen: boolean = false;
  isRegisterOpen: boolean = false;

  loginFormClose() {
    this.isLogInOpen = false;
  }

  registerFormClose() {
    this.isRegisterOpen = false;
  }
}
