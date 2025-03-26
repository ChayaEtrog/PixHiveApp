import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserPostModel } from '../../types/UserPostModel';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../types/User';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { Notyf } from 'notyf';
@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnChanges {
  @Output() closeForm = new EventEmitter<void>();
  @Input() user = new User(-1, '', '', '', '');
  updateUserForm: FormGroup;
  userTypes: string[] = ["student", "teacher", "admin"]
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    console.log(this.user);

    this.updateUserForm = this.fb.group({
      name: [this.user.userName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phoneNumber: [this.user.phoneNumber, Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.updateUserForm = this.fb.group({
        name: [this.user.userName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        phoneNumber: [this.user.phoneNumber, Validators.required]
      });
    }
  }

  onSubmit() {
    if (this.updateUserForm.valid) {
      this.userService.updateUser(
        this.user.id,
        new UserPostModel(
          this.updateUserForm.value.name,
          this.updateUserForm.value.email,
          this.updateUserForm.value.phoneNumber,
          this.user.passwordHash,
        )
      ).subscribe(response => {
        this.closeForm.emit();
      }, error => {
        this.notyf.error(`${error.error}`);
      });
    }
  }
}
