import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { User } from '../types/User';
import { UserPostModel } from '../types/UserPostModel';

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7091/api/Auth';
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$: Observable<any | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(userNameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { userNameOrEmail, password }).pipe(
      tap(response => {
        // sessionStorage.setItem('token', response.token);
        // sessionStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(user: UserPostModel): Observable<LoginResponse> { 
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        // sessionStorage.setItem('token', response.token);
        // sessionStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  upgradeToAdmin(userId: number, adminPassword: string): Observable<LoginResponse> {    
    return this.http.post<LoginResponse>(`${this.apiUrl}/upgrade-to-admin/${userId}`, 
      { password: adminPassword },
    ).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.log("error");
        this.logout(); // אם נכשל – ננקה את המידע מה-sessionStorage וה-Observable
        throw error;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token'); // אם יש טוקן המשתמש מחובר
  }
}
