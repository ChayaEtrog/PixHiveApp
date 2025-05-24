import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Message } from '../types/Message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'https://pixhiveapp-production.up.railway.app/api/Message'; 

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMessages(): void {
    this.http.get<Message[]>(this.apiUrl).subscribe(messages => {
      this.messagesSubject.next(messages);
      console.log(this.messages$);
      
    });
  }

  getMessageById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  addMessage(message: Partial<Message>): Observable<Message> {
    const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id;
    return this.http.post<Message>(this.apiUrl, {...message,userId}).pipe(
      tap(newMessage => {
        const currentMessages = this.messagesSubject.getValue();
        this.messagesSubject.next([...currentMessages, newMessage]);
      })
    );
  }

  toggleMessageStatus(id: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, {}).pipe(
      tap(updatedMessage => {
        const updatedMessages = this.messagesSubject.getValue().map(msg =>
          msg.id === id ? updatedMessage : msg
        );
        this.messagesSubject.next(updatedMessages);
      })
    );
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updatedMessages = this.messagesSubject.getValue().filter(msg => msg.id !== id);
        this.messagesSubject.next(updatedMessages);
      })
    );
  }

}
