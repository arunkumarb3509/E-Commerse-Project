import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-sub-category-grid',
  templateUrl: './sub-category-grid.component.html',
  styleUrls: ['./sub-category-grid.component.scss']
})
export class SubCategoryGridComponent implements OnInit {
  subCategories: any[] = [];
  errorMessage: string | null = null; // To hold the error message
  customer: any;
  categoryTypes: any[] = [];
  constructor( private router: Router, public categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.subCategoryList.subscribe({
      next: (subCategoryListStatus) => {
         if(subCategoryListStatus){
          this.loadSubCategories();
          // this.loadCategoryTypes();
          this.categoryService.subCategoryList.next(false);
         }
         }
       });

     this.loadSubCategories();
     this.loadCategoryTypes();
 
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

  loadSubCategories(): void {
    this.categoryService.getSubCategories().subscribe(
      (response) => {// Assign the fetched data to the mainCategories array
        
        if (response.noSubCategory) {
          // Handle no subcategory case
          this.errorMessage = response.message;
          this.subCategories = []; 
        } else {
          // Handle successful data fetch
          this.subCategories = response;
          this.errorMessage = null; // Clear any existing error message
          console.log(this.subCategories);
        }
      },
      (error) => {
        console.error('Error fetching categories', error);
        this.errorMessage = 'No subcategories found';
      }
    );
      }

      // Method to find category type name by categoryTypeId
    getCategoryTypeName(categoryTypeId: number): string {
     const categoryType = this.categoryTypes.find(ct => ct.id === categoryTypeId);
     return categoryType ? categoryType.typeName : 'Unknown';
     }

      navigateToViewCategory(categoryId: number) {
        this.categoryService.subCategoryId.next(categoryId)
        this.router.navigate(['/fashionflair/dashboard/view-subcategory']);
      }
      
  }
