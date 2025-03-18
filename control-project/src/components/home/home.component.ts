import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginFormComponent } from "../login-form/login-form.component";
import { RegisterFormComponent } from "../register-form/register-form.component"; 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLogInOpen: boolean = false;
  isRegisterOpen: boolean = false;

  loginFormClose(){
    this.isLogInOpen = false;
  }

  registerFormClose(){
    this.isRegisterOpen = false;
  }
}
