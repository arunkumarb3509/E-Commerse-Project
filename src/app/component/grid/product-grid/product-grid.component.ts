import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
})
export class ProductGridComponent implements OnInit {
  mainCategoryForm!: FormGroup;
  selectedCategory: any;
  allProductDetails: any[] = [];
  getAllProductDetails: any[] = [];
  showConfirmDialog = false;
  noProductData = false;
  categoryToDelete: number | null = null;

  searchTerm: string = '';
  pageSize: number = 20;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private router: Router,
    public productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllProductDetails();
  }

  loadAllProductDetails(): void {
    this.productService.getAllProductDetails().subscribe(
      (response) => {
        if (response.noProductData) {
          this.noProductData = true;
          this.allProductDetails = [];
        } else {
          this.noProductData = false;
          this.allProductDetails = response;
        }
        this.currentPage = 1;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term
      ? this.allProductDetails.filter(
          (p) =>
            p.productCode?.toLowerCase().includes(term) ||
            p.productName?.toLowerCase().includes(term) ||
            p.brand?.toLowerCase().includes(term)
        )
      : this.allProductDetails;
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    this.getAllProductDetails = filtered.slice(start, start + this.pageSize);
    this.noProductData = filtered.length === 0;
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

  navigateToEditProducts(productId: any) {
    this.productService.productId.next(productId);
    this.router.navigate(['/fashionflair/dashboard/products/edit-products']);
  }

  navigateToViewProductDetails(productId: any) {
    this.productService.productId.next(productId);
    this.router.navigate(['/fashionflair/dashboard/products/view/products-details']);
  }
}
