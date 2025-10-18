import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-view-maincategory',
  templateUrl: './view-maincategory.component.html',
  styleUrls: ['./view-maincategory.component.scss']
})
export class ViewMaincategoryComponent implements OnInit {
  editMainCategoryForm!: FormGroup;
  selectedCategory: any;
  id:number=0;
  userId:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSelectedCategory();
  }

  initializeForm(): void {
    this.editMainCategoryForm = this.fb.group({
      MainCategoryName: ['', Validators.required],
      mainDescription: ['', Validators.required],
    });
    const getuserId = localStorage.getItem('userId');
    this.userId = getuserId;
  }

  loadSelectedCategory(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');

    this.categoryService.mainCategoryId.subscribe({
      next: (category) => {
         this.id=category;
         }
       });

      this.categoryService.getMainCategoryById(this.id).subscribe(
        (category) => {
          this.selectedCategory = category;
          this.editMainCategoryForm.patchValue({
            MainCategoryName: category.categoryName,
            mainDescription: category.description,
          });
        },
        (error) => {
          console.error('Error fetching category', error);
        }
      );
    
  }

  onSubmit(): void {

    if (this.editMainCategoryForm.valid) {
      const categoryId = this.route.snapshot.paramMap.get('id');

  
      if (this.id) {
        const updatedData = {
          userId: this.userId,
          categoryName: this.editMainCategoryForm.value.MainCategoryName,
          description: this.editMainCategoryForm.value.mainDescription,
        };
  
        // Call the service to update the category
        this.categoryService.updateMainCategory(this.id, updatedData).subscribe(
          (response) => {

          if (response.updatedCategory) {
            this.editMainCategoryForm.reset();
            this.router.navigate(['/fashionflair/dashboard/main-categories']);
            this.toastr.success(
              'Main category Update successfully',
            );
            // this.loadMainCategories();
          } else {
            this.toastr.error('Error creating Main category');
          }
      },
      (error) => {
        console.error('Error creating Main category', error);
        this.toastr.error('Server error. Please try again later.');
      }
        );
      }
    }
  }
  

  cancel(): void {
    this.router.navigate(['/fashionflair/dashboard']);
  }
}
