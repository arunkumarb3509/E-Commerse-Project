import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor() {}

  canActivate() {
    if (localStorage.getItem('jwt') != null) {
      return true;
    } else {
      window.location.href = '';
      return false;
    }
  }
  
  canActivateChild() {
    return this.canActivate();
  }
}
