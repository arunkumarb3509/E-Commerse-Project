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

    addToCart(productId: string, guestUserId: string): Observable<any> {
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

  removeItemFromCart(productId: string) {
    // this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.updateCartCount();
    // const headers = this.getHeaders();
    return this.http.delete<any>(`${this.environment.ADDTOCART.DELETE_ITEM_FROM_CART}${productId}`);
  }

  saveItemForLater(productId: string, guestUserId: string) {
    // const headers = this.getHeaders();
    return this.http.post<any>(this.environment.ADDTOCART.CREATE_SAVE_FOR_LATER, { productId, guestUserId });
  }
  
  moveItemToCart(productId: string, guestUserId: string) {
    // const headers = this.getHeaders();
    return this.http.post<any>(this.environment.ADDTOCART.CREATE_MOVE_TO_CART, { productId, guestUserId },);
  }

  getSavedItemsByCustomer(guestUserId: string): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(`${this.environment.ADDTOCART.GET_CUSTOMER_SAVED_ITEMS}${guestUserId}`);
  }
  
  
  
  removeSavedItemFromCart(productId: string) {
    alert("removeSavedItemFromCart called with productId: " + productId);
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



  // checkout page methods
   // create order session (locks prices, create razorpay order server-side)
  createSession(payload: any): Observable<any> {
    return this.http.post(`${this.environment.CHECKOUT.CREATE_SESSION}`, payload);
  }

  // verify payment (signature) and finalize order into final order document
  verifyPayment(payload: any): Observable<any> {
    return this.http.post(`${this.environment.CHECKOUT.VERIFY_PAYMENT}`, payload);
  }

  // finalize COD order (optional dedicated endpoint)
  finalizeCOD(payload: any): Observable<any> {
    return this.http.post(`${this.environment.CHECKOUT.FINALIZE_COD}`, payload);
  }
  private base =  'http://localhost:5000/api/';



  getCustomerOrders(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/customer/${customerId}`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.base}/${orderId}`);
  }

  updateStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.base}/${orderId}/status`, { status });
  }



}

