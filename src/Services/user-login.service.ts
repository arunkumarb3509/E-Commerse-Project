import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  private environment = environment;
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

   updateSellerDetails(userId: number, payload: any): Observable<any> {
      console.log("for test seller update"+userId + payload);
      
      return this.http.put<any>(`${this.environment.SELLER_DATA.UPDATE_PROFILE}${userId}`, payload);
  
    }
}
