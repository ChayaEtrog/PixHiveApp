import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { Message } from '../../types/Message';
import { MatCardModule } from '@angular/material/card';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    MatTooltipModule, MatButtonModule, CommonModule,
    MatCardModule, FormsModule, MatSlideToggleModule,
    AddMessageComponent, MatIconModule
  ],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);
  public isFilterActive = false;
  messages: Message[] = [];
  adminMessages: Message[] = [];
  addMessage: boolean = false;
  color: ThemePalette = 'primary';

  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true
  });

  userEmails: { [userId: number]: string } = {};
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.loadMessages();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMessages() {
    this.messageService.loadMessages();

    const sub = this.messageService.messages$.subscribe(messages => {
      if (messages) {
        this.messages = messages;

        const uniqueUserIds = [...new Set(
          messages
            .map(m => m.receiverId)
            .filter((id): id is number => id !== null && id !== undefined)
        )];

        uniqueUserIds.forEach(userId => {
          if (!this.userEmails[userId]) {
            const userSub = this.userService.getUserById(userId).subscribe(user => {
              this.userEmails[userId] = user.email;
            });
            this.subscriptions.push(userSub);
          }
        });
      }
    });

    this.subscriptions.push(sub);
  }

  closeAddMessage() {
    this.addMessage = false;
  }

  updateMessageStatus(message: Message) {
    this.messageService.toggleMessageStatus(message.id)
      .subscribe({
        next: () => {
          message.isActive = !message.isActive;
        },
        error: (error) => {
          this.notyf.error(`${error.error || 'Error updating message status'}`);
        }
      });
  }

  onDeleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => console.log('Message was deleted'),
      error: err => {
        console.error(err);
        this.notyf.error('Failed to delete message');
      }
    });
  }

  toggleFilterByEmail() {
    const targetEmail = 'x@gmail.com';
    if (this.isFilterActive) {
      this.messages = [...this.adminMessages];
    } else {
      this.adminMessages = this.messages;
      this.messages = this.adminMessages.filter(message => {
        const receiverId = message.receiverId;
        if (!receiverId) return false;
        const email = this.userEmails[receiverId];
        return email === targetEmail;
      });
    }
    this.isFilterActive = !this.isFilterActive;
  }
}
