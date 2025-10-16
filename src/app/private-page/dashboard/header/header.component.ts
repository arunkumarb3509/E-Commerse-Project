import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/Services/cart.service';
import { CustomerService } from 'src/Services/customer.service';
import { ProductService } from 'src/Services/product.service';
import { UserLoginService } from 'src/Services/user-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
loggedInUserDetails: any[] = [];
loggedInUserType: any;

  constructor( 
    private router: Router,
    private userLoginService: UserLoginService,
    private toastr: ToastrService,
    public customerService:CustomerService,
  ) { }

  ngOnInit(): void {
     const userType = localStorage.getItem('UserType');
     this.loggedInUserType = userType;
     this.loggedInUser();
  }

  //  loggedInUser(): void {
      
  //     const userId = localStorage.getItem('userId');
  //     const parsedUserId = Number(userId);

  //     if (parsedUserId) {
  //       // Call the service to fetch the user details
  //       this.customerService.userLoggedInDetails(parsedUserId).subscribe(
  //         (response) => {
  //           if (response) {
  //             this.loggedInUserDetails = response;
  //           } else {
  //             // Display an error message if the user details was unsuccessful
  //             this.toastr.error('Error fetching the user details');
  //           }
  //         },
  //         (error) => {
  //           // Handle server error
  //           console.error('Error fetching the user details:', error);
  //           this.toastr.error('Server error. Please try again later.');
  //         }
  //       );
  //     } else {
  //       this.toastr.error('user ID is missing');
  //     }
   
  // }
  loggedInUser(): void {
  const userId = localStorage.getItem('userId');
  const parsedUserId = Number(userId);

  if (parsedUserId) {
    this.customerService.userLoggedInDetails(parsedUserId).subscribe(
      (response) => {
        if (response?.loggedUserDetails) {
          // ✅ Wrap the object in an array to match *ngFor usage in HTML
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


  toggleSidebar() {
    if (this.userLoginService.getSideBarStatus() == true) {
      this.userLoginService.setSideBarStatus(false);
    } else {
      this.userLoginService.setSideBarStatus(true);
    }
  }



  clearUser(){
    localStorage.clear();
     window.location.href = '/customer-signIn';
  }

  

}
