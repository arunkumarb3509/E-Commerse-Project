import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/Services/category.service';
import { ProductService } from 'src/Services/product.service';

@Component({
  selector: 'app-below-carousel',
  templateUrl: './below-carousel.component.html',
  styleUrls: ['./below-carousel.component.scss']
})
export class BelowCarouselComponent implements OnInit {
  subCategories: any[] = [];
  CategoryType: any[] = [];
  errorMessage: string | null = null; 
  cauroselImageUrl="https://m.media-amazon.com/images/I/712naEHTSUL._SY741_.jpg";
  selectedCategoryId: number | null = null;

  constructor(private router: Router, public categoryService: CategoryService,public productService:ProductService) { }

  ngOnInit(): void {
    this.loadgetCategoryType()
  }

  loadgetCategoryType():void{
    this.categoryService.getCategoryType().subscribe(
      (response) => {// Assign the fetched data to the mainCategories array
        
        if (response.noCategoryType) {
          // Handle no subcategory case
          this.errorMessage = response.message;
          this.CategoryType = []; 
          // alert(this.subCategories)// Clear any existing data
        } else {
          // Handle successful data fetch
          this.CategoryType = response;
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


  getCategoryImage(categoryTypeId: any): string {
  
    switch (categoryTypeId) {
      case 200001: return 'https://m.media-amazon.com/images/I/51xbFaQC2aL._AC_UL320_.jpg';
      case 200002: return 'https://m.media-amazon.com/images/I/61OXWnxR8lL._AC_UL320_.jpg';
      case 200003: return 'https://m.media-amazon.com/images/I/61acPZK9kaL._AC_UL320_.jpg';
      case 200004: return 'https://m.media-amazon.com/images/I/81C6V7ED9OL._AC_UL320_.jpg';
      case 200005: return 'https://m.media-amazon.com/images/I/71J4tXOHvyL._AC_UL320_.jpg';
      case 200006: return 'https://m.media-amazon.com/images/I/610g3IuALAL._AC_UL320_.jpg';
      case 200007: return 'https://m.media-amazon.com/images/I/51Ggi1E-tBL._AC_UL320_.jpg';
      case 200008: return 'https://m.media-amazon.com/images/I/61bCWJ72zLL._AC_UL320_.jpg';
      case 200009: return 'https://m.media-amazon.com/images/I/719gx9U8AGL._AC_UL320_.jpg';
      case 200010: return 'https://m.media-amazon.com/images/I/61lfBFTRcxL._AC_UL320_.jpg';
      case 200011: return 'https://m.media-amazon.com/images/I/91zNI3UmZzL._AC_UL320_.jpg';
      default: return 'https://m.media-amazon.com/images/I/61jJBnppWtL._AC_UL320_.jpg'; // Fallback image
    }
  }
  

  onCategoryTypeClick(categoryTypeId: number): void {
    this.selectedCategoryId = categoryTypeId; // Pass selected ID to child
    // alert('Selected Category Type ID:'+ categoryTypeId);
  }



}
