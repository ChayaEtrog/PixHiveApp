import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { Notyf } from 'notyf';
import { UserService } from '../../services/user.service';
import { User } from '../../types/User';

@Component({
  selector: 'app-add-message',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule],
  templateUrl: './add-message.component.html',
  styleUrl: './add-message.component.css'
})
export class AddMessageComponent {
  @Output() formClosed = new EventEmitter<void>();
  users: User[] = [];
  messageForm: FormGroup;
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true
  });

  constructor(private fb: FormBuilder, private userService: UserService, private messageService: MessageService, private router: Router) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]],
      isActive: [true],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.userService.getUsers();
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      const userId = this.messageForm.value.userId === 'null' ? null : this.messageForm.value.userId;
      const userString = sessionStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null
      const senderId = user?.id;
      this.messageService.addMessage({
        senderId: senderId,
        message: this.messageForm.value.message,
        isActive: this.messageForm.value.isActive,
        receiverId: userId
      }).subscribe(response => {
        this.formClosed.emit();
      }, error => {
        this.notyf.error(`${error.error}`);
      });
    }
  }
}
