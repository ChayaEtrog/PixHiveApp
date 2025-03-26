import { Component, inject } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { Message } from '../../types/Message';
import { MatCardModule } from '@angular/material/card';;
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { AddMessageComponent } from '../add-message/add-message.component';
import { ThemePalette } from '@angular/material/core';
import { Notyf } from 'notyf';


@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule,MatCardModule, FormsModule, MatSlideToggleModule,AddMessageComponent],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent {
  private messageService = inject(MessageService);
  private router = inject(Router)
  messages: Message[] = [];
  addMessage: boolean = false;
  color: ThemePalette = 'primary';
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });
  
  ngOnInit() {
    this.messageService.loadMessages();
    this.messageService.messages$.subscribe(messages => {
      if (messages) {
        this.messages = messages;
      }
    });
  }

  closeAddMessage() {
    this.addMessage = false;
  }
  
  updateMessageStatus(message: Message) {
    this.messageService.toggleMessageStatus(message.id)
      .subscribe({
        next: (response) => {
          message.isActive = !message.isActive;
        },
        error: (error) => {
          this.notyf.error(`${error.error}`)
        }
      });
  }
}
