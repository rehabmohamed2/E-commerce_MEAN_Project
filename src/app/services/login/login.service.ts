import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginObj } from '../../componenets/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5001/users'; 

  constructor(private http: HttpClient) {}

  loginUser(login: loginObj): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, login);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserById/${id}`);
  }
  
  saveUser(user: any) {
    return this.http.post('http://localhost:5001/users/createUser', user, { responseType: 'text' });
  }

  getAdminData(token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` }; 
    return this.http.get<any>(`${this.apiUrl}/admin`, { headers });
  }


}
