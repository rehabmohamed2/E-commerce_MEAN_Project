import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service'; // Adjust the path as necessary
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
    window.scrollTo(0, 0);
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
        next: (cart) => {
            console.log('Fetched cart:', cart);
            this.cart = cart.items;
        },
        error: (err: HttpErrorResponse) => {
            console.error('Error fetching cart:', err);
        }
    });
  }

  increaseQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartItem(item);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateCartItem(item);
    }
  }

  updateCartItem(item: any): void {
    const productPrice = parseFloat(item.productId.price.toString()) || 0;
    const quantity = item.quantity || 1;
    const total = productPrice * quantity;

    if (isNaN(total) || total <= 0) {
        console.error("Invalid total amount. Cannot update cart.");
        return;
    }

    const updatedItem = {
        total: total,
        productId: item.productId.id,
        quantity: quantity
    };

    this.cartService.updateItemInCart(updatedItem.productId, updatedItem.quantity).subscribe({
        next: () => {
            this.loadCart();
        },
        error: (err: HttpErrorResponse) => {
            console.error('Error updating item in cart:', err);
            if (err.status === 404) {
                console.error('Item not found in cart. Please check the product ID.');
            } else {
                console.error('An unexpected error occurred.');
            }
        }
    });
  }

  removeFromCart(productId: number): void {
    console.log('Removing item from cart with productId:', productId); 
    this.cartService.removeItemFromCart(productId).subscribe({
      next: () => {
        this.loadCart(); 
        console.log('Item removed successfully from the cart.'); 
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error removing item from cart:', err); 
        if (err.status === 404) {
          console.error('Item not found in cart. Please check the product ID.');
        } else {
          console.error('An unexpected error occurred.'); 
        }
      }
    });
  }
  

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        console.log('Cart cleared successfully.');
        this.loadCart(); 
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error clearing cart:', err);
      }
    });
  }

}
