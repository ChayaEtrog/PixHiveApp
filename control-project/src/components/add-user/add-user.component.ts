import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserPostModel } from '../../types/UserPostModel';
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
  selector: 'app-add-user',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  @Output()closeForm= new EventEmitter<void>();
  addUserForm: FormGroup;
  userTypes: string[]=["student", "teacher", "admin"]
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });
  
    constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
      this.addUserForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        phoneNumber: ['', Validators.required]
      });
    }
  
    onSubmit() {
      if (this.addUserForm.valid) {
        this.userService.addUser(
          new UserPostModel(
          this.addUserForm.value.name,
          this.addUserForm.value.email,
          this.addUserForm.value.phoneNumber,
          this.addUserForm.value.password,
          )
        ).subscribe(response => {
          this.closeForm.emit();
          this.router.navigate(['/users']);
        }, error => {
          this.notyf.error(`${error.error}`);
        });
      }
    }
}
