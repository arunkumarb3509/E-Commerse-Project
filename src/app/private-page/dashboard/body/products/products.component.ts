import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/Model/product';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;
  mainCategories: any[] = [];
  subCategories: any[] =[];
  selectedTags: string[] = [];
  categoryTypes: any[] = [];
  selectedCategory: string = '';
  selectedSizes: string[] = [];
  sizeStocks: { [key: string]: number } = {}; 
  product: Products = new Products();
  isSubmitDisabled: boolean = true;
  sizeStockMapping: { [key: string]: number } = {};
  isSizeSelectionError: boolean = false;
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

  constructor(private fb: FormBuilder, private toastr: ToastrService,public categoryService: CategoryService,public productService:ProductService) {

    this.productForm = this.fb.group({
      mainCategoryName: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      // categoryType: [{ value: '', disabled: true }], 
      categoryType: [null],
      materialType: [''],
      returnPolicy: [''],
      careInstructions: [''],
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Regex for price
      totalStock: ['', [Validators.required, Validators.min(1)]],
      reducedPrice: ['', [Validators.required, Validators.min(0)]],
      availability: ['', Validators.required],
      productDescription: [''],
      Weight: [''],
      Dimension: [''],
      ShippingClass:['', Validators.required],
      metaTitle:['', Validators.required],
      metaDescription: [''],
      keywords:['', Validators.required],
      // sizeTotalQuantity: ['', Validators.required],
      // ProductSize: ['', Validators.required],
    });
    
  }

  ngOnInit(): void {
    this.loadMainCategories();
    // this.loadSubCategories();
    // this.loadCategoryTypes();
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

  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    const selectedCategory = this.mainCategories.find(category => category.categoryId == selectedCategoryId);
  // alert("new"+JSON.stringify(selectedCategory.categoryId))
    const mainCategoryId= selectedCategory.categoryId;
     // Call API to fetch subcategories for the selected main category
     this.categoryService.getMainCategoryById(mainCategoryId).subscribe(
      (response) => {
        this.filteredSubCategories = response.subCategories; // Assuming API response includes subcategories
        this.productForm.patchValue({ subCategoryName: '' }); // Reset subcategory selection
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

      // Validate selection after each change
    // this.validateSizeSelection();
    }
  }


  resetSizesAndStocks(): void {
    this.selectedSizes = []; // Clear selected sizes
    this.sizeStockMapping = {}; // Clear stock mapping
    this.updateTotalStock(); // Recalculate total stock to reflect changes
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
      this.productForm.get('categoryType')?.setValue(this.selectedCategoryTypeId);
    } else {
      //  this.selectedCategoryType = null; // Set to null if no categoryType is available
      this.productForm.get('categoryType')?.setValue('N/A');
    }
  }
  

  // Handle the checkbox change
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
    // this.validateSubmitButton(); // Enable/disable submit button
  }


  // Function to calculate total stock
  getTotalStock(): number {
    return Object.values(this.sizeStockMapping).reduce((acc, stock) => acc + stock, 0);
  }

  // Update the total stock field in the form
  updateTotalStock() {
    this.productForm.patchValue({
      totalStock: this.getTotalStock(),
    });
  }

  // Update stock mapping when the stock input changes
  onStockInputChange(size: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);

    if (!isNaN(value)) {
      this.sizeStockMapping[size] = value; 
    } else {
      // If the input is invalid, reset to 0
      this.sizeStockMapping[size] = 0;
    }

    // After each input change, update the total stock
    this.updateTotalStock();
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); 
      return;
    }

    if (this.productForm.valid) {
      // Map form values to product model
      this.product.categoryId = this.productForm.value.mainCategoryName;
      this.product.subCategoryId = this.productForm.value.subCategoryName;
      this.product.categoryTypeId = this.productForm.value.categoryType;
      this.product.materialType = this.productForm.value.materialType;
      this.product.returnPolicy = this.productForm.value.returnPolicy;
      this.product.careInstructions = this.productForm.value.careInstructions;
      this.product.productCode = this.productForm.value.productCode;
      this.product.productName = this.productForm.value.productName;
      this.product.brand = this.productForm.value.brand;
      this.product.price = this.productForm.value.price;
      this.product.totalStock = this.productForm.value.totalStock;
      this.product.reducedPrice = this.productForm.value.reducedPrice;
      this.product.availability = this.productForm.value.availability;
      this.product.productDescription = this.productForm.value.productDescription;
      this.product.Weight = this.productForm.value.Weight;
      this.product.Dimension = this.productForm.value.Dimension;
      this.product.ShippingClass = this.productForm.value.ShippingClass;
      this.product.metaTitle = this.productForm.value.metaTitle;
      this.product.metaDescription = this.productForm.value.metaDescription;
      this.product.keywords = this.productForm.value.keywords;
      this.product.selectedSizes = this.selectedSizes;
      this.product.sizeStockMapping = this.selectedSizes.reduce((mapping, size) => {
        mapping[size] = this.sizeStockMapping[size] || 0; 
        return mapping;
      }, {} as { [key: string]: number });
  
      // Call the product service to save the product
      this.productService.addProduct(this.product).subscribe(
        (response) => {
          if (response.message === 'Product added successfully') {
            this.toastr.success('Product details submitted successfully!');
            this.productForm.reset();
          } else {
            this.toastr.error('Failed to add product. Please try again.');
          }
        },
        (error) => {
          this.toastr.error('An error occurred. Please try again later.');
        }
      );
    } else {
      this.productForm.markAllAsTouched(); 
      this.toastr.error('Please fill all required fields correctly.');
    }
  }
  
}
