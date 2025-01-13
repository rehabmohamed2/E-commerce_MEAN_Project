import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    const userString = localStorage.getItem('user'); 
   
    if (!userString) {
      console.log('No user found in localStorage');
      this.router.navigate(['/login']);
      return of(false); 
    }

    let user;
    try {
      user = JSON.parse(userString); 
      if (!user || typeof user.role !== 'string') {
        throw new Error('Invalid user object'); 
      }
    } catch (error) {
      console.error('Error parsing user JSON:', error); 
      this.router.navigate(['/login']); 
      return of(false); 
    }

    console.log('User from localStorage:', user); 

    if (user.role === 'admin') {
      return of(true); 
    } else {
      console.log('Access denied, redirecting to login'); 
      this.router.navigate(['/login']); 
      return of(false); 
    }
  }
}
