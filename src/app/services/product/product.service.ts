import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBase: string = 'http://localhost:5001';
  
  public cartUpdated$: Subject<boolean> = new Subject();
  flag = false;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/products/GetProductById/${id}`);
  }

  getProductByName(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/products?search=${searchTerm}`);
  }

  saveProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiBase}/products/CreateProduct`, product, { responseType: 'text' });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/products/deleteProduct/${productId}`);
  }

  updateProduct(productId: number, obj: any): Observable<any> {
    return this.http.put<any>(`${this.apiBase}/products/updateProduct/${productId}`, obj);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/categories`);
  }

  getCategoryBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/categories/${slug}`);
  }
}
