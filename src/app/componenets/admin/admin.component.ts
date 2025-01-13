import { Component, ViewChild } from '@angular/core'; 
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    PaginatorModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  categoryList: any[] = [];
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  
  itemsPerPage = 12;
  currentPage = 1;
  selectedCategory: string = '';
  isSidePanelVisible: boolean = false;

  openSidePanel() {
    console.log("Opening side panel");
    this.isSidePanelVisible = true;
  }
  
  closeSidePanel() {
    this.isSidePanelVisible = false;
    this.productObj.id=0;
    
  }

  @ViewChild('productFrm') productFrm!: NgForm;
  
  displayModalProduct: boolean = false;
  productObj: productObject = new productObject();
 
  isApiCallInProgress: boolean = false;
  first: number = 0;
  rows: number = 8;

  constructor(private productSrv: ProductService) {}
 
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

  filterByCategory(categorySlug: string) {
    this.selectedCategory = categorySlug; // Set the selected category
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
  }

  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  generateRandomId(): number {
    return Math.floor(Math.random() * 10000) + 1; 
  }

  onSave() {
    console.log('Saving product:', this.productObj);
    
    if (this.productFrm.valid) {
      this.isApiCallInProgress = true; 
      
  
      this.productObj.id = this.generateRandomId();
      
      this.productSrv.saveProduct(this.productObj).subscribe(
        (res) => {
          console.log('Product saved successfully:', res);
          this.getProducts(); 
          this.onReset(); 
          this.isApiCallInProgress = false; 
        },
        (err) => {
          console.error('Error saving product:', err);
          this.isApiCallInProgress = false; 
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  onUpdate() {
    if (this.productFrm.valid) {
      this.isApiCallInProgress = true;
      console.log('Updating product:', this.productObj);
  
      this.productSrv.updateProduct(this.productObj.id, this.productObj).subscribe(
        (res) => {
          console.log('Product updated successfully:', res);
          this.getProducts();
          this.onReset();
          this.isApiCallInProgress = false;
        },
        (err) => {
          console.error('Error updating product:', err);
          alert('Failed to update product. Please try again.'); 
          this.isApiCallInProgress = false;
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  

  onDelete(productId: number) {
    console.log('Attempting to delete product with ID:', productId);
    const isDelete = confirm('Are you sure you want to delete this product?');
  
    if (isDelete && productId) {
      console.log('User confirmed deletion for product ID:', productId);
      this.productSrv.deleteProduct(productId).subscribe(
        (res) => {
          console.log('Product deleted successfully:', res);
          this.getProducts(); 
        },
        (err) => {
          console.error('Error deleting product:', err); 
        }
      );
    } else {
      console.log('User canceled deletion or product ID is undefined.');
    }
  }

  onEdit(item: any) {
    this.productObj = item;
    this.openSidePanel();
  }

  onReset() {
    this.productFrm.resetForm();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}

export class productObject {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  rating: {
    rate: number,
    count: number,
  };

  constructor() {
    this.id = 0;
    this.title = '';
    this.price = 0;
    this.description = '';
    this.category = '';
    this.thumbnail = '';
    this.rating = { rate: 0, count: 0 }; 
  }
}
