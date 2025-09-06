import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit {

  mainCategoryForm!: FormGroup;
  selectedCategory: any;
  getAllProductDetails: any[] = [];
  showConfirmDialog = false;
  noProductData =false;
  categoryToDelete: number | null = null;

  constructor(private router: Router, public productService: ProductService,private toastr:ToastrService) {}

  ngOnInit(): void {
    this.loadAllProductDetails()
  }

  loadAllProductDetails(): void {
    this.productService.getAllProductDetails().subscribe(
      (response) => {

        if (response.noProductData) {
          // Handle no subcategory case
          this.noProductData=true;

        } else {
          this.noProductData=false;
          this.getAllProductDetails = response;
          // alert(JSON.stringify(this.getAllProductDetails))
        }
        
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }


  
  
  navigateToEditProducts(productId: number) {
    // this.categoryService.setSubCategoryId(categoryId);
    this.productService.productId.next(productId);
   
     this.router.navigate(['/fashionflair/dashboard/products/edit-products']);
  }  

  
  navigateToViewProductDetails(productId: number) {
    this.productService.productId.next(productId);
    
     this.router.navigate(['/fashionflair/dashboard/products/view/products-details']);
  }

 
}
