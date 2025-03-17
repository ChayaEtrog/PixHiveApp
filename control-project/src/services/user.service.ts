import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../types/User';

export interface UserPostModel {
  name: string;
  email: string;
  password: string;
  phoneNumber:string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'https://localhost:7091/users';

  private usersSubject = new BehaviorSubject<User[]>([]); // משתנה פנימי מסוג BehaviorSubject
  public users$ = this.usersSubject.asObservable(); // Observable שמחזיר את הרשימה

  constructor(private http: HttpClient) { }

  // קבלת כל המשתמשים
  getUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(
      (users) => {
        this.usersSubject.next(users); // עדכון הרשימה כאשר הנתונים מתקבלים
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // קבלת משתמש לפי ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // הוספת משתמש חדש
addUser(user: UserPostModel): Observable<User> {
  return this.http.post<User>(this.apiUrl, user).pipe(
    // אחרי שהמשתמש נוסף בהצלחה, נקבל את המשתמש שנוסף ונעדכן את ה-BehaviorSubject
    tap((newUser) => {
      const currentUsers = this.usersSubject.value;
      this.usersSubject.next([...currentUsers, newUser]); // הוספת המשתמש החדש לרשימה
    })
  );
}

  // עדכון משתמש קיים לפי ID
  updateUser(id: number, user: UserPostModel): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap((updatedUser) => {
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          currentUsers[index] = updatedUser; // עדכון המשתמש ברשימה
          this.usersSubject.next([...currentUsers]); // עדכון ה-BehaviorSubject
        }
      })
    );
  }

  // מחיקת משתמש לפי ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.filter((user) => user.id !== id); // מסנן את המשתמש שנמחק
        this.usersSubject.next(updatedUsers); // עדכון ה-BehaviorSubject
      })
    );
  }
}

