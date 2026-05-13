import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductOffers } from 'src/Model/product_offers';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';
// import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.scss']
})
export class ProductOffersComponent implements OnInit {
  productOfferForm!: FormGroup;
  selectedProduct: any;
  noImagesFound:boolean=false;
  id: number =0;
  productOffers: ProductOffers = new ProductOffers();
  minEndDate: Date | undefined;
  maxStartDate: Date | undefined;
  today: Date = new Date();
  // bsConfig: Partial<BsDatepickerConfig> = {
  //   containerClass: 'theme-blue',
  //   dateInputFormat: 'DD MMM YYYY',
  // };
  // bsConfig = {
  //   dateInputFormat: 'YYYY-MM-DD', // Set desired date format
  //   containerClass: 'theme-blue'
  // };

  constructor( private fb: FormBuilder, 
    private toastr: ToastrService,
    public productService:ProductService,
    public categoryService:CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
     this.today = new Date();
     this.today.setHours(0, 0, 0, 0);
    // Initialize the form
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
      startDate: [null],
      endDate: [null],
      description: ['']
    });
  
    // Fetch the selected product
    this.loadProductById();
  
    // Listen for changes in `discountPercentage` and calculate `discountPrice`
    this.productOfferForm.get('discountPercentage')?.valueChanges.subscribe((percentage) => {
      this.calculateDiscountPrice(percentage);
    });
  }

  onStartDateChange(selectedDate: Date) {
    this.minEndDate = selectedDate; // Set minDate for endDate
    this.productOfferForm.get('endDate')?.setValue(null); // Reset endDate if startDate changes
  }

  onEndDateChange(selectedDate: Date) {
    this.maxStartDate = selectedDate; // Set maxDate for startDate
  }


  loadProductById(): void {
    this.spinner.show();
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


  calculateDiscountPrice(percentage: number): void {
    if (this.selectedProduct && this.selectedProduct.price && percentage) {
      const discount = Math.floor((this.selectedProduct.price * percentage) / 100); // Round down to the nearest integer
      const discountedPrice = Math.floor(this.selectedProduct.price - discount); // Ensure the result is an integer
      this.productOfferForm.get('discountPrice')?.setValue(discountedPrice, { emitEvent: false });
    } else {
      this.productOfferForm.get('discountPrice')?.setValue('', { emitEvent: false });
    }
  }


  submitProductOffer(): void {
    this.spinner.show();
    if (this.productOfferForm.valid) {
      this.spinner.show();
      const offerData = this.productOfferForm.value;
      console.log('Offer Data:', offerData);

      // this.productOffers.product_id = this.selectedProduct.productId;
      this.productOffers.product_id = this.selectedProduct._id;
      this.productOffers.offer_name = this.productOfferForm.value.offerName;
      this.productOffers.description = this.productOfferForm.value.description;
      this.productOffers.discount_percentage = this.productOfferForm.value.discountPercentage;
      this.productOffers.discount_price = this.productOfferForm.value.discountPrice;
      this.productOffers.start_date = this.productOfferForm.value.startDate;
      this.productOffers.end_date = this.productOfferForm.value.endDate;
     
    this.productService.createProductOffer(this.productOffers).subscribe(
      // (response) => {
      //   if (response.message === "Product offer created successfully.") {
      //     this.toastr.success("Product offer submitted successfully!", "Success");
      //     this.productOfferForm.reset();
      //   } 
      //   else if (response.errorType === "productExists") {
      //     this.toastr.error("A product offer already exists for this product.", "Error");
      //   } 
      //   else if (response.errorType === "serverError") {
      //     this.toastr.error("An error occurred on the server. Please try again later.", "Error");
      //   } 
      //   else {
      //     this.toastr.error("Failed to add product offer. Please try again.", "Error");
      //   }
      // },
      // (error) => {
      //   this.toastr.error('An error occurred. Please try again later.', 'Error');
      // }

      (response: any) => {
        this.spinner.hide();
        if (response.message === "Product offer created successfully.") {
          this.toastr.success("Product offer submitted successfully!");
          this.productOfferForm.reset();
        } 
      },
      (error: any) => {
        this.spinner.hide();
        if (error.error && error.error.errorType === "productExists") {
          this.toastr.error("A product offer already exists for this product.");
        } 
        else if (error.error && error.error.errorType === "validationError") {
          this.toastr.error("Required fields are missing or invalid.");
        } 
        else if (error.error && error.error.errorType === "serverError") {
          this.toastr.error("An error occurred on the server. Please try again later.");
        } 
        else {
          this.toastr.error("Failed to add product offer. Please try again.");
        }
      }
    );
  // } else {
  //   this.productOfferForm.markAllAsTouched(); 
  //   this.toastr.error('Please fill all required fields correctly.', 'Error');
  // }
   }
}
}
