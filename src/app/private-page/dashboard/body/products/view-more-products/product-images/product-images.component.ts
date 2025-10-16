import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  productImageForm: FormGroup;
  formData = new FormData();
  selectedFiles: File[] = [];
  uploadedFiles: any[] = [];
  fileObjects: File[] = []; 
  // selectedImage: any;
  selectedProduct: any;
  selectedImage: any;
  noImagesFound:boolean=false;
  uploadedImages: { name: string; url: string }[] = [];
  id: number =0;
  mainImage: string = '../../../assets/Images/card-full-shirt.png'; 

  imageNames = Array.from({ length: 5 }, (_, i) => `Image_Name${i + 1}`);
  imageFiles = Array.from({ length: 5 }, (_, i) => `Image${i + 1}`);

  constructor( private fb: FormBuilder, 
    private toastr: ToastrService,
    public productService:ProductService,
    public categoryService:CategoryService,
    private router: Router,
    private route: ActivatedRoute) {
    this.productImageForm = this.fb.group(
      this.imageNames.reduce(
        (acc, name) => ({
          ...acc,
          [name]: ['',]
        }),
        {}
      )
    );

    // Add file upload controls dynamically
    this.imageFiles.forEach(file => {
      this.productImageForm.addControl(file, this.fb.control('',));
    });
   }

  ngOnInit(): void {
    this.loadProductById();

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

  loadProductById(): void {
    const productId = this.route.snapshot.paramMap.get('id');
 
    this.productService.productId.subscribe({
     next: (product) => {
        this.id=product;
        }
      });
 
    // Fetch product details by ID
    this.productService.getProductById(this.id).subscribe(
      (product) => {
        this.selectedProduct = product;
        if (product.noImagesFound) {
          this.noImagesFound=false;
        } else {
          this.noImagesFound=true;
        }
    },
      (error) => {
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

  isFormValid(): boolean {
    const isImageNamesValid = this.imageNames.some(name => this.productImageForm.get(name)?.value?.trim());
    const isImageFilesValid = this.imageFiles.some(file => this.productImageForm.get(file)?.value);
    return isImageNamesValid && isImageFilesValid && this.productImageForm.valid;
  }

  onSubmit(): void {
    this.productImageForm.markAllAsTouched();

    // Check if at least one field in `imageNames` and `imageFiles` has a valid value
    const isImageNamesValid = this.imageNames.some(name => this.productImageForm.get(name)?.value?.trim());
    const isImageFilesValid = this.imageFiles.some(file => this.productImageForm.get(file)?.value);
  
    if (!isImageNamesValid || !isImageFilesValid) {
      this.toastr.error('Please fill at least one Image Title and upload one Image.');
      return;
    }
  
   this.formData.append('productId', this.id.toString());
   this.formData.append('userId', localStorage.getItem('userId') || '');
   this.imageNames.forEach((name, index) => {
    this.formData.append(`Image_Title${index + 1}`, this.productImageForm.get(name)?.value || '');
  });

  this.imageFiles.forEach((file, index) => {
    const input = this.productImageForm.get(file);
    if (input?.value) {
      this.formData.append(`Image${index + 1}`, input.value);
    }
  });

    this.productService.uploadProductImage(this.id,this.formData).subscribe(
      (response) => {
        if (response.savedImages) {
          this.productImageForm.reset();
          this.toastr.success('Product image Uploaded successfully');
          this.router.navigate(['/fashionflair/dashboard/products/view/products-details']);
          // this.getProductImage();
          this.categoryService.subCategoryList.next(true);
        } else {
          this.toastr.error('Error uploading product image');
        }
      },
      (error) => {
        console.error('Error uploading product image', error);
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }

  changeMainImage(imagePath: string): void {
    this.mainImage = imagePath;
    this.selectedImage = imagePath;
  }

}
