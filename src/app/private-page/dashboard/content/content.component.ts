import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  userType: string | null = null;

  constructor() { }

  ngOnInit(): void {

      const loggedInUserType = localStorage.getItem('UserType');

      if (loggedInUserType) {
      this.userType = loggedInUserType; 

       // Navigate to viewCart if userType is customer
      //  if (this.userType === 'customer') {
      //   // this.router.navigate(['/viewCart']);
      // }
    } else {
      this.userType = null;
    }
  }

}
