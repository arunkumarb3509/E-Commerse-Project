import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductGridComponent } from "src/app/component/grid/product-grid/product-grid.component";
import { BusinessProfileComponent } from "src/app/private-page/dashboard/body/business-profile/business-profile.component";
import { MainCategoriesComponent } from "src/app/private-page/dashboard/body/categories/main-categories/main-categories.component";
import { ViewMaincategoryComponent } from "src/app/private-page/dashboard/body/categories/main-categories/view-maincategory/view-maincategory.component";
import { SubCategoriesComponent } from "src/app/private-page/dashboard/body/categories/sub-categories/sub-categories.component";
import { ViewSubcategoryComponent } from "src/app/private-page/dashboard/body/categories/sub-categories/view-subcategory/view-subcategory.component";
import { CustMyOrderComponent } from "src/app/private-page/dashboard/body/cust-my-order/cust-my-order.component";
import { CustOrderSuccessComponent } from "src/app/private-page/dashboard/body/cust-order-success/cust-order-success.component";
import { MyProfileComponent } from "src/app/private-page/dashboard/body/my-profile/my-profile.component";
import { ProductsComponent } from "src/app/private-page/dashboard/body/products/products.component";
import { ProductImagesComponent } from "src/app/private-page/dashboard/body/products/view-more-products/product-images/product-images.component";
import { ProductOffersComponent } from "src/app/private-page/dashboard/body/products/view-more-products/product-offers/product-offers.component";
import { ViewMoreProductsComponent } from "src/app/private-page/dashboard/body/products/view-more-products/view-more-products.component";
import { ViewProductsComponent } from "src/app/private-page/dashboard/body/products/view-products/view-products.component";
import { WelcomeSellerComponent } from "src/app/private-page/dashboard/body/welcome-seller/welcome-seller.component";
import { DashboardComponent } from "src/app/private-page/dashboard/dashboard.component";


const privatePageRoutes: Routes = [
    {
      path: '',
      component: DashboardComponent,
    
      children: [

        { path: 'dashboard/welcome', 
        component: WelcomeSellerComponent,
      },
        { path: 'dashboard/order-success/:orderId',
           component: CustOrderSuccessComponent 
          },
        { path: 'dashboard/my-orders',
           component: CustMyOrderComponent
         },
        {
          path: 'dashboard/business-profile',
          component: BusinessProfileComponent,
        },
        
        {
          path: 'dashboard/main-categories',
          component: MainCategoriesComponent,
        },
        
        {
          path: 'dashboard/sub-categories',
          component: SubCategoriesComponent,
        },
        
        { path: 'dashboard/view-maincategory', 
          component: ViewMaincategoryComponent },
       
       { path: 'dashboard/view-subcategory', 
        component: ViewSubcategoryComponent,
       },

       { path: 'dashboard/my-profile', 
        component: MyProfileComponent,
      },

      { path: 'dashboard/products/create-products', 
        component: ProductsComponent,
      },
      

      { path: 'dashboard/products/view-products', 
        component: ProductGridComponent,
      },

      { path: 'dashboard/products/edit-products', 
        component: ViewProductsComponent,
      },

      { path: 'dashboard/products/view/products-details', 
        component: ViewMoreProductsComponent,
      },

      { path: 'dashboard/products/create-product-images', 
        component: ProductImagesComponent,
      },

      { path: 'dashboard/products/create-product-offers', 
        component: ProductOffersComponent,
      },
      ],
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      // canActivate: [AuthGuard],
      // pathMatch: 'full',
    },

    
    // {path:'side-bar',component:SideBarComponent},

    // {
    //   path: '/dashboard',
    //   component: DashboardComponent,
    //   canActivate: [AuthGuard],
    //   pathMatch: 'full',
    // },
  ];

  @NgModule({
    imports: [RouterModule.forChild(privatePageRoutes)],
    exports: [RouterModule],
  })
  export class PrivatePageRoutingModule {}