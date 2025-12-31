import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/Services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  main_category: any[] = [];
  menCategories: any[] = [];
  womenCategories: any[] = [];
  kidsCategories: any[] = [];
  
  selectedCategoryData: any[] = [];
  selectedCategoryName: string = '';
  showDropdown: boolean = false;

  constructor(public categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        this.main_category = categories;
        // alert("main_category 1"+JSON.stringify(this.main_category));
        this.loadSubCategories();
      },
      (error) => {
        console.error('Error fetching main categories', error);
      }
    );
  }

  loadSubCategories(): void {
    const requests = this.main_category.map(category =>
      this.categoryService.getMainCategoryByIdForProduct(category.categoryId)
    );

    // alert("main_category 2"+requests+JSON.stringify(this.main_category));
    forkJoin(requests).subscribe(
      (responses) => {
        responses.forEach((res, i) => {
          this.main_category[i].subCategories = res.subCategories || [];
        });

        const men = ["Men's Clothing", "Men's Footwear", "Men's Activewear"];
        const women = ["Women's Clothing", "Women's Footwear", "Women's Activewear"];
        const kids = ["Boys' Footwear", "Girls' Footwear", "Newborn Clothing", "Infant Clothing", "Toddler Clothing", "Children's Footwear"];

        this.menCategories = this.main_category.filter(cat => men.includes(cat.categoryName));
        this.womenCategories = this.main_category.filter(cat => women.includes(cat.categoryName));
        this.kidsCategories = this.main_category.filter(cat => kids.includes(cat.categoryName));
      },
      (error) => console.error('Error loading subcategories', error)
    );
  }

 
  showCategory(type: string): void {
    if (type === 'men') {
      this.selectedCategoryData = this.menCategories;
      this.selectedCategoryName = 'MEN';
    } else if (type === 'women') {
      this.selectedCategoryData = this.womenCategories;
      this.selectedCategoryName = 'WOMEN';
    } else if (type === 'kids') {
      this.selectedCategoryData = this.kidsCategories;
      this.selectedCategoryName = 'KIDS';
    }
  
    this.showDropdown = true; // ✅ Automatically show dropdown
  }
  

  toggleDropdown(event: Event): void {
    event.preventDefault();
    this.showDropdown = !this.showDropdown;
  }
}
