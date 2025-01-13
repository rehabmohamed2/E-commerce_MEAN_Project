import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart/cart.service';
import { of } from 'rxjs'; 
interface Product {
  id: string;
  price: number;
  quantity: number;
  category: string;
}


@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  products: any[] = []; 
  filteredProducts: any[] = []; 

  constructor(private productServ: ProductService, private route: ActivatedRoute, private cartService: CartService, private router: Router,private http: HttpClient) {}

  ngOnInit() {
    this.productServ.getProducts().subscribe(data => {
      this.products = data; 
      console.log('Fetched Products:', this.products); 
  
      this.route.queryParams.subscribe(params => {
        const searchTerm = params['term'];
        if (searchTerm) {
          this.filterProductsByName(searchTerm); 
        } else {
          this.filteredProducts = []; 
        }
      });
    });
    window.scrollTo(0, 0);
  }
  

  filterProductsByName(searchTerm: string) {
    console.log('Filtering products with term:', searchTerm); 
    this.filteredProducts = this.products.filter(product => {
      const matches = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`Product: ${product.title}, Matches: ${matches}`); 
      return matches;
    });
  }
  
    viewProductDetails(productId: number) {
      this.router.navigate(['/details', productId]);
    }

    addToCart(product: Product) {
      const token = localStorage.getItem('token'); 
    
      if (!token) {
        alert('Please sign in to add items to your cart.'); 
        return of(null); 
      }
    
      const quantity = product.quantity || 1;
    
      return this.cartService.addToCart(product.id, quantity).subscribe( 
        response => {
          console.log("Product added to cart:", response);
        },
        error => {
          console.error("Error adding product to cart:", error);
        }
      );
    }
}
