import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs'; 

interface Product {
  id: string;
  price: number;
  quantity: number;
  category: string; 
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginatorModule, EditorModule, ButtonModule, DialogModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categoryList: any[] = [];
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  @ViewChild('topContainer') topContainer!: ElementRef;
  itemsPerPage = 12;
  currentPage = 1;
  selectedCategory: string = '';

  constructor(private http: HttpClient, private productSrv: ProductService, private cartService: CartService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || ''; 
      if (this.productsList.length > 0) {
        this.filterByCategory(); 
      }
    });
    window.scrollTo(0, 0);
  }
  
  scrollToTop() {
    this.topContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  getProducts() {
    this.productSrv.getProducts().subscribe((res: any) => {
      this.productsList = res;
      this.filteredProductsList = res;
      if (this.selectedCategory) {
        this.filterByCategory();
      }
    });
  }
  
  getAllCategory() {
    this.productSrv.getCategories().subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  filterByCategory() {
    if (this.selectedCategory === '') {
      this.filteredProductsList = [...this.productsList];
    } else {
      this.filteredProductsList = this.productsList.filter(product =>
        product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
      this.productSrv.flag = true;
    }
  }
  


  get totalPages(): number {
    if (this.productSrv.flag) {
      return Math.ceil(this.filteredProductsList.length / this.itemsPerPage);
    }
    return Math.ceil(this.productsList.length / this.itemsPerPage);
  }

  getCurrentProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (this.productSrv.flag) {
      return this.filteredProductsList.slice(startIndex, startIndex + this.itemsPerPage);
    }
    return this.productsList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.scrollToTop();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.scrollToTop();
  }

 
  viewProductDetails(productId: number) {
    this.router.navigate(['/details', productId]);
  }

  addToCart(product: Product) {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      alert('Please sign in to add items to your cart.'); 
      return of(null); // Ensures return of observable
    }
  
    const quantity = product.quantity || 1;
  
    return this.cartService.addToCart(product.id, quantity).subscribe( // Ensure this returns as well
      response => {
        console.log("Product added to cart:", response);
      },
      error => {
        console.error("Error adding product to cart:", error);
      }
    );
  }
  
}
