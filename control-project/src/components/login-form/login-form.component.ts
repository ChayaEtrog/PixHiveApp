import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Output() formClosed = new EventEmitter<void>();
  loginForm: FormGroup;
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.userNameOrEmail,
        this.loginForm.value.password,
      ).subscribe(response => {
        this.router.navigate(['/admin-auth']);
        this.formClosed.emit();
      }, error => {
        this.notyf.error(`${error.error}`);
      });
    }
  }
}
