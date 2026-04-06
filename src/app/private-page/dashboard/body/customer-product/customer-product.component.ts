import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/Services/cart.service';
import { CustomerService } from 'src/Services/customer.service';
import { ProductService } from 'src/Services/product.service';
// import * as bootstrap from 'bootstrap';
declare const Razorpay: any;


@Component({
  selector: 'app-customer-product',
  templateUrl: './customer-product.component.html',
  styleUrls: ['./customer-product.component.scss']
})
export class CustomerProductComponent implements OnInit {
  // customerProducts: any;
  mainImage: string = '../../../assets/Images/No-Image.png';
  // platformFee = 10;
  // deliveryCharge = 0; // assuming it's free
  // finalAmount = 0;
  // totalDiscount = 0;
  // totalPrice: number = 0;
  savedItems: any[] = []; 
  // cartCount: number = 0;
  // savedAmount = 0;

  // Sample data
  // customerProducts: any[] = [];
  savedAddresses: any[] = [];
  selectedAddress: any = null;
  step: number = 1; // 1=cart, 2=delivery, 3=payment, 4=summary
   paymentOptions = [
    { name: "UPI" },
    { name: "Credit / Debit Card" },
    { name: "Cash on Delivery" },
  ];
  selectedPayment: any = null;

  // finalAmount: number = 0;

    // orderForm: FormGroup;

    // check out page
    checkOutPage: boolean = false;
    checkoutForm!: FormGroup;
  customerProducts: any[] = [];
  cartCount = 0;
  totalPrice = 0;
  totalDiscount = 0;
  platformFee = 0;
  deliveryCharge = 0;
  finalAmount = 0;
  savedAmount = 0;
  processing = false;
  sessionId: string | null = null; // server-created session id
  razorpayOrderFromServer: any = null; // server returns razorpay order + public key
  userId :number =0;
  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cartService: CartService,
    private customerService: CustomerService,
    private router: Router
  ) {
    // this.orderForm = this.fb.group({
    //   address: ['', Validators.required],
    //   state: ['', Validators.required],
    //   city: ['', Validators.required],
    //   zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    //   phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    //   paymentMethod: ['COD', Validators.required]
    // });
  }

 ngOnInit(): void {
  this.getAllProductsByCustomerId();

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      // phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      // email: ['', [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: true }],   // readonly
      email: [{ value: '', disabled: true }],   // readonly
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      paymentMethod: ['ONLINE', Validators.required] // ONLINE or COD
    });
    this.userId = Number(localStorage.getItem('userId'));
    // Load cart items from your cart service (synchronous or subscribe depending on implementation)
    // this.customerProducts = this.cartService.getCartItems() || []; // implement getCartItems accordingly
    this.calculatePriceDetails();
    this.loadUserDetails();
}

loadUserDetails() {
  this.customerService.userLoggedInDetails(this.userId).subscribe((res) => {
    const user = res.loggedUserDetails;

    this.checkoutForm.patchValue({
      phone: user.phone,
      email: user.email
    });
  });
}

getAllProductsByCustomerId(): void {
  const CustomerId = localStorage.getItem('userId');
  const parsedCustomerId = Number(CustomerId);

  if (!parsedCustomerId) {
    this.toastr.error("Customer ID not found. Please refresh the page.");
    return;
  }

  this.productService.getAllProductByCustomerId(parsedCustomerId).subscribe(
    (AllProducts:any) => {
      // Normalize: ensure each item has a `product` property that the template expects
      // this.customerProducts = AllProducts.getAddToCartItem.map((item: any) => ({
      //   ...item,
      //   quantity: 1 // Default quantity
      // }));
       this.customerProducts = (AllProducts.getAddToCartItem || []).map((item: any) => ({
        ...item,
        // some responses put product under productId; if it's already product, keep it
        product: item.productId || item.product || {},
        quantity: item.quantity || 1 // use provided quantity or default to 1
      }));
        this.calculatePriceDetails();

    },
    (error) => {
      this.toastr.error('Failed to load products.');
      console.error(error);
    }
  );
}

