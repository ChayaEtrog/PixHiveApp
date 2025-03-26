import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../types/User';
import { UserPostModel } from '../types/UserPostModel';
import { UserGrowth } from '../types/UserGrowth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'https://localhost:7091/api/User';

  private usersSubject = new BehaviorSubject<User[]>([]); // משתנה פנימי מסוג BehaviorSubject
  public users$ = this.usersSubject.asObservable(); // Observable שמחזיר את הרשימה

  constructor(private http: HttpClient) { }

  getUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(
      (users) => {
        this.usersSubject.next(users); 
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // הוספת משתמש חדש
addUser(user: UserPostModel): Observable<User> {
  return this.http.post<User>(this.apiUrl, user).pipe(
    tap((newUser) => {
      const currentUsers = this.usersSubject.value;
      this.usersSubject.next([...currentUsers, newUser]); 
    })
  );
}

  updateUser(id: number, user: UserPostModel): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap((updatedUser) => {
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          currentUsers[index] = updatedUser; 
          this.usersSubject.next([...currentUsers]);
        }
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.filter((user) => user.id !== id); 
        this.usersSubject.next(updatedUsers); 
      })
    );
  }

  getUserGrowthData(): Observable<UserGrowth[]> {
    return this.http.get<UserGrowth[]>(`${this.apiUrl}/growth`);
  }
}

