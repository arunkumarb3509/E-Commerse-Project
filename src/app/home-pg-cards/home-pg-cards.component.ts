import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/Services/cart.service';
import { ProductService } from 'src/Services/product.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home-pg-cards',
  templateUrl: './home-pg-cards.component.html',
  styleUrls: ['./home-pg-cards.component.scss']
})
export class HomePgCardsComponent implements OnInit {
  @Input() categoryTypeId: number | null = null; 
  mainImage: string = '../../../assets/Images/No-Image.png';
  noImagesFound = false;
  selectedImage: string = this.mainImage;
  products: any[] = [];
  noProducts:boolean=false;
  @Input() selectedProduct: { id: number; addedToCart: boolean } = { id: 0, addedToCart: false };
  // productId :number=0;
  selectedProductOffer:any
  id:number=0;


  constructor(public productService:ProductService,private router: Router,
    private cartService: CartService ,private toastr: ToastrService,
  private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryTypeId'] && changes['categoryTypeId'].currentValue) {
      this.fetchProducts(changes['categoryTypeId'].currentValue);
     
    }
  }
  
  ngOnInit(): void {
    this.fetchAllProducts();
  }
  

  fetchAllProducts(): void {
    this.productService.getAllProductDetails().subscribe(
      (response) => {
        this.products = response;
        this.noProducts = this.products.length === 0;
  
        this.products.forEach((product) => {
          if (product.productImages && product.productImages.length > 0) {
            const firstImage = product.productImages[0];
            if (firstImage.images && firstImage.images.data) {
              product.displayImage = this.arrayBufferToBase64(firstImage.images.data);
            } else if (firstImage.imageUrl) {
              product.displayImage = firstImage.imageUrl; // Use the URL if available
            } else {
              product.displayImage = '../../assets/Images/No-Image.png'; // Default Image
            }
          } else {
            product.displayImage = '../../assets/Images/No-Image.png'; // Default Image
          }
        });
  
        this.selectedImage = this.products.length > 0 ? this.products[0].displayImage : this.mainImage;
      },
      (error) => {
        console.error('Error fetching all products:', error);
        this.noProducts = true;
      }
    );
  }

getFirstImage(product: any) {
  if (product.productImages && product.productImages.length > 0) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpeg;base64,' + product.productImages[0].images
    );
  }
  return '../../assets/Images/No-Image.png'; // fallback image
}

  
  // Convert byte array to base64 string
  arrayBufferToBase64(buffer: any): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  }
  

  private fetchProducts(categoryTypeId: number): void {
    this.productService.getProductsByCategoryTypeId(categoryTypeId).subscribe(
      (response) => {
        this.products = response || []; 
        this.noProducts = response.noProducts || this.products.length === 0;
        console.log('Products fetched by category:', this.products);

        this.products.forEach((product) => {
          if (product.productImages && product.productImages.length > 0) {
            const firstImage = product.productImages[0];
            if (firstImage.images && firstImage.images.data) {
              product.displayImage = this.arrayBufferToBase64(firstImage.images.data);
            } else if (firstImage.imageUrl) {
              product.displayImage = firstImage.imageUrl; // Use the URL if available
            } else {
              product.displayImage = '../../assets/Images/No-Image.png'; 
            }
          } else {
            product.displayImage = '../../assets/Images/No-Image.png'; // Default Image
          }
        });
  
        this.selectedImage = this.products.length > 0 ? this.products[0].displayImage : this.mainImage;
      },
      (error) => {
        console.error('Error fetching products by category:', error);
        this.noProducts = true; 
      }
    );
  }
  
  goToDetails(productCode: string, productName: string) {
    const encryptedCode = this.encryptProductCode(productCode);
    this.router.navigate(['/product-details', encryptedCode, productName]);
  }

  encryptProductCode(productCode: string): string {
    return CryptoJS.AES.encrypt(productCode, environment.publicSecretKey).toString();
  }


  addToCart(productId: string) {
    const guestUserId = sessionStorage.getItem('guestUserId');
  console.log(productId,guestUserId+"dur");
  
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
          this.fetchAllProducts();
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


  

  
}