// goToStep2(): void {
//     if (this.orderForm.get('address')?.invalid ||
//         this.orderForm.get('state')?.invalid ||
//         this.orderForm.get('city')?.invalid) {
//       this.orderForm.get('address')?.markAsTouched();
//       this.orderForm.get('state')?.markAsTouched();
//       this.orderForm.get('city')?.markAsTouched();
//       this.toastr.error('Please fill step 1 fields correctly.');
//       return;
//     }
//     this.step = 2;
//   }
//   // start
//   selectAddress(address: any) {
//     this.selectedAddress = address;
//   }

//    goTo(stepNumber: number) {
//     this.step = stepNumber;
//   }

  // selectPayment(option: any) {
  //   this.selectedPayment = option;
  // }

  // placeOrder() {
  //   alert("Order Placed Successfully!");
   
  // }

  // end
 increaseQuantity(index: number): void {
    const item = this.customerProducts[index];
  
    if (item.quantity < item.product.stockQuantity) {
      item.quantity++;
      // this.updateCartCount(); // optional if you're using cartCount elsewhere
      this.calculatePriceDetails(); // 🔥 recalculate all totals
    } else {
      this.toastr.error(`Stock Limit Reached, Only ${item.product.stockQuantity} items available!`);
    }
  }
  
  decreaseQuantity(index: number): void {
    if (this.customerProducts[index].quantity > 1) {
      this.customerProducts[index].quantity--;
      // this.updateCartCount(); // optional
      this.calculatePriceDetails(); 
    }
  }

   calculatePriceDetails() {
    // Reset all values before calculation
    this.totalPrice = 0;
    this.totalDiscount = 0;
    this.cartCount = 0;
  
    this.customerProducts.forEach((item:any) => {
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

// getTotalItems(): number {
//   return this.customerProducts.reduce((sum: number, item: any) => sum + item.quantity, 0);
// }

// getTotalAmount(): number {
//   return this.customerProducts.reduce((sum: number, item: any) => {
//     return sum + item.quantity * (item.product.price || 0);
//   }, 0);
// }

getProductImage(item: any): string {
  const imageBuffer = item?.product?.productImages?.[0]?.images?.data;
  if (imageBuffer && imageBuffer.length > 0) {
    return 'data:image/jpeg;base64,' + this.arrayBufferToBase64(imageBuffer);
  }
  return this.mainImage;
}

arrayBufferToBase64(buffer: number[]): string {
  let binary = '';
  buffer.forEach(b => binary += String.fromCharCode(b));
  return window.btoa(binary);
}


  removeSavedItem(productId: string): void {
    alert("removeSavedItem called with productId 222: " + productId);
    const guestUserId = sessionStorage.getItem('guestUserId');
    if (!guestUserId) {
      this.toastr.error("Guest User ID not found. Please refresh the page.");
      return;
    }

    this.cartService.removeSavedItemFromCart(productId).subscribe(
      (response) => {
        if (response.itemRemovedSuccess) {
          this.toastr.success('Item removed successfully');
        
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

  
  goToCheckout() {
  this.checkOutPage = true;
}
// submitOrder(): void {
//   if (this.orderForm.invalid) {
//     this.toastr.error('Please fill in all required fields correctly.');
//     return;
//   }

//   const customerId = localStorage.getItem('userId');
//   const parsedCustomerId = Number(customerId);

//   const orderDetails = {
//     userId: parsedCustomerId,
//     products: this.customerProducts.map((item: any) => ({
//       productId: item.product.productId,
//       quantity: item.quantity,
//       price: item.product.price,
//       discountPrice: item.product.productOffers?.[0]?.discountPrice || item.product.price
//     })),
//     totalAmount: this.finalAmount,
//     deliveryInfo: this.orderForm.value
//   };

//   this.productService.submitOrder(orderDetails).subscribe(
//     (response) => {
//       if (response.message === 'Product added successfully' || response.success) {
//         this.toastr.success('Order submitted successfully!');
//         this.orderForm.reset({ paymentMethod: 'COD' });

//         const modalEl = document.getElementById('orderModal');
//         if (modalEl) {
//           // const modalInstance = bootstrap.Modal.getInstance(modalEl);
//           // modalInstance?.hide();
//         }

//       } else {
//         this.toastr.error('Failed to submit order. Please try again.');
//       }
//     },
//     (error) => {
//       this.toastr.error('An error occurred. Please try again later.');
//       console.error(error);
//     }
//   );
// }


// checkout.ts

calculatePriceDetails222(): void {
    this.cartCount = this.customerProducts.length;
    this.totalPrice = 0;
    this.totalDiscount = 0;
    this.platformFee = 0;
    this.deliveryCharge = 0;

    for (const item of this.customerProducts) {
      const price = item.product?.price || 0;
      const discountPrice = item.product?.productOffers?.[0]?.discountPrice || price;
      const qty = item.quantity || 1;
      this.totalPrice += price * qty;
      this.totalDiscount += (price - discountPrice) * qty;
    }

    // Example platform fee logic and delivery rules
    this.platformFee = Math.round(this.totalPrice * 0.02); // 2% platform fee (example)
    this.deliveryCharge = this.totalPrice >= 1000 ? 0 : 50; // free over ₹1000
    this.savedAmount = this.totalDiscount;
    this.finalAmount = Math.round(this.totalPrice - this.totalDiscount + this.platformFee + this.deliveryCharge);
    console.log(this.finalAmount+"empty");
    
  }

  // Called by submit button
  async onPlaceOrder(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toastr.error('Please fill out all required fields correctly.');
      return;
    }

    if (!this.customerProducts.length) {
      this.toastr.error('Cart is empty.');
      return;
    }

    this.processing = true;

    const customerId = Number(localStorage.getItem('userId')) || null;
    const guestUserId = sessionStorage.getItem('guestUserId') || null;

    // Prepare payload for session creation
    const productsPayload = this.customerProducts.map(it => ({
      productId: it.product._id || it.product.productId || it.productId,
      quantity: it.quantity || 1
    }));

    try {
      // 1) Create order session on server — this returns sessionId and razorpayOrder details
      const resp: any = await this.cartService.createSession({
        customerId,
        guestUserId,
        products: productsPayload
      }).toPromise();

      // resp should include: { sessionId, razorpayOrder, amount, currency, razorpayKeyId }
      this.sessionId = resp.sessionId;
      this.razorpayOrderFromServer = resp.razorpayOrder; // server returns order object
      const publicKey = resp.razorpayKeyId || (window as any).RAZORPAY_KEY_ID; // prefer server-sent

      // If user selected COD — finalize as COD (server endpoint needed)
      if (this.checkoutForm.value.paymentMethod === 'COD') {
        // call backend endpoint to finalize COD order (server should create final order without payment)
        const codResp: any = await this.cartService.finalizeCOD({
          sessionId: this.sessionId,
          address: this._getAddressPayload()
        }).toPromise();

        if (codResp && codResp.success) {
          this.toastr.success('Order placed (Cash on Delivery).');
          // this.router.navigate(['/fashionflair/dashboard/sub-categories']);
          this.router.navigate(['/fashionflair/dashboard/order-success/'+ codResp.orderId]);
          this._onOrderSuccess(codResp.orderId);
          alert('Order placed successfully with Cash on Delivery!'+ codResp.orderId);
          console.log('Order placed successfully with Cash on Delivery!'+ codResp.orderId);
        } else {
          this.toastr.error('Failed to place COD order.');
        }
        this.processing = false;
        return;
      }

      // 2) For ONLINE payment — open Razorpay checkout
      const options: any = {
        key: publicKey, // public key from server or env
        amount: this.razorpayOrderFromServer.amount, // paise
        currency: this.razorpayOrderFromServer.currency,
        name: 'Fashion Flair',
        description: 'Shop your favorite styles effortlessly — add to cart, choose your address, and complete payment securely. Your fashion picks are packed with care and delivered right to your doorstep.',
        order_id: this.razorpayOrderFromServer.id,
        prefill: {
          name: this.checkoutForm.value.fullName,
          email: this.checkoutForm.value.email,
          contact: this.checkoutForm.value.phone
        },
        handler: async (response: any) => {
          // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            const verifyPayload = {
              sessionId: this.sessionId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: this._getAddressPayload()
            };
            const verifyResp: any = await this.cartService.verifyPayment(verifyPayload).toPromise();

            if (verifyResp && verifyResp.success) {
              this.toastr.success('Payment successful and order placed!');
              this._onOrderSuccess(verifyResp.orderId);
            } else {
              this.toastr.error('Payment verification failed. Contact support.');
              console.error('verifyResp', verifyResp);
            }
          } catch (err) {
            console.error('verification error', err);
            this.toastr.error('Payment verification error. Please contact support.');
          } finally {
            this.processing = false;
          }
        },
        modal: {
          ondismiss: () => {
            // user closed popup
            this.toastr.info('Payment popup closed. You can try again.');
            this.processing = false;
          }
        }
      };

      // open Razorpay popup
      const rzp = new Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error('checkout error', err);
      // this.toastr.error(err?.error?.message || 'Checkout error. Please try again later.');
      const errorMessage =
  err?.error?.error?.description ||   // Razorpay error
  err?.error?.message ||              // Your custom backend message
  err?.message ||                     // Generic JS error
  'Checkout error. Please try again later.';

this.toastr.error(errorMessage);
      this.processing = false;
    }
  }

  private _getAddressPayload() {
    return {
      fullName: this.checkoutForm.value.fullName,
      phone: this.checkoutForm.value.phone,
      email: this.checkoutForm.value.email,
      addressLine1: this.checkoutForm.value.addressLine1,
      addressLine2: this.checkoutForm.value.addressLine2,
      city: this.checkoutForm.value.city,
      state: this.checkoutForm.value.state,
      pincode: this.checkoutForm.value.pincode
    };
  }

  private _onOrderSuccess(orderId: string) {
    // Clear local cart, navigate to order success or order-details page
    // this.cartService.clearCart();
    // this.router.navigate(['/order-success', orderId]); // create this route or adjust
    alert('Order placed successfully!go pg Order ID: ' + orderId);
  }

  // small helper used by template to format price
  formatAmount(val: number): string {
    return '₹' + (val || 0);
  }

}

// placeOrder(): void {
//   this.toastr.success("Order placed successfully!");
//   // Order API call here
// }


  // getAllProductsByCustomerId(): void {
  //   const CustomerId = localStorage.getItem('userId');
  //   const parsedCustomerId = Number(CustomerId);

  //   if (!parsedCustomerId) {
  //     this.toastr.error("Customer ID not found. Please refresh the page.");
  //     return;
  //   }

  //   this.productService.getAllProductByCustomerId(parsedCustomerId).subscribe(
  //     (AllProducts) => {
  //       this.customerProducts = AllProducts.getAddToCartItem || [];
  //       // this.customerProducts = response.getAddToCartItem;

  //       // console.log(this.customerProducts);
        
  //     },
  //     (error) => {
  //       console.error('Error fetching products', error);
  //       this.toastr.error('Failed to load products.');
  //     }
  //   );
  // }

//    getProductImage(item: any): string {
//     const imageBuffer = item?.product?.productImages?.[0]?.images?.data;
//     if (imageBuffer && imageBuffer.length > 0) {
//       const base64String = this.arrayBufferToBase64(imageBuffer);
//       return 'data:image/jpeg;base64,' + base64String;
//     }
//     return this.mainImage;
//   }

//   arrayBufferToBase64(buffer: number[]): string {
//     let binary = '';
//     buffer.forEach((b: number) => binary += String.fromCharCode(b));
//     return window.btoa(binary);
//   }

  
// getTotalAmount(): number {
//   return this.customerProducts.reduce((total: any, item: { product: { price: any; }; }) => {
//     return total + (item.product.price || 0);
//   }, 0);
// }

// placeOrder(): void {
//   this.toastr.success("Order placed successfully!");
//   // Add your order placement API call here if needed
// }

  // buyNow(product: any): void {
  //   if (product.stockQuantity > 0) {
  //     this.toastr.success(`You have bought: ${product.productName}`);
  //     // You can call a service to store the order here
  //     // Example: this.productService.placeOrder(product.productId, customerId).subscribe(...)
  //   } else {
  //     this.toastr.error("Sorry, product is out of stock.");
  //   }
  // }

  // arrayBufferToBase64(buffer: ArrayBuffer): string {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   for (let b of bytes) {
  //     binary += String.fromCharCode(b);
  //   }
  //   return window.btoa(binary);
  // }

