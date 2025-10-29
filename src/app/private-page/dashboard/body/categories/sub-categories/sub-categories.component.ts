import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {
  mainCategories: any[] = [];
  categoryTypes: any[] = [];
  subCategoryForm: FormGroup;
  selectedFile: File | undefined;
  formData = new FormData();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {
    this.subCategoryForm = this.fb.group({
      mainCategoryId: ['', Validators.required],
      subcategoryName: ['', Validators.required],
      categoryType: ['', Validators.required],
      description: [''],
      // image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMainCategories();
    this.loadCategoryTypes();
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        this.mainCategories = categories;
      },
      (error) => {
        console.error('Error fetching main categories', error);
      }
    );
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
      
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.formData.append('Image', this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }

    // Append form data
    this.formData.append('MainCategoryId', this.subCategoryForm.value.mainCategoryId);
    this.formData.append('SubCategoryName', this.subCategoryForm.value.subcategoryName);
    this.formData.append('CategoryTypeId', this.subCategoryForm.value.categoryType);
    this.formData.append('Sub_Description', this.subCategoryForm.value.description);

    this.categoryService.addSubCategory(this.formData).subscribe(
      (response) => {
        if (response.subCategory) {
          this.toastr.success('Subcategory successfully inserted');
          this.subCategoryForm.reset();
          this.categoryService.subCategoryList.next(true);
        } else {
          this.toastr.error('Error creating Subcategory');
        }
      },
      (error) => {
        console.error('Error creating subcategory', error);
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }
}
