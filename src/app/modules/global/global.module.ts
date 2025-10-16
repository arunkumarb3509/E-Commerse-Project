import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalRoutingModule } from './global-routing.module';
import { ProductSizeComponent } from 'src/app/private-page/dashboard/body/products/product-size/product-size.component';
import { ViewCartComponent } from 'src/app/home-pg-cards/view-cart/view-cart.component';


@NgModule({
  declarations: [
    ProductSizeComponent,
    // ViewCartComponent
  ],
  imports: [
    CommonModule,
    GlobalRoutingModule
  ],
  exports: [
    ProductSizeComponent 
  ]
})
export class GlobalModule { }
