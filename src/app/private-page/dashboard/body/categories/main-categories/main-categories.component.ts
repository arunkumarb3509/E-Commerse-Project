import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Main_Category } from 'src/Model/category';
import { CategoryService } from 'src/Services/category.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-main-categories',
  templateUrl: './main-categories.component.html',
  styleUrls: ['./main-categories.component.scss']
})
export class MainCategoriesComponent implements OnInit {
  mainCategoryForm: FormGroup;
  main_category: Main_Category = new Main_Category();
  selectedCategory: any;
  userId:any;

    //pagination
  // pageLimit = 50;
  // paginationData: any = { "info": "hide" };
  // offset_count = 0;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, public categoryService: CategoryService,private toastr:ToastrService,private spinner: NgxSpinnerService) {
    this.mainCategoryForm = this.fb.group({
      MainCategoryName: ['', Validators.required],
      mainDescription: ['']
    });
  }

  ngOnInit(): void {
    const getuserId = localStorage.getItem('userId');
    this.userId = getuserId;
  }
// refer pagination ts
//   getTransactionNewList(data: any) {
//   this.spinner.show();

//   // normalize the list data (offset, limit, etc.)
//   const list_data = this.listDataInfo(data);

//   // main request wrapper
//   let api_req: any = {};
//   let TNapi_req: any = {};

//   api_req.moduleType = "key";
//   api_req.api_url = "key/key_management_list";
//   api_req.api_type = "web";
//   api_req.access_token =
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cGRhdGVzLm1jb25uZWN0YXBwcy5jb20iLCJhdWQiOiJ1cGRhdGVzLm1jb25uZWN0YXBwcy5jb20iLCJpYXQiOjE2NTQ2NjQ0MzksIm5iZiI6MTY1NDY2NDQzOSwiZXhwIjoxNjU0NjgyNDM5LCJhY2Nlc3NfZGF0YSI6eyJ0b2tlbl9hY2Nlc3NJZCI6IjIiLCJ0b2tlbl9hY2Nlc3NOYW1lIjoidGVzdGluZzA0MDYyMDIyIiwidG9rZW5fYWNjZXNzVHlwZSI6IjIifX0.NaymQDSiON2R3tKICGNpj6hsQfg9DGwEcZzrJcvsqbI";

//   // element data (actual payload)
//   TNapi_req.action = "key/key_management_list";
//   TNapi_req.user_id = localStorage.getItem("erp_c4c_user_id");
//   TNapi_req.offset = list_data.offset;
//   TNapi_req.limit = list_data.limit;
//   // TNapi_req.search_txt = this.searchForm.value.licenceSearch || "";
//   // TNapi_req.remain_days = this.searchForm.value.remDaysSearch || "";
//   TNapi_req.search_txt = this.searchForm.value.licenceSearch?.trim() || null;
//   TNapi_req.remain_days = this.searchForm.value.remDaysSearch || null;


//   api_req.element_data = TNapi_req;

//   this.serverService.sendServer(api_req).subscribe(
//     (response: any) => {
//       this.spinner.hide();

//        if (response && response.data && response.data.length > 0) {
//         // ✅ bind data list
//         this.Transaction_list = response.data;
//         this.recordNotFound = false;
        

//        // ✅ update total records
//        this.countDetails = (response.total_cnt && response.total_cnt > 0)
//        ? response.total_cnt
//        : this.countDetails || 0;

//         // ✅ update pagination (make sure serverService.pagination uses offset+limit correctly)
//          this.paginationData = this.serverService.pagination({
//            offset: list_data.offset,
//            total: this.countDetails,
//            page_limit: this.pageLimit,
//          });

     
//       } else {
//         // ✅ no data
//         this.Transaction_list = [];
//         this.countDetails = 0;
//         this.recordNotFound = true;

//       }
//     },
//     (error) => {
//       this.spinner.hide();
//       console.error("API error:", error);
//       this.Transaction_list = [];
//       this.countDetails = 0;
     
      
//     }
//   );
// }


// pagination service
//  pagination(list_info: any) {

//     var start, eu, next, back, limit, total_count, offset, last_val, last_final_val, current, pagination: any, btn_length;
//     limit = list_info.page_limit;
//     total_count = list_info.total;
//     offset = list_info.offset;

//     start = 0 + offset;

