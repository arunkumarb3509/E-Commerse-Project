import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CarouselComponent } from './carousel/carousel.component';
import { BelowCarouselComponent } from './below-carousel/below-carousel.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomePgCardsComponent } from './home-pg-cards/home-pg-cards.component';
import { CustomerSignupComponent } from './sign-up/customer-signup/customer-signup.component';
import { SellerSignupComponent } from './sign-up/seller-signup/seller-signup.component';
import { CustomerSignInComponent } from './sign-up/customer-signup/customer-sign-in/customer-sign-in.component';
import { ForgotPasswordComponent } from './sign-up/customer-signup/customer-sign-in/forgot-password/forgot-password.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpSuccessComponent } from './sign-up/customer-signup/sign-up-success/sign-up-success.component';
import { NgModule } from '@angular/core';
import { TopHeaderComponent } from './top-header/top-header.component';
import { CopyRightComponent } from './copy-right/copy-right.component';
import { ToastrModule } from 'ngx-toastr';
import { ProductSizeComponent } from './private-page/dashboard/body/products/product-size/product-size.component';
import { ProductDetailsComponent } from './home-pg-cards/product-details/product-details.component';
import { ViewCartComponent } from './home-pg-cards/view-cart/view-cart.component';
import { ProductImagesComponent } from './private-page/dashboard/body/products/view-more-products/product-images/product-images.component';
import { ProductOffersComponent } from './private-page/dashboard/body/products/view-more-products/product-offers/product-offers.component';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GlobalModule } from './modules/global/global.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/interceptors/auth.interceptor';
import { NgChartsModule } from 'ng2-charts';
import { WelcomeSellerComponent } from './private-page/dashboard/body/welcome-seller/welcome-seller.component';


@NgModule({
  declarations: [
    AppComponent,
    TopHeaderComponent,
    FooterComponent,
    CopyRightComponent,
    NavbarComponent,
    CarouselComponent,
    BelowCarouselComponent,
    SignUpComponent,
    HomePgCardsComponent,
    CustomerSignupComponent,
    SellerSignupComponent,
    CustomerSignInComponent,
    ForgotPasswordComponent,
    SignUpSuccessComponent,
    ProductDetailsComponent,
    ViewCartComponent,
    ProductImagesComponent,
    ProductOffersComponent,

       
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule, 
    GlobalModule,
    NgChartsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Position the toastr at the top-right corner
      timeOut: 3000, // Optional: Adjust the display duration
      closeButton: true, 
      progressBar: true 
    }),
  ],
  providers: [
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
