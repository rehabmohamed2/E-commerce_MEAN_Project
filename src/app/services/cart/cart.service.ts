import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs'; 
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5001/cart'; 
  private cartItemCountSubject = new BehaviorSubject<number>(0); 
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartItemCount(); 
  }

  getCart(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers });
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
  
    const cartItem = {
      productId,
      quantity
    };
  
    if (!token) {
     
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      guestCart.push(cartItem);
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      return of(cartItem); 
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<any>(`${this.apiUrl}/add`, cartItem, { headers }).pipe(
      tap(() => this.updateCartItemCount()) 
    );
  }
  

  updateItemInCart(productId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Updating item in cart with productId:', productId, 'and quantity:', quantity);

    return this.http.put<any>(`${this.apiUrl}/update`, { productId, quantity }, { headers }).pipe(
      tap(() => this.updateCartItemCount()) 
    );
  }

  removeItemFromCart(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Sending request to remove item with productId:', productId);

    return this.http.delete<any>(`${this.apiUrl}/remove/${productId}`, { headers }).pipe(
      tap(() => this.updateCartItemCount()) 
    );
  }

  saveCartState(cart: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/save`, cart, { headers });
  }

  private updateCartItemCount(): void {
    this.getCart().subscribe(cart => {
      const count = cart.items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);
      this.cartItemCountSubject.next(count); 
    });
  }

    clearCart(): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(`${this.apiUrl}/clear`, {}, { headers }).pipe(
        tap(() => this.updateCartItemCount()) // Update item count after clearing the cart
      );
    }
}
