import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, Button],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  login: loginObj = new loginObj(); 

  constructor(private router: Router, private logSrv: LoginService) {}
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  onLogin() {
    if (this.login.email && this.login.password) {
      this.logSrv.loginUser(this.login).subscribe({
        next: (res) => {
          console.log('Full response:', res); 

          localStorage.setItem('token', res.token); 
          localStorage.setItem('user', JSON.stringify(res.user)); 

          if (res.user.role === 'admin') { 
            this.router.navigate(['/admin']); 
          } else {
            this.router.navigate(['/']); 
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('Invalid email or password. Please try again.');
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  }
  
  onRegister() {
    if (this.login.userName && this.login.email && this.login.password) {
      this.logSrv.saveUser(this.login).subscribe({
        next: (res) => {
          console.log('User registered successfully', res);
          alert('You registered successfully. Please sign in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          if (err.status === 409) {
            alert('You are already registered. Please sign in.');
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      });
    } else {
      alert('Please fill in all fields.');
    }
  }
}

export class loginObj {
  id: number;
  userName: string;
  email: string;
  password: string;

  constructor() {
    this.id = 0;
    this.userName = '';
    this.email = '';
    this.password = '';
  }
}
