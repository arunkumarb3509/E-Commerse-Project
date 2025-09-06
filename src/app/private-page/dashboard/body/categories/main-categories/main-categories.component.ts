import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Main_Category } from 'src/Model/category';
import { CategoryService } from 'src/Services/category.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-categories',
  templateUrl: './main-categories.component.html',
  styleUrls: ['./main-categories.component.scss']
})
export class MainCategoriesComponent implements OnInit {
  mainCategoryForm: FormGroup;
  main_category: Main_Category = new Main_Category();
  selectedCategory: any;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, public categoryService: CategoryService,private toastr:ToastrService) {
    this.mainCategoryForm = this.fb.group({
      MainCategoryName: ['', Validators.required],
      mainDescription: ['']
    });
  }

  ngOnInit(): void {
  }

  

  onSubmit(): void {
    if (this.mainCategoryForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Form Submission Error');
      return;
    }

    this.main_category.MainCategoryName = this.mainCategoryForm.value.MainCategoryName;
    this.main_category.Main_Description = this.mainCategoryForm.value.mainDescription;

    this.categoryService.addMainCategory(this.main_category).subscribe(
      response => {
        console.log(response);
        if (response.category) {
          this.loadMainCategories();
          this.mainCategoryForm.reset();
          this.toastr.success(
            'Main category successfully inserted',
          );
          this.categoryService.mainCategoryList.next(true);
          
        } else {
          this.toastr.error('Error creating business profile');
        }
    },
    (error) => {
      console.error('Error creating business profile', error);
      this.toastr.error('Server error. Please try again later.');
    }
    );
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        this.main_category = categories;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }
}
