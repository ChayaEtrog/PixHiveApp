import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { Notyf } from 'notyf';

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
export class AdminAuthComponent implements OnInit {
  adminPassword: string = '';
  userId: number | null = null;
  adminForm: FormGroup;
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true
  });

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  upgradeToAdmin() {
    if (this.userId) {
      this.authService.upgradeToAdmin(this.userId, this.adminForm.value.password).subscribe({
        next: response => {
          this.router.navigate(['/home']);
        },
        error: () => {
          this.notyf.error("The administrator password is incorrect. Try again.")
          this.router.navigate(['/home']);
        }
      });
    }
  }
}
