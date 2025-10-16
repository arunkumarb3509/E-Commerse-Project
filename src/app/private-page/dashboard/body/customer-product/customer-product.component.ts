import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/Services/product.service';
// import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-customer-product',
  templateUrl: './customer-product.component.html',
  styleUrls: ['./customer-product.component.scss']
})
export class CustomerProductComponent implements OnInit {
  customerProducts: any;
  mainImage: string = '../../../assets/Images/No-Image.png';
  platformFee = 10;
  deliveryCharge = 0; // assuming it's free
  finalAmount = 0;
  totalDiscount = 0;
  totalPrice: number = 0;
  savedItems: any[] = []; 
  cartCount: number = 0;
  savedAmount = 0;
    step: number = 1;



    orderForm: FormGroup;


  constructor(
    public productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder

  ) {
    this.orderForm = this.fb.group({
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      paymentMethod: ['COD', Validators.required]
    });
  }

 ngOnInit(): void {
  this.getAllProductsByCustomerId();
}


getAllProductsByCustomerId(): void {
  const CustomerId = localStorage.getItem('userId');
  const parsedCustomerId = Number(CustomerId);

  if (!parsedCustomerId) {
    this.toastr.error("Customer ID not found. Please refresh the page.");
    return;
  }

  this.productService.getAllProductByCustomerId(parsedCustomerId).subscribe(
    (AllProducts) => {
      this.customerProducts = AllProducts.getAddToCartItem.map((item: any) => ({
        ...item,
        quantity: 1 // Default quantity
      }));
        this.calculatePriceDetails();

    },
    (error) => {
      this.toastr.error('Failed to load products.');
      console.error(error);
    }
  );
}

goToStep2(): void {
    if (this.orderForm.get('address')?.invalid ||
        this.orderForm.get('state')?.invalid ||
        this.orderForm.get('city')?.invalid) {
      this.orderForm.get('address')?.markAsTouched();
      this.orderForm.get('state')?.markAsTouched();
      this.orderForm.get('city')?.markAsTouched();
      this.toastr.error('Please fill step 1 fields correctly.');
      return;
    }
    this.step = 2;
  }

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

submitOrder(): void {
  if (this.orderForm.invalid) {
    this.toastr.error('Please fill in all required fields correctly.');
    return;
  }

  const customerId = localStorage.getItem('userId');
  const parsedCustomerId = Number(customerId);

  const orderDetails = {
    userId: parsedCustomerId,
    products: this.customerProducts.map((item: any) => ({
      productId: item.product.productId,
      quantity: item.quantity,
      price: item.product.price,
      discountPrice: item.product.productOffers?.[0]?.discountPrice || item.product.price
    })),
    totalAmount: this.finalAmount,
    deliveryInfo: this.orderForm.value
  };

  this.productService.submitOrder(orderDetails).subscribe(
    (response) => {
      if (response.message === 'Product added successfully' || response.success) {
        this.toastr.success('Order submitted successfully!');
        this.orderForm.reset({ paymentMethod: 'COD' });

        const modalEl = document.getElementById('orderModal');
        if (modalEl) {
          // const modalInstance = bootstrap.Modal.getInstance(modalEl);
          // modalInstance?.hide();
        }

      } else {
        this.toastr.error('Failed to submit order. Please try again.');
      }
    },
    (error) => {
      this.toastr.error('An error occurred. Please try again later.');
      console.error(error);
    }
  );
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

