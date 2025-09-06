import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-main-category-grid',
  templateUrl: './main-category-grid.component.html',
  styleUrls: ['./main-category-grid.component.scss']
})
export class MainCategoryGridComponent implements OnInit {
  mainCategoryForm!: FormGroup;
  selectedCategory: any;
  mainCategories: any[] = [];
  showConfirmDialog = false;
  categoryToDelete: number | null = null;
  noMainCategory:boolean=true;

  constructor(private router: Router, public categoryService: CategoryService,private toastr:ToastrService) {}

  ngOnInit(): void {

    this.categoryService.mainCategoryList.subscribe({
      next: (mainCategoryListStatus) => {
         if(mainCategoryListStatus){
          this.loadMainCategories();
          this.categoryService.mainCategoryList.next(false);
         }
         }
       });
    this.loadMainCategories();
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        this.mainCategories = categories;
        this.noMainCategory=false;
      },
      (error) => {
        this.noMainCategory=true;
        console.error('Error fetching categories', error);
      }
    );
  }

  navigateToEditCategory(categoryId: number): void {
    this.categoryService.mainCategoryId.next(categoryId);
    this.router.navigate(['/fashionflair/dashboard/view-maincategory']);
  }


  openConfirmDialog(categoryId: number): void {
    this.showConfirmDialog = true;
    this.categoryToDelete = categoryId;
  }

  confirmDelete(): void {
    if (this.categoryToDelete !== null) {
      this.deleteCategory(this.categoryToDelete);
    }
    this.closeDialog();
  }

  cancelDelete(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.showConfirmDialog = false;
    this.categoryToDelete = null;
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteMainCategory(categoryId).subscribe(
      (response) => {
        console.log('Deletion successful', response);
        // Remove the deleted category from the mainCategories array
        this.mainCategories = this.mainCategories.filter((category) => category.id !== categoryId);
        // alert('Category deleted successfully.');
        this.toastr.success(
          'Main category and its subcategories successfully deleted',
        );
      },
      (error) => {
        console.error('Error deleting category', error);
        this.toastr.error(
          'Failed to delete the category.',
        );
        // alert('Failed to delete the category.');
      }
    );
  }
}

