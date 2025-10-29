import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Main_Category, Sub_Category } from 'src/Model/category';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private environment = environment;
  // private subCategoriesUrl = 'http://localhost:5000/api/subCategories';
  private mainCategoriesUrl = 'http://localhost:5000/api/mainCategories';
  // private getMainCategoriesUrl = 'http://localhost:5000/api/getMainCategories';
  // private getMainCategoryByIdUrl = 'http://localhost:5000/api/getMainCategoryById/';
  // private getSubCategoryByIdUrl = 'http://localhost:5000/api/getSubCategoryById/';
  // private getSubCategoriesUrl = 'http://localhost:5000/api/getSubcategories';
  // private getCategoryTypeUrl = 'http://localhost:5000/api/getCategoryTypes';


//  Behaviour Subject
  subCategoryId = new BehaviorSubject(0);
  mainCategoryId = new BehaviorSubject(0);
  subCategoryList = new BehaviorSubject(false);
  mainCategoryList = new BehaviorSubject(false);

 
  constructor(private http: HttpClient) { }

  // Helper function to get JWT token from local storage (or any other source)
  private getToken(): string {
    return localStorage.getItem('jwt') || ''; // Assuming token is stored in localStorage
  }

  // Set the HTTP headers with the token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json'
    });
  }

  getSubCategoryById(categoryId: number): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(this.environment.CATEGORY.GET_SUB_CATEGORY_BY_ID + categoryId);
  }


  addMainCategory(mainCategory: Main_Category): Observable<any> {
    const headers = this.getHeaders();  // Headers include the token
    const userId = localStorage.getItem('userId');  // Get userId from localStorage
    return this.http.post<any>(this.mainCategoriesUrl, {
      MainCategoryName: mainCategory.MainCategoryName,
      Main_Description: mainCategory.Main_Description,
      userId:mainCategory.userId || userId  // Send userId as part of the request body
    }, { headers });
  }

  // getMainCategories(): Observable<any> {
  //   // const headers = this.getHeaders();
  //   return this.http.get<any>(this.environment.CATEGORY.GET_MAIN_CATEGORIES);
  // }
  getMainCategories(offset: number = 0, limit: number = 10): Observable<any> {
  return this.http.get<any>(
    `${this.environment.CATEGORY.GET_MAIN_CATEGORIES}?offset=${offset}&limit=${limit}`
  );
  }


  getMainCategoryById(categoryId: number): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(this.environment.CATEGORY.GET_MAIN_CATEGORY_BY_ID + categoryId);
  }

   getMainCategoryByIdForProduct(categoryId: string): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(this.environment.CATEGORY.GET_MAIN_CATEGORY_BY_ID + categoryId);
  }

  getSubCategories(): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(this.environment.CATEGORY.GET_SUB_CATEGORIES);
  }


  addSubCategory(formData: FormData): Observable<any> {
    // const headers = this.getHeaders();  // Headers include the token
    // Get userId from localStorage and handle the case where userId may be null
    const userId = localStorage.getItem('userId') || '';  // Provide a fallback value
    formData.append('userId', userId);
    return this.http.post<any>(this.environment.CATEGORY.CREATE_SUB_CATEGORY, formData);
  }
  
  updateMainCategory(categoryId: number, updatedData: any): Observable<any> {
    // const headers = this.getHeaders();
    // const url = `http://localhost:5000/api/updateMainCategory/${categoryId}`;
    // return this.http.put<any>(url, updatedData);
      return this.http.put<any>(this.environment.CATEGORY.UPDATE_MAIN_CATEGORY + categoryId , updatedData);

  }

  updateSubCategory(categoryId: number, updatedData: any): Observable<any> {
    // const headers = this.getHeaders();
    // const url = `http://localhost:5000/api/updateSubCategory/${categoryId}`;
    // return this.http.put<any>(url, updatedData, { headers });
     return this.http.put<any>(this.environment.CATEGORY.UPDATE_SUB_CATEGORY + categoryId , updatedData);
  }

  // bending process
  deleteMainCategory(categoryId: number): Observable<any> {
    // const headers = this.getHeaders();
    const url = `http://localhost:5000/api/deleteMainCategory/${categoryId}`;
    return this.http.delete<any>(url);
  }

  getCategoryType(): Observable<any> {
    // const headers = this.getHeaders();
    return this.http.get<any>(this.environment.CATEGORY.GET_CATEGORY_TYPES);
  }
}
