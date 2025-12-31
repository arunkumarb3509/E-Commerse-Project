import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/Services/category.service';

@Component({
  selector: 'app-view-subcategory',
  templateUrl: './view-subcategory.component.html',
  styleUrls: ['./view-subcategory.component.scss']
})
export class ViewSubcategoryComponent implements OnInit {
  mainCategories: any[] = [];
  editSubCategoryForm!: FormGroup;
  selectedFile: File | undefined;
  formData = new FormData();
  selectedCategory: any;
  categoryTypes: any[] = [];
  id:number=0;

  constructor(private fb: FormBuilder, private router: Router, public categoryService: CategoryService,private toastr:ToastrService,  private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSubCategories();
    this.loadCategoryTypes();
    this.loadMainCategories();
  }

  initializeForm(): void {
    this.editSubCategoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      subcategoryName: ['', Validators.required],
      description: [''],
      categoryType: ['', Validators.required]
    });
  }

  loadMainCategories(): void {
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        console.log(categories);
        this.mainCategories=categories;
        
      },
      (error) => {
        console.error('Error fetching categories', error);
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
  
  loadSubCategories(): void {
    // Retrieve the category ID from the route parameters
    const categoryId = this.route.snapshot.paramMap.get('id');
   
   // Confirm categoryId is being captured correctly
    this.categoryService.subCategoryId.subscribe({
     next: (category) => {
        this.id=category;
        }
      });

    
      this.categoryService.getSubCategoryById(this.id).subscribe(
        (category) => {
          this.selectedCategory = category;
  // alert("catuu"+JSON.stringify(this.selectedCategory))
          this.editSubCategoryForm.patchValue({
            // categoryName: category.categoryId.categoryName,
            // categoryName:category.categoryId?._id || category.categoryId,
            categoryName: category.categoryId?.categoryName || category.categoryId?._id,

            subcategoryName: category.subCategoryName,
            description: category.description,
            categoryType: category.categoryType,
            // categoryId: category.categoryId,
            // subcategoryName: category.subCategoryName,
            // description: category.description,
            // categoryType: category.categoryTypeId
          });
        });
    
        // Fetch main categories list for the dropdown
        this.categoryService.getMainCategories().subscribe((categories) => {
          this.mainCategories = categories;
        },
      
      );
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editSubCategoryForm.patchValue({
        image: file 
      });
    }
  }

  
  onSubmit(): void {
    if (this.editSubCategoryForm.valid) {
      console.log("Form is valid. ID: " + this.id);
  
     
        // Convert the categoryName to integer
        // const categoryName = parseInt(this.editSubCategoryForm.value.categoryName, 10);
  
        // const updatedData = {
        //   categoryId: this.editSubCategoryForm.value.categoryId,
        //   categoryName: this.editSubCategoryForm.value.categoryName,
        //   subcategoryName: this.editSubCategoryForm.value.subcategoryName,
        //   description: this.editSubCategoryForm.value.description,
        //   mainCategoryId: this.editSubCategoryForm.value._id,
        //   categoryType: this.editSubCategoryForm.value.categoryType,
        //   image: this.editSubCategoryForm.value.image,
         
        // };
        const formValue = this.editSubCategoryForm.value;

        const updatedData = {
          categoryId: {
            _id: formValue.categoryName   // 🔥 MAIN CATEGORY ID
          },
          subCategoryName: formValue.subcategoryName,
          description: formValue.description,
          categoryType: formValue.categoryType,
          image: formValue.image
        };
    console.log("new up"+ JSON.stringify(updatedData));
  
        // Call the service to update the subcategory command this.id
        this.categoryService.updateSubCategory(this.selectedCategory._id, updatedData).subscribe(
          (response) => {
            if (response.updatedSubCategory) {
              this.editSubCategoryForm.reset();
              this.router.navigate(['/fashionflair/dashboard/sub-categories']);
              this.toastr.success('Subcategory updated successfully');
             

            } else {
              this.toastr.error('Error updating subcategory');
            }
          },
          (error) => {
            console.error('Error updating subcategory', error);
            this.toastr.error('Server error. Please try again later.');
          }
        );
    
    }
  }
  
}
