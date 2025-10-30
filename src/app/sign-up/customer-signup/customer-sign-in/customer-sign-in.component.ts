import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignIn } from '../../../../Model/signIn';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from 'src/Services/customer.service';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
declare const google: any;

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
  user: any = null;
  timer: any;
  timeLeft: number = 300; // 5 minutes = 300 seconds
  formattedTime: string = '05:00';
  isTimerRunning: boolean = false;

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

     // Initialize Google Sign-In
  // google.accounts.id.initialize({
  //   client_id: '878361559102-3lgprtr340dgiug8arorpec9tekgrj8k.apps.googleusercontent.com',
  //   callback: (response: any) => this.handleLogin(response)
  // });

  // google.accounts.id.renderButton(
  //   document.getElementById("googleBtn"),
  //   { theme: "outline", size: "large", width: "100%" }
  // );
  }

  ngAfterViewInit() {
    if (!this.isOTPSent) {
      google.accounts.id.initialize({
        client_id: '878361559102-3lgprtr340dgiug8arorpec9tekgrj8k.apps.googleusercontent.com',
        callback: (response: any) => this.handleLogin(response)
      });

      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }

  handleLogin(response: any) {
  console.log("Google JWT Token:", response.credential);

  fetch("http://localhost:3000/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
    console.log("User Data:", data);
    this.user = data;
    // store JWT and user info here
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('userId', data.user.userId);
    localStorage.setItem('UserType', data.user.customerType);
    this.toastr.success("Google SignIn Successful!");
    setTimeout(()=> window.location.href = '', 2000);
  });
}

  startTimer() {
  this.isTimerRunning = true;
  this.updateTimerDisplay();

  this.timer = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.updateTimerDisplay();
    } else {
      this.isTimerRunning = false;
      clearInterval(this.timer);
    }
  }, 1000);
 }

 updateTimerDisplay() {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  this.formattedTime = `${this.padTime(minutes)}:${this.padTime(seconds)}`;
}

padTime(time: number): string {
  return time < 10 ? '0' + time : time.toString();
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

  // onInput(event: Event, index: number): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.value.length > 1) {
  //     inputElement.value = inputElement.value.slice(0, 1);
  //   }
  // }

  onInput(event: any, index: number): void {
  const input = event.target;
  const value = input.value;

  if (value && index < this.otpArray.length - 1) {
    const next = document.querySelectorAll('.otp-box')[index + 1] as HTMLElement;
    next?.focus();
  }
}

onKeyDown(event: KeyboardEvent, index: number): void {
  const input = event.target as HTMLInputElement;
  if (event.key === 'Backspace' && !input.value && index > 0) {
    const prev = document.querySelectorAll('.otp-box')[index - 1] as HTMLElement;
    prev?.focus();
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
          this.timeLeft = 300; // reset to 5 minutes
          this.startTimer();
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
          this.toastr.error('Invalid email');
        } else if (error.error.message === 'Incorrect email or password') {
          this.inCorrectMessage = true;
          this.inCorrectMail = false;
          this.toastr.error('Incorrect crenditials');
          this.errorMessage = 'not match email or password';
        } else if(error.error.message ==='Invalid Password'){
          this.inCorrectMail = true;
          this.toastr.error('Invalid Password');
        }
        else if( error?.error?.message === 'Something went wrong, please try again later'){
        this.toastr.error('Please check your internet connection');
        this.isOTPSent = false;
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
          this.timeLeft = 300; // reset to 5 minutes
          this.startTimer();
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

    if (!enteredOTP) {
      this.toastr.error("Please enter your OTP");
      return;
    }

    // this.customerService.signInVerifyOTP(this.signin.email, enteredOTP,guestUserId).subscribe(
    //   (response) => {
    //     if (response.message === 'OTP verified successfully') {
    //       this.isOTPVerified = true;
    //       this.toastr.success(`OTP verified`);
    //       // this.errorMessage = '';
    //       this.otpExpiredMessage = false;
    //       this.afterOtpVerified = true;

    //      // Store token and userId in localStorage
    //      localStorage.setItem('jwt', response.token);
    //     //  localStorage.setItem('userId', response.user.id);userId  // Now it matches the backend response
    //      localStorage.setItem('UserType', response.user.customerType);
    //     localStorage.setItem('userId', response.user.userId);  

    //       setTimeout(()=>{
    //         window.location.href = '';
    //         // this.router.navigate(['/fashionflair/dashboard/my-profile']);
    //       },2000)
          
    //     } else if (response.message === 'OTP expired') {
    //       this.isOTPVerified = false;
    //       this.errorMessage = '';
    //       this.toastr.error(`OTP expired`);
    //       this.otpExpiredMessage = true;
    //     }else if(response.message == "Incorrect OTP"){
    //       this.isOTPVerified = false;
    //       this.toastr.error('Incorrect OTP. Please try again.');
    //       this.otpExpiredMessage = false;
    //     } else {
    //       this.isOTPVerified = false;
    //       this.toastr.error('Incorrect OTP. Please try again.');
    //       this.errorMessage = 'Incorrect OTP. Please try again.';
    //       this.otpExpiredMessage = false;
    //     }
    //   },
    //   (error) => {
    //     this.isOTPVerified = false;
    //     this.errorMessage = error.error.message || 'Error verifying OTP. Please try again.';
    //     this.otpExpiredMessage = false;
    //   }
    // );
  
    this.customerService
  .signInVerifyOTP(this.signin.email, enteredOTP, guestUserId)
  .subscribe(
    (response) => {
      const msg = (response?.message || '').trim();

      if (msg === 'OTP verified successfully') {
        this.isOTPVerified = true;
        this.afterOtpVerified = true;
        this.otpExpiredMessage = false;
        this.toastr.success('OTP verified successfully');

        // Save user info
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('UserType', response.user.customerType);
        localStorage.setItem('userId', response.user.userId);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '';
        }, 2000);
      }

      else if (msg === 'OTP expired') {
        this.isOTPVerified = false;
        this.otpExpiredMessage = true;
        this.afterOtpVerified = false;
        this.toastr.error('OTP expired. Please request a new one.');
      }

      else if (msg === 'Incorrect OTP') {
        this.isOTPVerified = false;
        this.otpExpiredMessage = false;
        this.afterOtpVerified = false;
        this.toastr.error('Incorrect OTP. Please try again.');
      }

      else {
        this.isOTPVerified = false;
        this.otpExpiredMessage = false;
        this.afterOtpVerified = false;
        this.toastr.error(msg || 'Unexpected error. Please try again.');
      }
    },
    (error) => {
      const errorMsg = error?.error?.message?.trim?.() || 'Server error. Please try again.';
      this.isOTPVerified = false;
      this.otpExpiredMessage = false;
      this.afterOtpVerified = false;
      this.toastr.error(errorMsg);
      console.error('Error verifying OTP:', error);
    }
  );

  }
  
}

