import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart/cart.service';
import { of } from 'rxjs'; 

interface Product {
  id: string;
  price: number;
  quantity: number;
  category: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  itemId!: number;
  itemDetails: any = {};
  isLoading: boolean = true;
  errorMessage: string = '';

  productsList: any[] = [];
  filteredProductsList: any[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private http: HttpClient
    , private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(`Fetching details for item ID: ${this.itemId}`);

    // Fetch product list
    this.productService.getProducts().subscribe((res: any) => {
      this.productsList = res;
      this.filteredProductsList = res;
    });

    this.productService.getProductById(this.itemId).subscribe(
      (details) => {
        this.itemDetails = details[0]; // Assuming details is an array
        this.isLoading = false;
        console.log('Product details fetched:', this.itemDetails);
      },
      (error) => {
        this.errorMessage = 'Error fetching product details';
        console.error('Error fetching product details:', error);
        this.isLoading = false;
      }
    );

    window.scrollTo(0, 0);
  }

  addToCart(product: Product) {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      alert('Please sign in to add items to your cart.'); 
      return of(null); // Ensures return of observable
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
