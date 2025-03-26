import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { Notyf } from 'notyf';

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
  messageForm: FormGroup;
    private notyf = new Notyf({
      duration: 40000, // 40 שניות
      position: { x: 'center', y: 'top' }, // מיקום למעלה באמצע
      dismissible: true // אפשרות לסגירה
    });

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]],
      isActive: [true]
    });
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      this.messageService.addMessage(
        {message: this.messageForm.value.message,isActive: this.messageForm.value.isActive}
      ).subscribe(response => {
        this.formClosed.emit();
      }, error => {
        this.notyf.error(`${error.error}`)
      });
    }
  }
}
