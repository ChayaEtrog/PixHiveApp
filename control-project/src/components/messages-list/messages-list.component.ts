import { Component, inject } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { Message } from '../../types/Message';
import { MatCardModule } from '@angular/material/card';;
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { AddMessageComponent } from '../add-message/add-message.component';


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
          console.log('Message updated successfully:', response);
          message.isActive = !message.isActive;
        },
        error: (error) => {
          console.error('Error updating message:', error);
        }
      });
  }
}
