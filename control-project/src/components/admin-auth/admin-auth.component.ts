import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-auth',
  standalone: true,
  imports: [MatInputModule,
            MatButtonModule,
            MatFormFieldModule,
            MatSelectModule,
            MatCardModule,
            MatToolbarModule,
            MatIconModule,
            ReactiveFormsModule],
  templateUrl: './admin-auth.component.html',
  styleUrl: './admin-auth.component.css'
})
export class AdminAuthComponent {
  adminPassword: string = '';
  userId: number | null = null;
  @Output() close: EventEmitter<any> = new EventEmitter();
    adminForm: FormGroup;

  constructor(private authService: AuthService,private router: Router,private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      password: ['', Validators.required]
    });
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userId = user?.id || null;
  }

  upgradeToAdmin() {
    console.log(this.adminForm.value.password);
    
    if (this.userId ) {
      this.authService.upgradeToAdmin(this.userId, this.adminForm.value.password).subscribe({
        next: response => {
          Swal.fire({
            title: "You have been successfully promoted to manager!",
            icon: "success"
          });
          this.router.navigate(['/home']);
          //this.close.emit();
        },
        error: () => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "The administrator password is incorrect. Try again.",
          });
          this.router.navigate(['/home']);
        }
      });
    }
  }
}