//     eu = start - 0;
//     if (total_count < start + 1 && total_count > 1) {

//       eu = start - limit;
//       start = eu;

//     }
//     current = eu + limit;
//     back = eu - limit;
//     next = eu + limit;
//     last_val = Math.ceil(total_count / limit);
//     last_final_val = (last_val - 1) * limit;
//     pagination = { "info": "hide" };
//     if (total_count > limit) {
//       pagination.info = "show";
//       pagination.start = 0;

//       if (back >= 0) {
//         pagination.back = back;
//         pagination.backtab = "show";
//       }
//       else {
//         pagination.backtab = "hide";
//       }

//       btn_length = 1;
//       pagination.data = []
//       for (var offset_count = 0; offset_count < total_count; offset_count = offset_count + limit) {

//         if ((offset_count <= eu + (2 * limit)) && (offset_count >= eu - (2 * limit))) {

//           if (offset_count != eu) {
//             pagination.data.push({ "btn_length": btn_length, "offset_count": offset_count, "load": true });
//           }
//           else {
//             pagination.data.push({ "btn_length": btn_length, "offset_count": offset_count, "load": false });
//           }

//         }
//         btn_length = btn_length + 1;

//       }
//       if (current < total_count) {
//         pagination.next = next;
//         pagination.nexttab = "show";
//       }
//       else {
//         pagination.nexttab = "hide";
//       }
//       pagination.end = last_final_val;

//     }

//     return pagination;
//   }

  onSubmit(): void {
    this.spinner.show();
    if (this.mainCategoryForm.invalid) {
      this.toastr.error('Please fill all required fields', 'Form Submission Error');
      this.spinner.hide();
      return;
    }

    this.main_category.userId = this.userId;
    this.main_category.MainCategoryName = this.mainCategoryForm.value.MainCategoryName;
    this.main_category.Main_Description = this.mainCategoryForm.value.mainDescription;

    this.categoryService.addMainCategory(this.main_category).subscribe(
      response => {
        this.spinner.hide();
        console.log(response);
        if (response.category) {
          this.loadMainCategories();
          this.mainCategoryForm.reset();
          this.toastr.success(
            'Main category successfully inserted',
          );
          this.categoryService.mainCategoryList.next(true);
          
        } else {
          this.toastr.error('Error creating main category', 'Server Error');
        }
    },
    (error) => {
      this.spinner.hide();
      console.error('Error creating category', error);
      this.toastr.error('Server error. Please try again later.');
    }
    );
  }

  loadMainCategories(): void {
    this.spinner.show();
    this.categoryService.getMainCategories().subscribe(
      (categories) => {
        this.spinner.hide();
        this.main_category = categories;
      },
      (error) => {
        this.spinner.hide();
        console.error('Error fetching categories', error);
      }
    );
  }
}


// html search
// <div class="input-group" style="width: 50%!important;padding-left: 20px;">
//                 <input type="search" class="form-control" formControlName="remDaysSearch"
//                   (keyup)="getTransactionNewList({})"
//                   placeholder="Search Remaining Days ">
//                 <div class="input-group-append">
//                   <button type="button" class="btn btn-primary" title="Search Remaining Days " (click)="getTransactionNewList({})">
//                     <i class="fas fa-search" style="margin-right: 10px;"></i>R.Days
//                   </button>
//                 </div>
//               </div>

// ts is same as above

// full service is :

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Subject, Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })

// export class ServerService {
//   searchParams: any;


//     public urlFinal = "https://laravelapi.erp1.cal4care.com/api/";
//    // public urlFinal = "https://erp1.cal4care.com/api/";



 
 
 
//    baseUrl = 'https://laravelapi.erp1.cal4care.com/api/';
//   reload_profile: Subject<any> = new Subject();
//   global_search: Subject<any> = new Subject();
//   global_search_invoice: Subject<any> = new Subject();
//   global_search_customer: Subject<any> = new Subject();
//   global_search_quotation: Subject<any> = new Subject();
//   callbackfun: Subject<any> = new Subject();
//   closemodal: Subject<any> = new Subject();
//   invoice_search: Subject<any> = new Subject();
//   invoice_search1: Subject<any> = new Subject();



//   constructor(private http: HttpClient) {

//   }

//   sendServer(postData: any) {


