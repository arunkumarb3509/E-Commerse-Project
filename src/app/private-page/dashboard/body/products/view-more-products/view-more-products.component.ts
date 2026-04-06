import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-view-more-products',
  templateUrl: './view-more-products.component.html',
  styleUrls: ['./view-more-products.component.scss']
})
export class ViewMoreProductsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  id: number =0;
  selectedProduct: any;
  selectedProductOffer: any;
  selectedFile: File | undefined;
  formData = new FormData();
  getProductImages :any[] = [];
  errorMessage: string = '';
  uploadedImages: { name: string; url: string }[] = [];
  selectedFiles: File[] = [];
  uploadedFiles: any[] = [];
  fileObjects: File[] = []; 
  noImagesFound:boolean=false;
  isModalOpen = false;
  selectedImage: any;
  productOfferForm!: FormGroup;
  noProductOffer: boolean = false;
  mainImage: string = ''; 

  @ViewChild('imageModal') imageModal!: ElementRef;
  
  


  constructor(
    private fb: FormBuilder, 
    private toastr: ToastrService,
    public productService:ProductService,
    public categoryService:CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) 
    {
      // this.productImageForm = this.fb.group(
      //   this.imageNames.reduce(
      //     (acc, name) => ({
      //       ...acc,
      //       [name]: ['',]
      //     }),
      //     {}
      //   )
      // );
  
      // // Add file upload controls dynamically
      // this.imageFiles.forEach(file => {
      //   this.productImageForm.addControl(file, this.fb.control('',));
      // });
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //   if (changes['selectedProduct'] && this.selectedProduct) {
    //     this.setDiscountPrice();
    //   }
    // }


  ngOnInit(): void {
    this.productOfferForm = this.fb.group({
      offerName: ['', Validators.required],
      discountPercentage: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100), 
          Validators.pattern('^[0-9]+$') 
        ]
      ],
      discountPrice: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$') 
        ]
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });

     // Listen for changes in `discountPercentage` and calculate `discountPrice`
     this.productOfferForm.get('discountPercentage')?.valueChanges.subscribe((percentage) => {
      this.calculateDiscountPrice(percentage);

    });

    this.loadProductById();
    this.loadProductOfferById();
    // this.initializeForm();
    this.productService.productId.subscribe({
      next: (product) => {
        this.id = product;
        if (this.id) {
          this.getProductImage();
        }
      },
    });

    this.productService.productId.subscribe((id) => {
      if (id !== null) {
        this.loadProductDetails(id);
      }
    });
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.selectedProduct = product;
        // Check if the product has images
        if (product.productImages && product.productImages.length > 0) {
          this.mainImage = `data:image/png;base64,${product.productImages[0].images}`; // Set the first image as the main image
          this.selectedImage = this.mainImage;
          this.noImagesFound = false;
        } else {
          this.noImagesFound = true;
          this.mainImage = '../../../assets/Images/no-image-available.png'; // Fallback for no images
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

  calculateDiscountPrice(discountPercentage: number): void {
    if (this.selectedProduct && discountPercentage) {
      const originalPrice = this.selectedProduct.price;
      const discountPrice = originalPrice - (originalPrice * discountPercentage) / 100;

      // Set the calculated discount price in the form
      this.productOfferForm.patchValue({ discountPrice: discountPrice.toFixed(1) });
    
    }
  }


  getProductImage(): void {
    this.spinner.show();
    this.productService.getProductImageById(this.id).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.productImages && response.productImages.length > 0) {
          this.getProductImages = response.productImages;

        } else {
          this.getProductImages = [];
          this.errorMessage = 'No images found for this product.';
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('Error fetching product images:', error);
        this.errorMessage = 'Failed to fetch product images. Please try again.';
      }
    );
  }

 
  loadProductById(): void {
    this.spinner.show();
    const productId = this.route.snapshot.paramMap.get('id');
 
    this.productService.productId.subscribe({
     next: (product) => {
      this.spinner.hide();
        this.id=product;
        }
      });
 
    // Fetch product details by ID
    this.productService.getProductById(this.id).subscribe(
      (product) => {
        this.spinner.hide();
        this.selectedProduct = product;
        if (product.noImagesFound) {
          this.noImagesFound=false;
        } else {
          this.noImagesFound=true;
        }
    },
      (error) => {
        this.spinner.hide();
        console.error('Error fetching product:', error);
      }
    );
   }

  onFileSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formData.append(`Image${index + 1}`, file);
    }
  }

  openModal(image: any): void {
    this.selectedImage = image;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
  }

  
  loadProductOfferById(): void {
    this.spinner.show();
    this.productService.getProductOfferById(this.id).subscribe(
      (response) => {
        this.spinner.hide();
        if (response.message === 'Product offer retrieved successfully.') {
          this.selectedProductOffer = response;
          this.noProductOffer = false;
          //  this.toastr.success('Product offer loaded successfully!', 'Success');
        } else if (response.message === 'No product offer for this product.') {
          this.selectedProductOffer = null;
          this.noProductOffer = true;
          // this.toastr.error('No product offer for this product.', 'Error');
        } else {
          this.toastr.error('Failed to retrieve product offer. Please try again.');
        }
      },
      (error) => {
        this.spinner.hide();
        // alert("error"+this.id)
        console.error('Error fetching product offer:', error);
        // this.toastr.error('Failed to fetch product offer.', 'Error');
      }
    );
   }

}
