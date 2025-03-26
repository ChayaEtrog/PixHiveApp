import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../types/User';
import { ReactiveFormsModule } from '@angular/forms';
import { UserPostModel } from '../../types/UserPostModel';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  @Output() formClosed = new EventEmitter<void>();
  registerForm: FormGroup;
  userTypes: string[] = ["student", "teacher", "admin"]
  private notyf = new Notyf({
    duration: 40000, // 40 שניות
    position: { x: 'center', y: 'top' }, // מיקום למעלה באמצע
    dismissible: true // אפשרות לסגירה
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phoneNumber: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(
        new UserPostModel(
          this.registerForm.value.name,
          this.registerForm.value.email,
          this.registerForm.value.phoneNumber,
          this.registerForm.value.password,
        )
      ).subscribe(response => {
        this.router.navigate(['/admin-auth']);
        this.formClosed.emit();
      }, error => {
        this.notyf.error(`Registration failed ${error.error}`);
        console.error('Registration failed', error);
      });
    }
  }
}
