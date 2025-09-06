import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Products } from 'src/Model/product';
import { ProductOffers } from 'src/Model/product_offers';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private environment = environment;
  // private productsUrl = 'http://localhost:5000/api/product';
  // private getAllProductDetailsUrl = 'http://localhost:5000/api/getAllProductDetails';
  // private getProductByIdUrl = 'http://localhost:5000/api/getProductById/';
  // private updateProductUrl='http://localhost:5000/api/updateProductById';
  // private uploadProductImageUrl='http://localhost:5000/api/uploadProductImage';
  // private getProductImageByIdUrl = 'http://localhost:5000/api/getProductImageById';
  // private getProductsByCategoryTypeIdUrl = 'http://localhost:5000/api/products/categoryType/';
  // private createProductOfferUrl='http://localhost:5000/api/products/addOffers';
  // private getProductOfferByIdUrl = 'http://localhost:5000/api/products/getProductOffers/';
  // private getProductByProductCodeUrl='http://localhost:5000/api/productDetails/';
  // private getAllProductOfferUrl = 'http://localhost:5000/api/products/getAllProductOffers';
  // private getAllProductByCustomerIdUrl = 'http://localhost:5000/api/products/getProductByCustomer';
  // private submitOrderUrl='http://localhost:5000/api/submitCustomerOrder';


  productId = new BehaviorSubject(0);
  categoryTypeId = new BehaviorSubject(0);

  constructor(private http: HttpClient) { }

  // Function to set headers, such as authentication tokens
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Assuming token is stored in localStorage
    return new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Replace with the appropriate authorization scheme
    });
  }

  // Method to add a product
  addProduct(product: Products): Observable<any> {
    // const headers = this.getHeaders();
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    // Create the product payload
    const payload = {
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      categoryTypeId: product.categoryTypeId,
      materialType: product.materialType,
      returnPolicy:product.returnPolicy,
      careInstructions: product.careInstructions,
      productCode: product.productCode,
      productName: product.productName,
      brand: product.brand,
      price: product.price,
      totalStock: product.totalStock,
      reducedPrice: product.reducedPrice,
      availability: product.availability,
      productDescription: product.productDescription,
      Weight: product.Weight,
      Dimension: product.Dimension,
      ShippingClass: product.ShippingClass,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      keywords: product.keywords,
      selectedSizes: product.selectedSizes,
      sizeStockMapping: product.sizeStockMapping,
      userId // Include userId in the payload
    };
    // POST request to the server to add the product
    // return this.http.post<any>(this.productsUrl, payload, { headers });
     return this.http.post<any>(this.environment.PRODUCT.CREATE_PRODUCT, payload);

  }

  getAllProductDetails(): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(this.getAllProductDetailsUrl, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_ALL_PRODUCT_DETAILS);

  }

  getProductById(productId: number): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getProductByIdUrl}${productId}`, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_PRODUCT_BY_ID + productId);

  }

  getProductByProductCode(productCode: string): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getProductByProductCodeUrl}${productCode}`, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_PRODUCT_BY_CODE + productCode);

  }

   getAllProductByCustomerId(parsedCustomerId: number): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getAllProductByCustomerIdUrl}/${parsedCustomerId}`, { headers });
    return this.http.get<any>(this.environment.CUSTOMER_DATA.GET_ALL_PRODUCT_BY_CUSTOMER_ID + parsedCustomerId);
  }

    updateProduct(productId: number, updatedData: any): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.put<any>(`${this.updateProductUrl}/${productId}`, updatedData,{ headers });
    return this.http.put<any>(this.environment.PRODUCT.UPDATE_PRODUCT_BY_ID + productId, updatedData);

  }


  uploadProductImage(productId: number, formData: FormData): Observable<any> {
    const headers = this.getHeaders();  // Headers include the token
  
   // Retrieve userId from localStorage and handle the case where userId may be null
    const userId = localStorage.getItem('userId') || '';  // Provide a fallback value
    
    // Append the productId and userId to the FormData
    formData.append('productId', productId.toString());
    formData.append('userId', userId);
    
    // Make the POST request with the FormData containing productId, userId, and file data
    // return this.http.post<any>(this.uploadProductImageUrl, formData, { headers });
    return this.http.post<any>(this.environment.PRODUCT.CREATE_PRODUCT_IMAGE, formData);
  }
  
  getProductImageById(productId: number): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getProductImageByIdUrl}/${productId}`, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_PRODUCT_IMAGE_BY_ID + productId);

  }

  getProductsByCategoryTypeId(categoryTypeId: number): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getProductsByCategoryTypeIdUrl}${categoryTypeId}`, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_PRODUCT_BY_CATEGORY_TYPE_ID + categoryTypeId);

  }

  createProductOffer(productOffers: ProductOffers): Observable<any> {
    // const headers = this.getHeaders();
    const userId = localStorage.getItem('userId');
    productOffers.created_by = userId || "DefaultUser"; // Ensure created_by is set
    productOffers.modified_by = userId || "DefaultUser";
  
    // return this.http.post<any>(this.createProductOfferUrl, productOffers, { headers });
    return this.http.post<any>(this.environment.PRODUCT.CREATE_PRODUCT_OFFER, productOffers);

  }

  getProductOfferById(productId: number): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(`${this.getProductOfferByIdUrl}${productId}`, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_PRODUCT_OFFER_BY_ID + productId);

  }

  getAllProductOffer(): Observable<any> {
    // const headers = this.getHeaders();
    // return this.http.get<any>(this.getAllProductOfferUrl, { headers });
    return this.http.get<any>(this.environment.PRODUCT.GET_ALL_PRODUCT_OFFER);

  }
  
 submitOrder(orderDetails: any): Observable<any> {
  // alert(JSON.stringify(orderDetails))
    // const headers = this.getHeaders();
    // POST request to the server to add the product
    return this.http.post<any>(this.environment.CUSTOMER_DATA.CREATE_CUSTOMER_ORDER, orderDetails);
  }
  
}
