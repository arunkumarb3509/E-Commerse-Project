import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-main-category-grid',
  templateUrl: './main-category-grid.component.html',
  styleUrls: ['./main-category-grid.component.scss'],
})
export class MainCategoryGridComponent implements OnInit {
  mainCategoryForm!: FormGroup;
  selectedCategory: any;
  mainCategories: any[] = [];
  showConfirmDialog = false;
  categoryToDelete: number | null = null;
  noMainCategory: boolean = true;
  paginationData: any = {
    info: 'show',
    data: [],
    start: 0,
    back: 0,
    next: 0,
    end: 0,
    backtab: 'hide',
    nexttab: 'hide',
  };

  limit: number = 10;
  total: number = 0;
  offset: number = 0;

  constructor(
    private router: Router,
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryService.mainCategoryList.subscribe({
      next: (mainCategoryListStatus) => {
        if (mainCategoryListStatus) {
          this.loadMainCategories();
          this.categoryService.mainCategoryList.next(false);
        }
      },
    });
    // this.loadMainCategories();
    this.loadMainCategories(0);
  }

  // loadMainCategories(): void {
  //   this.categoryService.getMainCategories().subscribe(
  //     (categories) => {
  //       this.mainCategories = categories;
  //       this.noMainCategory=false;
  //     },
  //     (error) => {
  //       this.noMainCategory=true;
  //       console.error('Error fetching categories', error);
  //     }
  //   );
  // }

  loadMainCategories(offset: number = 0): void {
    this.categoryService.getMainCategories(offset, this.limit).subscribe(
      (res) => {
        this.mainCategories = res;
        this.total = res.total;
        this.offset = res.offset;
        this.buildPagination();
        this.noMainCategory = false;
      },
      (error) => {
        this.noMainCategory = true;
        console.error('Error fetching categories', error);
      }
    );
  }

  buildPagination() {
    let pages = [];
    const totalPages = Math.ceil(this.total / this.limit);
    const currentPage = Math.floor(this.offset / this.limit) + 1;

    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        btn_length: i,
        offset_count: (i - 1) * this.limit,
        load: i !== currentPage,
      });
    }

    this.paginationData = {
      ...this.paginationData,
      data: pages,
      backtab: currentPage > 1 ? 'show' : 'hide',
      nexttab: currentPage < totalPages ? 'show' : 'hide',
      back: (currentPage - 2) * this.limit,
      next: currentPage * this.limit,
      start: 0,
      end: (totalPages - 1) * this.limit,
    };
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
        this.mainCategories = this.mainCategories.filter(
          (category) => category.id !== categoryId
        );
        // alert('Category deleted successfully.');
        this.toastr.success(
          'Main category and its subcategories successfully deleted'
        );
      },
      (error) => {
        console.error('Error deleting category', error);
        this.toastr.error('Failed to delete the category.');
        // alert('Failed to delete the category.');
      }
    );
  }
}
