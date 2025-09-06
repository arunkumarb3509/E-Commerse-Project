
import * as CryptoJS from 'crypto-js';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/Services/cart.service';
import { ProductService } from 'src/Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent implements OnInit {
  cartItems: any[] = [];
  cartCount: number = 0;
  totalPrice: number = 0; 
  selectedProductOffer: any;
  noProducts: boolean = false;
  mainImage: string = '../../../assets/Images/No-Image.png';
  selectedImage: string = this.mainImage;
  savedItems: any[] = []; 
  savedSuccess:boolean = false;
  totalDiscount = 0;
  buyMoreDiscount = 0;
  platformFee = 3;
  deliveryCharge = 0; // assuming it's free
  finalAmount = 0;
  savedAmount = 0;

  constructor(private cartService: CartService, private productService: ProductService,private toastr: ToastrService,private router: Router) {}

  ngOnInit() {
    this.getCartItems();
    this.getSavedItems();
  }


  calculatePriceDetails() {
    // Reset all values before calculation
    this.totalPrice = 0;
    this.totalDiscount = 0;
    this.cartCount = 0;
  
    this.cartItems.forEach(item => {
      const originalPrice = item.product.price;
      const quantity = item.quantity;
      const hasOffer = item.product.productOffers && item.product.productOffers.length > 0;
  
      // Use discounted price if offer exists, else use original
      const discountedPrice = hasOffer ? item.product.productOffers[0].discountPrice : originalPrice;
      
      // Calculate totals
      this.totalPrice += originalPrice * quantity; // total original price
      this.totalDiscount += (originalPrice - discountedPrice) * quantity; // total discount
      this.cartCount += quantity;
    });
  
    this.savedAmount = this.totalDiscount;
  
    // Calculate final amount after discount + charges
    const baseTotal = this.totalPrice - this.totalDiscount;
    this.finalAmount = baseTotal + this.platformFee + this.deliveryCharge;
  }
  
  placeOrder(): void {
    const orderData = {
      cartItems: this.cartItems,
      cartCount: this.cartCount,
      totalPrice: this.totalPrice,
      totalDiscount: this.totalDiscount,
      platformFee: this.platformFee,
      deliveryCharge: this.deliveryCharge,
      finalAmount: this.finalAmount,
      savedAmount: this.savedAmount
    };
  
    // Encrypt the data (Use a more secure secret key in production)
    const secretKey = 'mySecretKey123'; // Ideally store this securely
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(orderData), secretKey).toString();
  
    // Pass encrypted data as query param
    this.router.navigate(['/customer-signIn'], { queryParams: { data: ciphertext } });
  }
  

  getCartItems(): void {
    const guestUserId = sessionStorage.getItem('guestUserId');
    if (guestUserId) {
      // const parsedCustomerId = Number(customerId);
      
      this.cartService.updateCartCountFromServer(guestUserId); 

      this.cartService.getCartItemsByCustomer(guestUserId).subscribe(
        (response) => {
          if (response && response.cartItems && Array.isArray(response.cartItems)) {
            this.cartItems = response.cartItems.map((item: any) => {
              let displayImage = this.mainImage;

              if (item.product && item.product.productImages && item.product.productImages.length > 0) {
                const firstImage = item.product.productImages[0];
  
                if (firstImage.images && firstImage.images.data) {
                  displayImage = this.arrayBufferToBase64(firstImage.images.data);
                } else if (firstImage.imageUrl) {
                  displayImage = firstImage.imageUrl;
                }
              }
  
              return {
                ...item,
                quantity: item.quantity ?? 1,
                product: {
                  ...item.product,
                  displayImage: displayImage
                }
              };
            });
            this.updateCartCount();
            this.calculatePriceDetails();

          } else {
            console.warn("Unexpected response structure:", response);
            this.cartItems = [];
            this.updateCartCount();
          }
        },
        (error) => {
          console.error("Error fetching cart items:", error);
          this.cartItems = [];
          this.updateCartCount();
        }
      );
    } else {
      console.warn("No customerId found in session storage.");
      this.cartItems = [];
      this.updateCartCount();
    }
  }
  
  

  // Convert ArrayBuffer to Base64 string
  arrayBufferToBase64(buffer: any): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  }



  getSavedItems(): void {
    const guestUserId = sessionStorage.getItem('guestUserId');
   
    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }
    if (guestUserId) {
      // const parsedCustomerId = Number(customerId);
      this.cartService.updateCartCountFromServer(guestUserId);

      this.cartService.getSavedItemsByCustomer(guestUserId).subscribe(
        (response) => {
          if (response && Array.isArray(response.savedItems) && response.savedItems.length > 0) {
            this.savedSuccess = true;
            this.savedItems = response.savedItems.map((item: any) => {
              let displayImage = this.mainImage;
              if (item.product && item.product.productImages?.length > 0) {
                const firstImage = item.product.productImages[0];
                if (firstImage.images?.data) {
                  displayImage = this.arrayBufferToBase64(firstImage.images.data);
                } else if (firstImage.imageUrl) {
                  displayImage = firstImage.imageUrl;
                }
              }
  
              return {
                ...item,
                product: {
                  ...item.product,
                  displayImage: displayImage
                }
              };
            });
          } else {
            this.savedItems = [];
            this.savedSuccess = false;
          }
        },
        (error) => {
          console.error("Error fetching saved items:", error);
          this.savedItems = [];
          this.savedSuccess = false;
        }
      );
    }
  }
  
  
  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
  
    if (item.quantity < item.product.stockQuantity) {
      item.quantity++;
      // this.updateCartCount(); // optional if you're using cartCount elsewhere
      this.calculatePriceDetails(); // 🔥 recalculate all totals
    } else {
      this.toastr.error(`Stock Limit Reached, Only ${item.product.stockQuantity} items available!`);
    }
  }
  
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // this.updateCartCount(); // optional
      this.calculatePriceDetails(); 
    }
  }
  
  
  removeItem(productId: number): void {
    const guestUserId = sessionStorage.getItem('guestUserId');
    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }
    this.cartService.removeItemFromCart(productId).subscribe(
      (response) => {
        if (response.itemRemovedSuccess) {
          this.cartService.updateCartCountFromServer(guestUserId);
          this.toastr.success('Item removed successfully');
          this.getCartItems(); // Refresh the cart after deletion
           this.getSavedItems();
           
        } else {
          this.toastr.error('Error removing item from cart', 'Error');
        }
      },
      (error) => {
        console.error("Error removing item:", error);
        this.toastr.error('Something went wrong', 'Error');
      }
    );
  }
  
  updateCartCount() {
    // this.calculatePriceDetails();
    this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      const hasOffer = item.product.productOffers?.length > 0;
  
      const discountPrice = hasOffer
        ? (item.product.productOffers[0].discountPrice ?? (item.product.price || 0))
        : (item.product.price || 0);
  
      return sum + (discountPrice * item.quantity);
    }, 0);
  
    // Notify cartService about the update if necessary
    this.cartService.updateCartCount();
  }


  saveForLater(productId: number): void {
    const guestUserId = sessionStorage.getItem('guestUserId');

    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }
    this.cartService.saveItemForLater(productId, guestUserId).subscribe(
      (response) => {
        if (response.savedSuccess) {
          this.toastr.success("Item moved to Saved Items!");
          this.getCartItems();
          this.getSavedItems();
          this.savedSuccess= true;
        } else {
          this.toastr.error("Failed to save item for later.");
        }
      },
      (error) => {
        console.error(error);
        this.toastr.error("Error saving item.");
      }
    );
  }
  
  moveToCart(productId: number): void {
    const guestUserId = sessionStorage.getItem('guestUserId');

    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }

    this.cartService.moveItemToCart(productId, guestUserId).subscribe(
      (response) => {
        if (response.moveToCartSuccess) {
          this.toastr.success("Item moved to Cart!");
          this.cartService.updateCartCountFromServer(guestUserId); 
          this.getCartItems();
          this.getSavedItems();
        } else if (response.alreadyInCart) {
          this.toastr.warning("Product already exists in cart.");
        } else if (response.notInSavedItems) {
          this.toastr.info("Product not found in saved items.");
        } else {
          this.toastr.error("Failed to move item to cart.");
        }
      },
      (error) => {
        console.error(error);
        this.toastr.error("Error moving item.");
      }
    );
    
  }
  
  
  removeSavedItem(productId: number): void {
    const guestUserId = sessionStorage.getItem('guestUserId');
    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }

    this.cartService.removeSavedItemFromCart(productId).subscribe(
      (response) => {
        if (response.itemRemovedSuccess) {
          this.toastr.success('Item removed successfully');
          this.getCartItems(); // Refresh the cart after deletion
          this.getSavedItems();
          this.cartService.updateCartCountFromServer(guestUserId); 
        } else {
          this.toastr.error('Error removing item from cart', 'Error');
        }
      },
      (error) => {
        console.error("Error removing item:", error);
        this.toastr.error('Something went wrong', 'Error');
      }
    );
  }

}
