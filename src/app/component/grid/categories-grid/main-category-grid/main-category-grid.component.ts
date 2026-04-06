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
  allCategories: any[] = [];
  mainCategories: any[] = [];
  showConfirmDialog = false;
  categoryToDelete: number | null = null;
  noMainCategory: boolean = true;

  searchTerm: string = '';
  pageSize: number = 7;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private router: Router,
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryService.mainCategoryList.subscribe({
      next: (status) => {
        if (status) {
          this.loadMainCategories();
          this.categoryService.mainCategoryList.next(false);
        }
      },
    });
    this.loadMainCategories();
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories(0, 1000).subscribe(
      (res) => {
        this.allCategories = Array.isArray(res) ? res : (res.data || res.categories || []);
        this.noMainCategory = this.allCategories.length === 0;
        this.currentPage = 1;
        this.applyFilter();
      },
      (error) => {
        this.noMainCategory = true;
        console.error('Error fetching categories', error);
      }
    );
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term
      ? this.allCategories.filter(
          (c) =>
            c.categoryName?.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
        )
      : this.allCategories;
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    this.mainCategories = filtered.slice(start, start + this.pageSize);
    this.noMainCategory = filtered.length === 0;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilter();
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
        this.allCategories = this.allCategories.filter(
          (category) => category.categoryId !== categoryId
        );
        this.applyFilter();
        this.toastr.success('Main category and its subcategories successfully deleted');
      },
      (error) => {
        console.error('Error deleting category', error);
        this.toastr.error('Failed to delete the category.');
      }
    );
  }
}
