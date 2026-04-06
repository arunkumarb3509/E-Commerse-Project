import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-sub-category-grid',
  templateUrl: './sub-category-grid.component.html',
  styleUrls: ['./sub-category-grid.component.scss'],
})
export class SubCategoryGridComponent implements OnInit {
  allSubCategories: any[] = [];
  subCategories: any[] = [];
  errorMessage: string | null = null;
  categoryTypes: any[] = [];

  searchTerm: string = '';
  pageSize: number = 7;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private router: Router,
    public categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.subCategoryList.subscribe({
      next: (status) => {
        if (status) {
          this.loadSubCategories();
          this.categoryService.subCategoryList.next(false);
        }
      },
    });
    this.loadSubCategories();
    this.loadCategoryTypes();
  }

  loadCategoryTypes(): void {
    this.categoryService.getCategoryType().subscribe(
      (categories) => { this.categoryTypes = categories; },
      (error) => { console.error('Error fetching category types', error); }
    );
  }

  loadSubCategories(): void {
    this.categoryService.getSubCategories().subscribe(
      (response) => {
        if (response.noSubCategory) {
          this.errorMessage = response.message;
          this.allSubCategories = [];
        } else {
          this.allSubCategories = response;
          this.errorMessage = null;
        }
        this.currentPage = 1;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching categories', error);
        this.errorMessage = 'No subcategories found';
        this.allSubCategories = [];
        this.applyFilter();
      }
    );
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term
      ? this.allSubCategories.filter(
          (c) =>
            c.subCategoryName?.toLowerCase().includes(term) ||
            c.mainCategoryName?.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
        )
      : this.allSubCategories;
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    this.subCategories = filtered.slice(start, start + this.pageSize);
    if (filtered.length === 0 && !this.errorMessage) {
      this.errorMessage = term ? 'No matching records found' : 'No subcategories found';
    } else if (filtered.length > 0) {
      this.errorMessage = null;
    }
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

  getCategoryTypeName(categoryTypeId: number): string {
    const categoryType = this.categoryTypes.find((ct) => ct.id === categoryTypeId);
    return categoryType ? categoryType.typeName : 'Unknown';
  }

  navigateToViewCategory(categoryId: number) {
    this.categoryService.subCategoryId.next(categoryId);
    this.router.navigate(['/fashionflair/dashboard/view-subcategory']);
  }
}
