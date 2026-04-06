import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CustomerSignupComponent } from './sign-up/customer-signup/customer-signup.component';
import { SellerSignupComponent } from './sign-up/seller-signup/seller-signup.component';
import { CustomerSignInComponent } from './sign-up/customer-signup/customer-sign-in/customer-sign-in.component';
import { ForgotPasswordComponent } from './sign-up/customer-signup/customer-sign-in/forgot-password/forgot-password.component';
import { SignUpSuccessComponent } from './sign-up/customer-signup/sign-up-success/sign-up-success.component';
import { AuthGuard } from 'src/auth-guard/auth.guard';
import { ProductDetailsComponent } from './home-pg-cards/product-details/product-details.component';
import { ViewCartComponent } from './home-pg-cards/view-cart/view-cart.component';


const routes: Routes = [
    //  {path :'',redirectTo:'customer-signIn',pathMatch:'full'},
  { path: '', component: CarouselComponent },
  {path:'sign-up',component:SignUpComponent},
  {path:'customer-signup',component:CustomerSignupComponent},
  {path:'customer-signIn',component:CustomerSignInComponent},
  {path:'seller-signup',component:SellerSignupComponent},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'signUpSuccess',component:SignUpSuccessComponent},
  { path:'product-details/:code/:name', component: ProductDetailsComponent },
  {path:'viewCart',component:ViewCartComponent},

  {
    path: 'fashionflair',
     canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/private-page/private-page.module').then(
        (m) => m.PrivatePageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
