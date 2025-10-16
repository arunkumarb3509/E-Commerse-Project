import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/Services/cart.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {
  socialMediaLinks = [
    { name: 'Facebook', icon: 'bi bi-facebook'},
    { name: 'Twitter', icon: 'bi bi-twitter' },
    { name: 'Youtube', icon: 'bi bi-pinterest' },
    { name: 'Instagram', icon: 'bi bi-instagram'},
    { name: 'Youtube', icon: 'bi bi-youtube' }
  ];
  cartCount: number = 0;

  constructor(private cartService: CartService,private router: Router) {}

  
  ngOnInit(): void {
    const guestUserId = sessionStorage.getItem('guestUserId');

    // 👇 Subscribe to cart count
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // 👇 Trigger an initial count fetch
    if (guestUserId) {
      this.cartService.updateCartCountFromServer(guestUserId);
      
    }
  }

  getCartItems() {
    const guestUserId = sessionStorage.getItem('guestUserId');
  
    if (guestUserId) {
      // const parsedCustomerId = Number(guestUserId);
  
      this.cartService.getCartItemsByCustomer(guestUserId).subscribe(response => {
        if (response && response.cartItems && Array.isArray(response.cartItems)) {
          const uniqueProductIds = new Set(response.cartItems.map((item :any) => item.productId));
          this.cartCount = uniqueProductIds.size; // Count unique product IDs
        } else {
          this.cartCount = 0;
        }
      }, error => {
        console.error("Error fetching cart items:", error);
        this.cartCount = 0;
      });
    }
  }


  viewToCart(){
// alert(JSON.stringify(product));
  // this.productService.productId.next(productId);
  this.router.navigate(['/viewCart']);
  // this.getCartItems();
  }

}
