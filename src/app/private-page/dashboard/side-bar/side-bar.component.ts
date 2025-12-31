import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/Services/user-login.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  routerName = 'dashboard';
  isSidebarActive = false;
  userType: string | null = null;
activeDropdown: string | null = null;

  constructor(
    private router: Router,
    private userLoginService: UserLoginService,
  ) {}
// activeDropdown: string | null = null;

//   toggleDropdown(menu: string): void {
//     this.activeDropdown = this.activeDropdown === menu ? null : menu;
//   }
  ngOnInit(): void {
    // Check initial window size and close sidebar if below 768px
    this.checkWindowSize();
    const loggedInUserType = localStorage.getItem('UserType');
    
    if (loggedInUserType) {
      this.userType = loggedInUserType; 

       // Navigate to viewCart if userType is customer
       if (this.userType === 'customer') {
        // this.router.navigate(['/viewCart']);
      }
    } else {
      this.userType = null;
    }
}

  ngDoCheck() {
    this.isSidebarActive = this.userLoginService.getSideBarStatus();
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
      this.isSidebarActive = false;
    }
  }
 // ⭐ Friend logic — dropdown open/close function
  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  } 

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  // Helper method to check window size
  private checkWindowSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarActive = false;
    }
  }

  // New method to close the sidebar when an item is clicked
  onSidebarItemClick() {
    this.closeSidebarOnMobile();
  }
}
