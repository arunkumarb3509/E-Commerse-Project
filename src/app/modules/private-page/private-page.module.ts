import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivatePageRoutingModule } from './private-page-routing.module';
import { DashboardComponent } from 'src/app/private-page/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideBarComponent } from 'src/app/private-page/dashboard/side-bar/side-bar.component';
import { HeaderComponent } from 'src/app/private-page/dashboard/header/header.component';
import { BodyComponent } from 'src/app/private-page/dashboard/body/body.component';
import { ContentComponent } from 'src/app/private-page/dashboard/content/content.component';
import { LayoutComponent } from 'src/app/private-page/dashboard/layout/layout.component';
import { PrivatePageFooterComponent } from 'src/app/private-page/dashboard/private-page-footer/private-page-footer.component';
import { BusinessProfileComponent } from 'src/app/private-page/dashboard/body/business-profile/business-profile.component';
import { MainCategoriesComponent } from 'src/app/private-page/dashboard/body/categories/main-categories/main-categories.component';
import { SubCategoriesComponent } from 'src/app/private-page/dashboard/body/categories/sub-categories/sub-categories.component';
import { SubCategoryGridComponent } from 'src/app/component/grid/categories-grid/sub-category-grid/sub-category-grid.component';
import { MainCategoryGridComponent } from 'src/app/component/grid/categories-grid/main-category-grid/main-category-grid.component';
import { ViewMaincategoryComponent } from 'src/app/private-page/dashboard/body/categories/main-categories/view-maincategory/view-maincategory.component';
import { ViewSubcategoryComponent } from 'src/app/private-page/dashboard/body/categories/sub-categories/view-subcategory/view-subcategory.component';
import { ProductsComponent } from 'src/app/private-page/dashboard/body/products/products.component';
import { ProductGridComponent } from 'src/app/component/grid/product-grid/product-grid.component';
import { MyProfileComponent } from 'src/app/private-page/dashboard/body/my-profile/my-profile.component';
import { ViewProductsComponent } from 'src/app/private-page/dashboard/body/products/view-products/view-products.component';
import { ViewMoreProductsComponent } from 'src/app/private-page/dashboard/body/products/view-more-products/view-more-products.component';
import { ProductSizeComponent } from 'src/app/private-page/dashboard/body/products/product-size/product-size.component';
import { GlobalModule } from '../global/global.module';
import { CustomerProductComponent } from 'src/app/private-page/dashboard/body/customer-product/customer-product.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    ContentComponent,
    BodyComponent,
    SideBarComponent,
    HeaderComponent,
    PrivatePageFooterComponent,
    BusinessProfileComponent,
    MainCategoriesComponent,
    SubCategoriesComponent,
    MainCategoryGridComponent,
    SubCategoryGridComponent,
    ViewMaincategoryComponent,
    ViewSubcategoryComponent,
    ProductsComponent,
    ProductGridComponent,
    MyProfileComponent,
    ViewProductsComponent,
    ViewMoreProductsComponent,
    CustomerProductComponent,

    // ProductSizeComponent
    
  ],
  imports: [
    CommonModule,
    PrivatePageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GlobalModule,
    NgChartsModule
  ],
})
export class PrivatePageModule {}
