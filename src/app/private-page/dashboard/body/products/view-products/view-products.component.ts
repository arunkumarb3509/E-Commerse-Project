import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent implements OnInit {
  editProductForm!: FormGroup;
  mainCategories: any[] = [];
  subCategories: any[] = [];
  categoryTypes: any[] = [];
  selectedCategory: string | null = null;
  getAllProductDetails: any[] = [];
  noProductData = false;
  id: number =0;
  selectedProduct: any;
  sizeStockMapping: { [key: string]: number } = {};
  selectedSizes: string[] = [];
  filteredSubCategories: any[] = [];
  selectedCategoryType: string = '';
  selectedCategoryTypeId:number =0;


  countries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'India',
    'China',
    'Japan',
    'Brazil',
    'Mexico',
    'South Africa',
    'Russia',
    'Argentina',
    'New Zealand'
  ];

  menSizes = ['3XL', 'XXL','XL','L', 'M', 'S/M','S'];
  womenSizes = ['XXXL', 'XXL','XL','L', 'M', 'S'];
  kidsSizes = ['2T', '3T', '4T', 'SM', 'M'];
  newbornSizes=['Newborn(NB)','0-3 Month','3-6 Month','6-9 Month','9-12 Month'];
  seasonalSizes=['XXXL', 'XXL','XL','L', 'M', 'S'];
  
  constructor(
    private fb: FormBuilder, 
    private toastr: ToastrService,
    public productService:ProductService,
    public categoryService:CategoryService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProductById();
    this.loadMainCategories();
    
  }


  initializeForm(): void {
    this.editProductForm = this.fb.group({
      mainCategoryName: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      categoryType: [null],
      materialType: [''],
      returnPolicy: [''],
      careInstructions: [''],
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Regex for price
      totalStock: ['', [Validators.required, Validators.min(0)]],
      reorderLevel: ['', [Validators.required, Validators.min(0)]],
      availability: ['', Validators.required],
      productDescription: [''],
      weight: ['', Validators.required],
      Dimension: ['', Validators.required],
      ShippingClass:['', Validators.required],
      metaTitle:['', Validators.required],
      metaDescription: [''],
      keywords:['', Validators.required],
    });
  }

  getTotalStock(): number {
    return Object.values(this.sizeStockMapping).reduce((acc, stock) => acc + stock, 0);
  }

  onSizeChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const size = checkbox.value;
  
    if (checkbox.checked) {
      // Add the size if checked
      this.selectedSizes.push(size);
      this.sizeStockMapping[size] = 0; // Initialize stock to 0
    } else {
      // Remove the size if unchecked
      this.selectedSizes = this.selectedSizes.filter((s) => s !== size);
      delete this.sizeStockMapping[size];
    }
  
    this.updateTotalStock(); // Recalculate total stock
    
  }
  
  updateTotalStock() {
    this.editProductForm.patchValue({
      totalStock: this.getTotalStock(),
    });
  }

  onStockInputChange(size: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);

    if (!isNaN(value)) {
      this.sizeStockMapping[size] = value; // Update stock mapping with the input value
    } else {
      // If the input is invalid, reset to 0
      this.sizeStockMapping[size] = 0;
    }

    // After each input change, update the total stock
    this.updateTotalStock();
  }

  onSubCategoryChange(event: Event): void {
    const selectedSubCategoryId = (event.target as HTMLSelectElement).value;
  
    // Find the selected subcategory
    const selectedSubCategory = this.filteredSubCategories.find(
      (subcategory) => subcategory.subCategoryId == selectedSubCategoryId
    );
  
    // Update `selectedCategoryType` and the form control
    if (selectedSubCategory && selectedSubCategory.categoryType) {
      this.selectedCategoryTypeId = selectedSubCategory.categoryType.categoryTypeId;
      this.selectedCategoryType = selectedSubCategory.categoryType.typeName;
      this.editProductForm.get('categoryType')?.setValue(this.selectedCategoryTypeId);
    } else {
      //  this.selectedCategoryType = null; // Set to null if no categoryType is available
      this.editProductForm.get('categoryType')?.setValue('N/A');
    }
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        console.log(categories);
        this.mainCategories=categories;
        
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }


  loadCategoryTypes(): void {
    this.categoryService.getCategoryType().subscribe(
      (categories) => {
        console.log(categories);
        this.categoryTypes=categories;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  loadAllProductDetails(): void {
    this.productService.getAllProductDetails().subscribe(
      (response) => {
        if (response.noProductData) {
          this.noProductData = true;
        } else {
          this.noProductData = false;
          this.getAllProductDetails = response;
        }
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }


  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    const selectedCategory = this.mainCategories.find(category => category.categoryId == selectedCategoryId);
 
    const mainCategoryId= selectedCategory.categoryId;
     // Call API to fetch subcategories for the selected main category
     this.categoryService.getMainCategoryById(mainCategoryId).subscribe(
      (response) => {
        this.filteredSubCategories = response.subCategories; // Assuming API response includes subcategories
      //  this.editProductForm.patchValue({  subCategoryName: response.subCategoryName });
       this.editProductForm.patchValue({  subCategoryName: '' }); // Reset subcategory selection
        this.selectedCategoryType = '';
      },
      (error) => {
        console.error('Error fetching subcategories', error);
      }
    );

    if (selectedCategory) {
      const categoryName = selectedCategory.categoryName;
  
      if (categoryName === "Men's Clothing" || categoryName === "Men's Activewear") {
        this.selectedCategory = 'Men';
      } else if (categoryName === "Women's Clothing" || categoryName === "Women's Activewear" ) {
        this.selectedCategory = 'Women';
      } else if (categoryName === "Boys's Clothing" || categoryName === "Girls's Clothing" ) {
        this.selectedCategory = 'Kids';
      } else if (categoryName === "Newborn Clothing") {
        this.selectedCategory = 'Newborn';
      }else if (categoryName === "Toddler Clothing") {
        this.selectedCategory = 'Kids';
      }else if (categoryName === "Seasonal Clothing" || categoryName === "Specialty Clothing") {
        this.selectedCategory = 'Seasonal';
      }else {
        this.selectedCategory = 'Seasonal';
      }

       // Reset sizes and stocks when category changes
     this.resetSizesAndStocks();
    }
  }

  resetSizesAndStocks(): void {
    this.selectedSizes = []; // Clear selected sizes
    this.sizeStockMapping = {}; // Clear stock mapping
    this.updateTotalStock(); // Recalculate total stock to reflect changes
  }

  loadProductById(): void {
   // Retrieve the product ID from the route parameters
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
       console.log('Fetched product:', product);

        // Populate the form with the retrieved product data
     this.editProductForm.patchValue({
          mainCategoryName: product.mainCategory.categoryId,
          // subCategoryName: product.subcategory.subCategoryId,
          subCategoryName: product.subcategory.subCategoryId,
          categoryType: product.categoryType.typeName,       
          materialType: product.materialType,
          returnPolicy: product.seoInformation.returnPolicy,
          careInstructions: product.seoInformation.careInstructions,
          productCode: product.productCode,
          productName: product.productName,
          brand: product.brand,
          price: product.price,
          totalStock: product.totalStock,
          reorderLevel: product.reorderLevel,
          availability: product.availability,
          productDescription: product.productDescription,
          weight: product.shippingInformation.weight,
          Dimension: product.shippingInformation.dimensions,
          ShippingClass: product.shippingInformation.shippingClass,
          metaTitle: product.seoInformation.metaTitle,
          metaDescription: product.seoInformation.metaDescription,
          keywords: product.seoInformation.keywords,
        });
      
     },
     (error) => {
       console.error('Error fetching product:', error);
     }
   );

  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      // Get the product ID from the route parameters
      const productId = this.route.snapshot.paramMap.get('id');
      
      const userId = localStorage.getItem('userId');
  
      if (this.id) {
        // Prepare the updated data from the form
        const updatedData = {
          // mainCategoryName: this.editProductForm.value.mainCategoryName,
          // subCategoryName: this.editProductForm.value.subCategoryName,
          // categoryType: this.editProductForm.value.categoryType,
          categoryId : this.editProductForm.value.mainCategoryName,
          subCategoryId : this.editProductForm.value.subCategoryName,
          categoryTypeId : this.editProductForm.value.categoryType,
          materialType: this.editProductForm.value.materialType,
          returnPolicy: this.editProductForm.value.returnPolicy,
          careInstructions: this.editProductForm.value.careInstructions,
          productCode: this.editProductForm.value.productCode,
          productName: this.editProductForm.value.productName,
          brand: this.editProductForm.value.brand,
          price: parseFloat(this.editProductForm.value.price), // Convert to float
          totalStock: parseInt(this.editProductForm.value.totalStock, 10), // Convert to int
          reorderLevel: parseInt(this.editProductForm.value.reorderLevel, 10), // Convert to int
          availability: this.editProductForm.value.availability,
          productDescription: this.editProductForm.value.productDescription,
          weight: parseFloat(this.editProductForm.value.weight), // Convert to float
          dimension: this.editProductForm.value.dimension,
          shippingClass: this.editProductForm.value.shippingClass,
          metaTitle: this.editProductForm.value.metaTitle,
          metaDescription: this.editProductForm.value.metaDescription,
          keywords: this.editProductForm.value.keywords,
          selectedSizes :this.selectedSizes,
          sizeStockMapping :this.selectedSizes.reduce((mapping, size) => {
            mapping[size] = this.sizeStockMapping[size] || 0; // Default stock to 0 if not set
            return mapping;
          }, {} as { [key: string]: number }),
          userId
          // Add userId to updatedData for the modifiedBy field
          // updatedData.modifiedBy = userId;
        };
        
        alert(JSON.stringify(updatedData))
  
        // Call the service to update the product
        this.productService.updateProduct(this.id, updatedData).subscribe(
          (response) => {
            if (response) {
              // Reset the form and navigate to the main categories list
              this.editProductForm.reset();
              this.router.navigate(['/fashionflair/dashboard/products/view-products']);
              // Display a success message
              this.toastr.success('Product updated successfully');
            } else {
              // Display an error message if the update was unsuccessful
              this.toastr.error('Error updating the product');
            }
          },
          (error) => {
            // Handle server error
            console.error('Error updating the product:', error);
            this.toastr.error('Server error. Please try again later.');
          }
        );
      } else {
        this.toastr.error('Product ID is missing');
      }
    } else {
      // Display a message if the form is invalid
      this.toastr.warning('Please fill out the form correctly');
    }
  }
  
}