//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })
//     };
//     let url = this.urlFinal + postData.api_url;
//     //  let url = "https://erp1.cal4care.com/api/"+postData.api_url;

//     // let url="http://127.0.0.1:8000/api/"+postData.api_url;

//     let posting: any[] = postData;
//     return this.http.post(url, posting, httpOptions);
//   }

//   sendServerMulInvPay(api_req: any): Observable<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       // Add any other headers if required
//     });

//     return this.http.post(`${this.baseUrl}${api_req.api_url}`, api_req, { headers });

//   }
//   sendServergetdata(getData: any) {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })

//     };
//     let url = this.urlFinal + getData.api_url;
//     // let url = "https://erp1.cal4care.com/api/" + getData.api_url;
//     return this.http.get(url, httpOptions);
//   }
//   uploadWithAction(data: FormData) {
//     return this.http.post<any>(this.urlFinal, data);  // unified endpoint
//   }
//   uploadFileAttachment(fullUrl: string, data: FormData) {
//     return this.http.post<any>(fullUrl, data);
//   }



//   // sendServerpath(postData: any[]) {
//   //   const httpOptions = {
//   //     headers: new HttpHeaders({
//   //       'Content-Type': 'application/json'
//   //     })

//   //   };
//   // }
//   sendServerpath(postData: any) {
//     try {
//       // Convert JSON string to object if needed
//       if (typeof postData === "string") {
//         postData = JSON.parse(postData);
//       }

//       if (!postData.api_url) {
//         console.error("Error: api_url is missing in postData!");
//         return;
//       }

//       let url = this.urlFinal + postData.api_url;
//       //   let url = "https://erp1.cal4care.com/api/" + postData.api_url;
//       const httpOptions = {
//         headers: new HttpHeaders({
//           'Content-Type': 'application/json'
//         })
//       };

//       return this.http.post(url, postData, httpOptions); // Ensure postData is sent as body
//     } catch (error) {
//       console.error("Error processing postData:", error);
//     }
//   }

//   postFile(postData: any) {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })
//     };

//     let url = this.urlFinal + postData.api_url;
//     // let url = "https://erp1.cal4care.com/api/" + postData.api_url;


//     const formData: FormData = new FormData();

//     formData.append('fileKey', postData, postData.name);
//     let posting: any[] = postData;
//     return this.http.post(url, posting, httpOptions);
//   }
//   sendServerpath1(postData: any[]) {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })

//     };
//   }

// setSearchParams(params: any) {
//     this.searchParams = params;
//   }

//   getSearchParams() {
//     return this.searchParams;
//   }


//   pagination(list_info: any) {

//     var start, eu, next, back, limit, total_count, offset, last_val, last_final_val, current, pagination: any, btn_length;
//     limit = list_info.page_limit;
//     total_count = list_info.total;
//     offset = list_info.offset;

//     start = 0 + offset;

//     eu = start - 0;
//     if (total_count < start + 1 && total_count > 1) {

//       eu = start - limit;
//       start = eu;

//     }
//     current = eu + limit;
//     back = eu - limit;
//     next = eu + limit;
//     last_val = Math.ceil(total_count / limit);
//     last_final_val = (last_val - 1) * limit;
//     pagination = { "info": "hide" };
//     if (total_count > limit) {
//       pagination.info = "show";
//       pagination.start = 0;

//       if (back >= 0) {
//         pagination.back = back;
//         pagination.backtab = "show";
//       }
//       else {
//         pagination.backtab = "hide";
//       }

//       btn_length = 1;
//       pagination.data = []
//       for (var offset_count = 0; offset_count < total_count; offset_count = offset_count + limit) {

//         if ((offset_count <= eu + (2 * limit)) && (offset_count >= eu - (2 * limit))) {

//           if (offset_count != eu) {
//             pagination.data.push({ "btn_length": btn_length, "offset_count": offset_count, "load": true });
//           }
//           else {
//             pagination.data.push({ "btn_length": btn_length, "offset_count": offset_count, "load": false });
//           }

//         }
//         btn_length = btn_length + 1;

//       }
//       if (current < total_count) {
//         pagination.next = next;
//         pagination.nexttab = "show";
//       }
//       else {
//         pagination.nexttab = "hide";
//       }
//       pagination.end = last_final_val;

//     }

//     return pagination;
//   }
// }


