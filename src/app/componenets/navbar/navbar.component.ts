import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink, CommonModule, ButtonModule, DialogModule, CheckboxModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  cartItemCount: number = 0;

  constructor(
    private productServ: ProductService,
    private cartServ: CartService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productServ.getProducts().subscribe(data => {
      this.products = data;
      console.log('Fetched Products:', this.products);

      this.route.queryParams.subscribe((params: any) => {
        const searchTerm = params['term'];
        if (searchTerm) {
          this.filterProductsByName(searchTerm);
        } else {
          this.filteredProducts = [];
        }
      });
    });
    

    this.cartServ.cartItemCount$.subscribe(count => {
      this.cartItemCount = count; 
      console.log('Updated cart item count:', this.cartItemCount);
    });
  }
  
  
  getCartItemCount(): void {
    this.cartServ.getCart().subscribe(cart => {
      this.cartItemCount = cart.items.reduce((count: number, item: { quantity: number }) => count + item.quantity, 0);
      console.log('Total items in cart:', this.cartItemCount);
    });
  }

  filterProductsByName(searchTerm: string): void {
    this.filteredProducts = this.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  searchProducts(): void {
    this.router.navigate(['/result'], { queryParams: { term: this.searchTerm } });
  }

  isAdmin(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser && parsedUser.role === 'admin';
    }
    return false;
  }

  isAdminRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/admin') || currentUrl.includes('/result');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  onLogout(): void {
    console.log('Logout initiated'); 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.cartServ.clearCart().subscribe(() => {
        console.log('Cart cleared on logout');
        
    });
    this.router.navigate(['/login']);
}

  


  
}
