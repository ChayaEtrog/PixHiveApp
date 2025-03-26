import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [LoginFormComponent,RegisterFormComponent,CommonModule,MatButtonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {

  constructor(public userService: AuthService) { }
  
  isFormLoginOpen: boolean = false;
  isFormRegisterOpen: boolean = false;

  FormRegisterClose() {
    this.isFormRegisterOpen = false;
  }

  FormLoginClose() {
    this.isFormLoginOpen = false;
  }
}
