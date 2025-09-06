import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Business_Profile } from 'src/Model/business_profile';
import { Signup } from 'src/Model/sign-up';
import { SignIn } from 'src/Model/signIn';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class CustomerService {
private environment = environment;
// private sendMailUrl = 'http://localhost:5000/api/signUpSentOTP';
// private signUpResendOtpUrl='http://localhost:5000/api/signUpResendOtp';
// private SignInSendOtpUrl = 'http://localhost:5000/api/SignInSendOtp';
// private signInResendOtpUrl='http://localhost:5000/api/signInResendOtp';
// private signInVerifyOTPUrl = 'http://localhost:5000/api/signInVerifyOTP';
private authUrl = 'http://localhost:5000/api/authorize';
// private signupUrl = 'http://localhost:5000/api/signup';
// private checkEmailExistsUrl='http://localhost:5000/api/emailExists';
// private verifyOTPUrl='http://localhost:5000/api/verifyOTP';
// private forgotSendOtpUrl='http://localhost:5000/api/forgotSendOtp';
// private forgotVerifyOTPUrl='http://localhost:5000/api/forgotVerifyOTP';
// private forgotPasswordResendOTPUrl='http://localhost:5000/api/forgotPasswordResendOTP';
// private forgotPasswordUrl='http://localhost:5000/api/forgotPassword';
// private business_profile_URL='http://localhost:5000/api/business-profile';
// private userLoggedInUrl='http://localhost:5000/api/loggedInUserDetails/';

private verifyToken: string | null = null;

  constructor(private http: HttpClient) { }
  checkEmailExists(email: string): Observable<any> {  
    return this.http.post<any>(this.environment.REGISTRATION.CHECK_EMAIL_EXIS,{email} );
  }

  signUpSendOTP(email: string): Observable<any> { 
    return this.http.post<any>(this.environment.REGISTRATION.REGISTRATION_SEND_OTP, {email} );
  }

  signUpVerifyOTP(email: string, otp: string): Observable<any> {
    const options = { withCredentials: true }; 
    return this.http.post<any>(this.environment.REGISTRATION.REGISTRATION_VERIFY_OTP, { email, otp }, options).pipe(
      tap(response => {
        if (response.token) {
          this.verifyToken = response.token;
        }
      })
    );
  }

  signUpResendOTP(email: string): Observable<any> { 
    return this.http.post<any>(this.environment.REGISTRATION.REGISTRATION_RESEND_OTP, email );
  }

  // signUp(signup: Signup): Observable<any> {
  //   const token = this.verifyToken;
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post<any>(this.environment.REGISTRATION.REGISTRATION_SUCCESS, signup);
  // }
  signUp(signup: Signup): Observable<any> {
  const token = this.verifyToken;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<any>(
    this.environment.REGISTRATION.REGISTRATION_SUCCESS,
    signup,
    { headers } // <-- Pass headers here
  );
}


 
  SignInSendOTP(email:string , password:string): Observable<any> { 
    return this.http.post<any>(this.environment.LOGIN.LOGIN_SEND_OTP,{ email, password});
  }

  signInResendOTP(email: string): Observable<any> { 
    return this.http.post<any>(this.environment.LOGIN.LOGIN_RESEND_OTP, email );
  }

  // signInVerifyOTP(email: string, otp: string,guestUserId:string): Observable<any> {
  //   const options = { withCredentials: true }; 
  //   return this.http.post<any>(this.signInVerifyOTPUrl, { email, otp,guestUserId }, options).pipe(
  //     tap(response => {
  //       if (response.token) {
  //         this.verifyToken = response.token;
  //       }
  //     })
  //   );
  // }
  signInVerifyOTP(email: string, otp: string, guestUserId: string): Observable<any> {
  return this.http.post<any>(this.environment.LOGIN.LOGIN_VERIFY_OTP, { email, otp, guestUserId }).pipe(
    tap(response => {
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
    })
  );
}

  forgotSendOtp(email: string): Observable<any> {  
    return this.http.post<any>(this.environment.FORGOT_PASSWORD.FORGOT_PASSWORD_SEND_OTP ,{ email });
  }

  forgotVerifyOTP(email: string, otp: string): Observable<any> {
    const options = { withCredentials: true }; 
    return this.http.post<any>(this.environment.FORGOT_PASSWORD.FORGOT_PASSWORD_VERIFY_OTP, { email, otp }, options).pipe(
      tap(response => {
        if (response.token) {
          this.verifyToken = response.token;
        }
      })
    );
  }

  forgotPasswordResendOTP(email: string): Observable<any> { 
    return this.http.post<any>(this.environment.FORGOT_PASSWORD.FORGOT_PASSWORD_RESEND_OTP, { email });
  }

  forgotPassword(email: string, password:string): Observable<any> { 
    return this.http.post<any>(this.environment.FORGOT_PASSWORD.CREATE_NEW_PASSWORD, { email ,password });
  }

  authorize(): Observable<any> {
    return this.http.get<any>(this.authUrl, { withCredentials: true });
  }

  businessProfile(business_profile: Business_Profile): Observable<any> {
    return this.http.post<any>(this.environment.SELLER_DATA.CREATE_BUSINESS_PROFILE, business_profile);
  }

   userLoggedInDetails(userId: number): Observable<any> {
    // return this.http.get<any>(`${this.userLoggedInUrl}${userId}`);
    return this.http.get<any>(this.environment.CUSTOMER_DATA.GET_CUSTOMER_DETAILS + userId);

  }
  
}

 

