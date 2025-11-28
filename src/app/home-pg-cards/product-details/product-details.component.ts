import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/Services/cart.service';
import * as CryptoJS from 'crypto-js';
import { ProductService } from 'src/Services/product.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  mainImage: string = '../../../assets/Images/card-full-shirt.png'; // Default image
  selectedProduct: any = {};
  noImagesFound = false;
  selectedImage: string = this.mainImage;
  decryptedProductCode: string = '';
  selectedCategory: string = '';

  constructor( public productService:ProductService,private cartService: CartService,private route: ActivatedRoute,private toastr: ToastrService) { }
  
ngOnInit(): void {
  this.route.params.subscribe(params => {
    const encryptedCode = params['code']; // Get the encrypted product code from URL
    this.decryptedProductCode = this.decryptProductCode(encryptedCode);
    
    if (this.decryptedProductCode) {
      this.loadProductDetails(this.decryptedProductCode);
    }
  });
}

decryptProductCode(encryptedCode: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedCode, environment.publicSecretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

// addToCart(productId: number) {
//   let guestUserId = sessionStorage.getItem('guestUserId');

//   if (!guestUserId) {
//     this.toastr.error("Guest User ID not found. Please refresh the page.");
//     return;
//   }

//   // Update the BehaviorSubject with the current product ID
//   // this.cartService.productId.next(productId);
//   sessionStorage.setItem('productId', productId.toString());

//   // Now pass the value directly to the service
//   this.cartService.addToCart(productId, guestUserId).subscribe({
//     next: (response) => {
//       if (response.itemAddedSuccess) {
//         this.toastr.success('Item added successfully');
//         // this.fetchAllProducts();
//         this.cartService.updateCartCountFromServer(guestUserId); 
//       } else if (response.itemAlreadyExist) {
//         this.toastr.warning('Product already in cart.');
//       } else if (response.itemAlreadySaved) {
//         this.toastr.info('Product already saved for later.');
//       } else {
//         this.toastr.error('Error adding to cart.');
//       }
//     },
//     error: (err) => {
//       this.toastr.error('Something went wrong.');
//     }
//   });
  
// }
addToCart(productId: any) {
  const guestUserId = sessionStorage.getItem('guestUserId');

  if (!guestUserId) {
    console.log("Please refresh your screen: guestUserId is missing");
    return;
  }

  // Update the BehaviorSubject with the current product ID
  // this.cartService.productId.next(productId);
  // sessionStorage.setItem('productId', productId.toString());

  // Now pass the value directly to the service
  this.cartService.addToCart(productId, guestUserId).subscribe({
    next: (response) => {
      if (response.itemAddedSuccess) {
        this.toastr.success('Item added successfully');
        // this.fetchAllProducts();
        this.cartService.updateCartCountFromServer(guestUserId); 
      } else if (response.itemAlreadyExist) {
        this.toastr.warning('Product already in cart.');
      } else if (response.itemAlreadySaved) {
        this.toastr.info('Product already saved for later.');
      } else {
        this.toastr.error('Error adding to cart.');
      }
    },
    error: (err) => {
      this.toastr.error('Something went wrong.');
    }
  });
  
}

onChangeSizechart(productName: string): void {

  if (productName) {
    if (productName === "Men's Clothing" || productName === "Men's Activewear") {
      this.selectedCategory = 'Men';
    } else if (productName === "Women's Clothing" || productName === "Women's Activewear") {
      this.selectedCategory = 'Women';
    } else if (productName === "Boys's Clothing" || productName === "Girls's Clothing") {
      this.selectedCategory = 'Kids';
    } else if (productName === "Newborn Clothing") {
      this.selectedCategory = 'Newborn';
    } else if (productName === "Toddler Clothing") {
      this.selectedCategory = 'Kids';
    } else if (productName === "Seasonal Clothing" || productName === "Specialty Clothing") {
      this.selectedCategory = 'Seasonal';
    } else {
      this.selectedCategory = 'Seasonal';
    }
  }
}


loadProductDetails(productCode: string): void {
  this.productService.getProductByProductCode(productCode).subscribe(
    (product) => {
      this.selectedProduct = product;
      // Check if the product has images
      if (product.productImages && product.productImages.length > 0) {
        this.mainImage = `data:image/png;base64,${product.productImages[0].images}`; 
        this.selectedImage = this.mainImage;
        this.noImagesFound = false;
      } else {
        this.noImagesFound = true;
        this.mainImage = '../../../assets/Images/no-image-available.png'; 
      }
    },
    (error) => {
      console.error('Error fetching product:', error);
    }
  );
}

changeMainImage(imagePath: string): void {
  this.mainImage = imagePath;
  this.selectedImage = imagePath;
}

}