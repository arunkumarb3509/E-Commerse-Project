import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Business_Profile } from 'src/Model/business_profile';
import { CustomerService } from 'src/Services/customer.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {

  businessProfileForm: FormGroup;
  business_profile: Business_Profile = new Business_Profile();


  constructor(private fb: FormBuilder, private router: Router, public customerService: CustomerService, private toastr:ToastrService) {
    this.businessProfileForm = this.fb.group({
      companyName: ['', Validators.required],
      companyOwnerName:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsappnumber:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      websiteUrl: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
      state:['', Validators.required],
      zipcode:['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
     
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.businessProfileForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Form Submission Error');
      return;
    }

    this.business_profile.companyName = this.businessProfileForm.value.companyName;
    this.business_profile.companyOwnerName = this.businessProfileForm.value.companyOwnerName;
    this.business_profile.email = this.businessProfileForm.value.email;
    this.business_profile.whatsappnumber = this.businessProfileForm.value.whatsappnumber;
    this.business_profile.websiteUrl = this.businessProfileForm.value.websiteUrl;
    this.business_profile.streetAddress = this.businessProfileForm.value.streetAddress;
    this.business_profile.city = this.businessProfileForm.value.city;
    this.business_profile.country = this.businessProfileForm.value.country;
    this.business_profile.state = this.businessProfileForm.value.state;
    this.business_profile.zipcode = this.businessProfileForm.value.zipcode;
    this.business_profile.phone = this.businessProfileForm.value.phone;
  

    this.customerService.businessProfile(this.business_profile).subscribe(
      response => {
        console.log(response);
    
          if (response.createdBusinesssProfile) {
            this.toastr.success(
              'Business profile created successfully',
              'Success',
            );
          } else {
            // Handle successful data fetch
            this.toastr.error('Error creating business profile', 'Error');
          }
      },
      (error) => {
        console.error('Error creating business profile', error);
        this.toastr.error('Server error. Please try again later.', 'Error');
      }
    );
 
  }
}
