import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/Services/customer.service';



@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
loggedInUserDetails: any[] = [];
   constructor(
    public customerService:CustomerService,
   private toastr: ToastrService
   ) { }

  ngOnInit(): void {
   this.loggedInUser();
  }
  
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

  onEditProfile() {
    alert('Edit Profile Clicked');
    // Navigate or open modal for editing profile
  }


}
