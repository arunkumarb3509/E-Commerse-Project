import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignIn } from '../../../../Model/signIn';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/Services/customer.service';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-sign-in',
  templateUrl: './customer-sign-in.component.html',
  styleUrls: ['./customer-sign-in.component.scss']
})
export class CustomerSignInComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<any>;
  loginForm: FormGroup;
  signin: SignIn = new SignIn();
  inCorrectMail: boolean = false;
  inCorrectMessage: boolean = false;
  isOTPSent: boolean = false;
  signInOtpForm!: FormGroup; 
  isOTPVerified: boolean = false;
  errorMessage: string = '';
  otpExpiredMessage: boolean = false;
  afterOtpVerified: boolean = false;
  resendMsg:string ='';
  mailInCorrect:boolean = false;
  isOTPReSendMessage:boolean = false;

  constructor(
    public customerService: CustomerService, 
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const encryptedData = params['data'];
      if (encryptedData) {
        const secretKey = 'mySecretKey123'; // Same key used for encryption
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('Decrypted order data:', decryptedData);
      }
    });

    this.signInOtpForm = this.fb.group({
      otp: this.fb.array(new Array(6).fill('').map(() => new FormControl('', Validators.required)))
    });
  }

  get otpArray() {
    return this.signInOtpForm.get('otp') as FormArray;
  }

  onKeyUp(event: KeyboardEvent, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    const otpInputsArray = this.otpInputs.toArray();

    if (inputElement.value.length === 1 && index < this.otpArray.length - 1) {
      otpInputsArray[index + 1].nativeElement.focus();
    } else if (event.key === 'Backspace' && index > 0) {
      otpInputsArray[index - 1].nativeElement.focus();
    }
  }

  onInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 1) {
      inputElement.value = inputElement.value.slice(0, 1);
    }
  }

  signIn() {
    if (this.loginForm.invalid) { 
      return;
    }

    this.signin.email = this.loginForm.value.email;
    this.signin.password = this.loginForm.value.password;

    this.customerService.SignInSendOTP(this.signin.email, this.signin.password).subscribe(
      (response) => {
        this.inCorrectMail = false;
        this.inCorrectMessage = false;
        this.isOTPSent = false;
        this.errorMessage = '';

        if (response.message === 'Invalid email') {
          this.inCorrectMail = true;
          this.mailInCorrect = true;
          this.errorMessage = 'Invalid email';
        } else if (response.message === 'Incorrect email or password') {
          this.inCorrectMessage = true;
          this.inCorrectMail = true;
          this.mailInCorrect = false;
          this.errorMessage = 'Not match email and password';
        } else if (response.message === 'OTP sent to email') {
          this.isOTPSent = true;
          this.toastr.success(`OTP send to ${this.signin.email}`);
          // this.errorMessage =`otp send to ${ this.signin.email}`;
          // this.generateOTP();
        }
      },
      (error) => {
        console.error("An error occurred: ", error);
        // this.errorMessage = 'An error occurred. Please try again.';
        if (error.error.message === 'Invalid email') {
          this.inCorrectMail = true;
          this.errorMessage = 'Invalid email';
        } else if (error.error.message === 'Incorrect email or password') {
          this.inCorrectMessage = true;
          this.inCorrectMail = false;
          this.errorMessage = 'not match email or password';
        } else if(error.error.message ==='Invalid Password'){
          this.inCorrectMail = true;
        }
          else if (
        error?.error?.message === 'Please check your internet connection'
      ) {
        this.toastr.error('Please check your internet connection');
        this.isOTPSent = false;
      }
      }
    );
  }

  // generateOTP() {
  //       this.customerService.SignInSendOTP(this.signin.email, this.signin.password).subscribe(
  //         (response: any) => {
  //           console.log('OTP sent', response);
  //         },
  //         error => {
  //           console.error('Error sending OTP', error);
  //         }
  //       );
  //     }
    
     

  resendOTP(): void {
    // this.generateOTP();
    this.customerService.signInResendOTP(this.signin.email).subscribe(
      (response: any) => {
        if (response.message === 'OTP resent to email') {
          this.isOTPReSendMessage=true;
          // this.resendMsg =`OTP resend to ${this.signin.email}`;
           this.toastr.success(`OTP resend to ${this.signin.email}`);
        }
       else{
        this.isOTPReSendMessage=false;
       }
      },
      error => {
        console.error('Error sending OTP', error);
      }
    );
  }

  verifyOTP(): void {
    const enteredOTP = this.signInOtpForm.value.otp.join('');
    const guestUserId = sessionStorage.getItem('guestUserId');

    if (!guestUserId) {
      console.log("Please refresh your screen: guestUserId is missing");
      this.toastr.error("Please refresh your screen: guestUserId is missing");
      return;
    }

    this.customerService.signInVerifyOTP(this.signin.email, enteredOTP,guestUserId).subscribe(
      (response) => {
        if (response.message === 'OTP verified successfully') {
          this.isOTPVerified = true;
          this.toastr.success(`OTP verified`);
          // this.errorMessage = '';
          this.otpExpiredMessage = false;
          this.afterOtpVerified = true;

         // Store token and userId in localStorage
         localStorage.setItem('jwt', response.token);
         localStorage.setItem('userId', response.user.id);  // Now it matches the backend response
         localStorage.setItem('UserType', response.user.customerType);

          setTimeout(()=>{
            window.location.href = '';
          },2000)
          
        } else if (response.message === 'OTP expired') {
          this.isOTPVerified = false;
          this.errorMessage = '';
          this.toastr.error(`OTP expired`);
          this.otpExpiredMessage = true;
        } else {
          this.isOTPVerified = false;
          this.toastr.error('Incorrect OTP. Please try again.');
          this.errorMessage = 'Incorrect OTP. Please try again.';
          this.otpExpiredMessage = false;
        }
      },
      (error) => {
        this.isOTPVerified = false;
        this.errorMessage = error.error.message || 'Error verifying OTP. Please try again.';
        this.otpExpiredMessage = false;
      }
    );
  }
  
}

