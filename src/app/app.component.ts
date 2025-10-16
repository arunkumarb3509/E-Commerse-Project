import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'e-commerse';
  userLogin = false;
  userLogout = true;
  constructor(private router:Router){

  };
  ngOnInit():void{
    this.guestUser();
    if (localStorage.getItem('jwt') != null){
      this.userLogout = false;
      this.userLogin = true;
      // this.router.navigate(['fashionflair/dashboard']);
      // navigate only if not already in private area
      if (!this.router.url.startsWith('/fashionflair')) {
        this.router.navigate(['/fashionflair/dashboard/welcome']);
      }
    }
    else{
      this.userLogout = true;
      this.userLogin = false;
    }
  }

  guestUser(): void {
   // Generate current date/time string
const now = new Date();
const components = [
  String(now.getDate()).padStart(2, '0'),       // Day
  String(now.getMonth() + 1).padStart(2, '0'),  // Month
  String(now.getFullYear()),                    // Year
  String(now.getHours()).padStart(2, '0'),      // Hours
  String(now.getMinutes()).padStart(2, '0'),    // Minutes
  String(now.getSeconds()).padStart(2, '0')     // Seconds
];

const rawString = components.join('');

// Simple base64 encoding as "encryption"
const encryptedString = btoa(rawString);

// Store in session storage under key 'guestuser'
sessionStorage.setItem('guestUserId', encryptedString);

  }

}
