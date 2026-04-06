import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate() {
    if (localStorage.getItem('jwt') != null) {
      return true;
    } else {
      this.router.navigate(['/customer-signIn']);
      return false;
    }
  }
  
  canActivateChild() {
    return this.canActivate();
  }
}
