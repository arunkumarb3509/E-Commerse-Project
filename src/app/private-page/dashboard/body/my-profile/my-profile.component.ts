// import { Component, OnInit } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { CustomerService } from 'src/Services/customer.service';



// @Component({
//   selector: 'app-my-profile',
//   templateUrl: './my-profile.component.html',
//   styleUrls: ['./my-profile.component.scss']
// })
// export class MyProfileComponent implements OnInit {
// loggedInUserDetails: any[] = [];
//    constructor(
//     public customerService:CustomerService,
//    private toastr: ToastrService
//    ) { }

//   ngOnInit(): void {
//    this.loggedInUser();
//   }
  
//    loggedInUser(): void {
//   const userId = localStorage.getItem('userId');
//   const parsedUserId = Number(userId);

//   if (parsedUserId) {
//     this.customerService.userLoggedInDetails(parsedUserId).subscribe(
//       (response) => {
//         if (response?.loggedUserDetails) {
//           // ✅ Wrap the object in an array to match *ngFor usage in HTML
//           this.loggedInUserDetails = [response.loggedUserDetails];
//         } else {
//           this.toastr.error('Error fetching the user details');
//         }
//       },
//       (error) => {
//         console.error('Error fetching the user details:', error);
//         this.toastr.error('Server error. Please try again later.');
//       }
//     );
//   } else {
//     this.toastr.error('user ID is missing');
//   }
// }

//   onEditProfile() {
//     alert('Edit Profile Clicked');
//     // Navigate or open modal for editing profile
//   }


// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/Services/customer.service';
import { UserLoginService } from 'src/Services/user-login.service';

declare var bootstrap: any;

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  loggedInUserDetails: any[] = [];
  editProfileForm!: FormGroup;

  constructor(
    public customerService: CustomerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public userLoginService: UserLoginService
  ) {}

  ngOnInit(): void {

   this.editProfileForm = this.fb.group({

  firstName: ['', Validators.required],

  lastName: ['', Validators.required],

  email: [''],

  phone: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ]
  ],

  customerType: [''],

  address: ['', Validators.required],

  city: ['', Validators.required],

  state: ['', Validators.required],

  zipCode: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{6}$')
    ]
  ]

});

    this.loggedInUser();
  }

  loggedInUser(): void {

    const userId = localStorage.getItem('userId');
    const parsedUserId = Number(userId);

    if (parsedUserId) {
      this.customerService.userLoggedInDetails(parsedUserId).subscribe(

        (response) => {

          if (response?.loggedUserDetails) {

            this.loggedInUserDetails = [response.loggedUserDetails];

          } else {
            this.toastr.error('Error fetching the user details');
          }
        },

        (error) => {
          console.error('Error fetching the user details:', error);
          this.toastr.error('Server error. Please try again later.');
        }
      );

    } else {
      this.toastr.error('user ID is missing');
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {

  const charCode = event.which
    ? event.which
    : event.keyCode;

  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }

}

  onEditProfile(userData: any) {

    this.editProfileForm.patchValue({

      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      customerType: userData.customerType,

      address: userData.UserAddress?.[0]?.address || '',
      city: userData.UserAddress?.[0]?.city || '',
      state: userData.UserAddress?.[0]?.state || '',
      zipCode: userData.UserAddress?.[0]?.zipCode || ''

    });

    const modal = new bootstrap.Modal(
      document.getElementById('editProfileModal')
    );

    modal.show();
  }

  updateProfile() {

    if (this.editProfileForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }
     const userID = localStorage.getItem('userId');
     const parsedUserId = Number(userID);
    const payload = this.editProfileForm.value;

    console.log(payload);
      this.userLoginService.updateSellerDetails(
    parsedUserId,
    payload
  ).subscribe(

    (response: any) => {

      if (response?.loggedUserDetails) {

        this.loggedInUserDetails = [
          response.loggedUserDetails
        ];

        this.toastr.success(
          'Profile Updated Successfully'
        );

        const modalElement =
          document.getElementById('editProfileModal');

        const modal =
          bootstrap.Modal.getInstance(modalElement);

        modal.hide();

      } else {

        this.toastr.error(
          'Error updating the user details'
        );

      }
    },

    (error) => {

      console.error(
        'Error updating the user details:',
        error
      );

      this.toastr.error(
        'Server error. Please try again later.'
      );

    }
  );

    } 

    // SERVICE CALL
    // this.customerService.updateProfile(payload).subscribe()

    // this.toastr.success('Profile Updated Successfully');
  }

