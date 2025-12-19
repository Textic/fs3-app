import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get<User>('/api/users/me', { headers }).pipe(
      tap((user) => {
        user.password = password; // Store password for Basic Auth
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  recover(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/recover`, user);
  }

  updateProfile(user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, user, { headers: this.getAuthHeaders() }).pipe(
      tap((updatedUser: any) => {
        if (user.password) {
          updatedUser.password = user.password;
        } else {
          updatedUser.password = this.currentUserValue?.password;
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders(), responseType: 'text' });
  }

  assignLab(userId: number, labId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/assign/${userId}/lab/${labId}`, {}, { headers: this.getAuthHeaders() });
  }

  removeLab(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/assign/${userId}/lab/remove`, {}, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const user = this.currentUserValue;
    if (user && user.username && user.password) {
      return new HttpHeaders({
        authorization: 'Basic ' + btoa(user.username + ':' + user.password)
      });
    }
    return new HttpHeaders();
  }
}
