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
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [MatTooltipModule,MatButtonModule,CommonModule, MatCardModule, FormsModule, MatSlideToggleModule, AddMessageComponent, MatIconModule],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent {
  private messageService = inject(MessageService);
  private userService = inject(UserService)
  private router = inject(Router)
  public isFilterActive = false;
  messages: Message[] = [];
  adminMessages:Message[]=[];
  addMessage: boolean = false;
  color: ThemePalette = 'primary';
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true
  });
  userEmails: { [userId: number]: string } = {};

  ngOnInit() {
    this.loadMessages()
  }

  loadMessages() {
    this.messageService.loadMessages();

    this.messageService.messages$.subscribe(messages => {
      if (messages) {
        this.messages = messages;

        const uniqueUserIds = [...new Set(
          messages
            .map(m => m.receiverId)
            .filter((id): id is number => id !== null && id !== undefined)
        )];

        uniqueUserIds.forEach(userId => {
          if (!this.userEmails[userId]) {
            this.userService.getUserById(userId).subscribe(user => {
              this.userEmails[userId] = user.email;
            });
          }
        });
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

  onDeleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => console.log('message was deleted'),
      error: err => console.error(err)
    });
  }

  toggleFilterByEmail() {
    const targetEmail = 'xxx@gmail.com';
    console.log(this.isFilterActive);
  
    if (this.isFilterActive) {
      this.messages = [...this.adminMessages];
    } else {
      this.adminMessages=this.messages
      this.messages = this.messages.filter(message => {
        const receiverId = message.receiverId;
        if (!receiverId) return false; // התעלמות מהודעות לכלל המשתמשים
        const email = this.userEmails[receiverId];
        return email === targetEmail;
      });
    }
  
    this.isFilterActive = !this.isFilterActive;
  }


}

