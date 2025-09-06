import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  sidebar = false;
  constructor(private http: HttpClient) { }

  setSideBarStatus(status: boolean) {
    this.sidebar = status;
  }
  
  getSideBarStatus() {
    return this.sidebar;
  }

  isLoggedInCustomer():boolean{
    const loggedInUserType  = localStorage.getItem('UserType');  
  const jwtToken = localStorage.getItem('jwt');
  if (!loggedInUserType || !jwtToken) {
    return true; 
  }
  try {
    // const parsedData = loggedInUserType;
  
    if (loggedInUserType === "customer") {
      return true;  
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
  }
}
