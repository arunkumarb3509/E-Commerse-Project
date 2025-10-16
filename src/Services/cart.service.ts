import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})

export class CartService {
  private environment = environment;
  // private addToCartsUrl = 'http://localhost:5000/api/addToCart';
  // private getCartItemByCustomerUrl = 'http://localhost:5000/api/cart/';
  // private removeItemFromCartUrl = 'http://localhost:5000/api/removeItemFromCart/';
  // private savedItemForLaterUrl= 'http://localhost:5000/api/cart/saveForLater';
  // private getCustomerSavedItemsUrl='http://localhost:5000/api/saved-items/';
  // private moveItemToCartUrl='http://localhost:5000/api/cart/moveToCart';
  // private removeSavedItemFromCartUrl='http://localhost:5000/api/removeSavedItemFromCart/';
  productId = new BehaviorSubject(0);
  
   private cartCountSource = new BehaviorSubject<number>(0);
   cartCount$ = this.cartCountSource.asObservable();
   private cartItems: any[] = []; // Store cart items as objects

  constructor(private http: HttpClient) {}

  //  private getToken(): string {
  //     return localStorage.getItem('jwt') || ''; // Assuming token is stored in localStorage
  //   }
  
    // Set the HTTP headers with the token
    // private getHeaders(): HttpHeaders {
    //   const token = this.getToken();
    //   return new HttpHeaders({
    //     'Authorization': `Bearer ${token}`,
    //     // 'Content-Type': 'application/json'
    //   });
    // }

    addToCart(productId: number, guestUserId: string): Observable<any> {
      // const headers = this.getHeaders();
      return this.http.post<any>(this.environment.ADDTOCART.CREATE_ADD_TO_CART, { productId, guestUserId });
    }

    getCartItemsByCustomer(guestUserId: string): Observable<any> {
      // const headers = this.getHeaders(); // Retrieve headers if needed
      return this.http.get<any>(`${this.environment.ADDTOCART.GET_CART_ITEM_BY_CUSTOMER}${guestUserId}`);
    }

  updateCartCount() {
    const newCount = this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    this.cartCountSource.next(newCount); // Update BehaviorSubject value
  }

  removeItemFromCart(productId: number) {
    // this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.updateCartCount();
    // const headers = this.getHeaders();
    return this.http.delete<any>(`${this.environment.ADDTOCART.DELETE_ITEM_FROM_CART}${productId}`);
  }

  saveItemForLater(productId: number, guestUserId: string) {
    // const headers = this.getHeaders();
    return this.http.post<any>(this.environment.ADDTOCART.CREATE_SAVE_FOR_LATER, { productId, guestUserId });
  }
  
  moveItemToCart(productId: number, guestUserId: string) {
    // const headers = this.getHeaders();
    return this.http.post<any>(this.environment.ADDTOCART.CREATE_MOVE_TO_CART, { productId, guestUserId },);
  }

  getSavedItemsByCustomer(guestUserId: string): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(`${this.environment.ADDTOCART.GET_CUSTOMER_SAVED_ITEMS}${guestUserId}`);
  }
  
  
  
  removeSavedItemFromCart(productId: number) {
    // this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.updateCartCount();
    // const headers = this.getHeaders();
    return this.http.delete<any>(`${this.environment.ADDTOCART.DELETE_CART_FROM_SAVED_ITEM}${productId}`);
  }

  updateCartCountFromServer(guestUserId: string): void {
    this.getCartItemsByCustomer(guestUserId).subscribe(
      (response) => {
        if (response && response.cartItems) {
          const uniqueProductIds = new Set(response.cartItems.map((item: any) => item.productId));
          this.cartCountSource.next(uniqueProductIds.size);
        } else {
          this.cartCountSource.next(0);
        }
      },
      (error) => {
        console.error('Failed to fetch cart count:', error);
        this.cartCountSource.next(0);
      }
    );
  }
}

