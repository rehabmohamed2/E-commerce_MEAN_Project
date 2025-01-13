import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink,CommonModule, FormsModule, PaginatorModule, EditorModule, ButtonModule, DialogModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  categoryList: any[] = [];
  productsList: any[] = [];
  
  filteredProductsList: any[] = [];
  
  itemsPerPage = 4;
  currentPage = 1;
  selectedCategory: string = '';

  constructor(private productSrv: ProductService, private router: Router,private http: HttpClient , private cartService: CartService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
    
    window.scrollTo(0, 0);
  }


  getProducts() {
    this.productSrv.getProducts().subscribe((res: any) => {
      this.productsList = res;
      this.filteredProductsList = res;
    });
  }

  getAllCategory() {
    this.productSrv.getCategories().subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  productsByCategory(categorySlug: string) {
    this.router.navigate(['/products'], { queryParams: { category: categorySlug } });
}


filterByCategory(categorySlug: string) {
  this.selectedCategory = categorySlug; 
  if (this.selectedCategory === '') {
    this.filteredProductsList = [...this.productsList];
  } else {
    this.filteredProductsList = this.productsList.filter(product =>
      product.category.toLowerCase() === this.selectedCategory.toLowerCase()
    );
    this.productSrv.flag = true;
  }
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
