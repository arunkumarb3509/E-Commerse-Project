import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCartComponent } from 'src/app/home-pg-cards/view-cart/view-cart.component';

const routes: Routes = [
  // {path:'viewCart',component:ViewCartComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalRoutingModule { }
