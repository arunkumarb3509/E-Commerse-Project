

import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Signup } from 'src/Model/sign-up';
import { CustomerService } from 'src/Services/customer.service';


@Component({
  selector: 'app-seller-signup',
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.scss']
})

export class SellerSignupComponent implements OnInit {
  @ViewChildren('otpInput')
  otpInputs!: QueryList<any>;
  signup: Signup = new Signup();
  registrationForm: FormGroup;
  otpForm!: FormGroup; 
  passwordForm: FormGroup;
  isOTPSent: boolean = false;
  isOTPSendMessage: boolean = false;
  isOTPVerified: boolean = false;
  emailExists: boolean = false;
  email: string = '';
  errorMessage: string = '';
  otpExpiredMessage: boolean = false;
  afterEmailExists:boolean=false;
  afterOtpVerified: boolean = false;
  isOTPReSendMessage : boolean =false;
  resendMsg:string ='';
  value!: string;
  timer: any;
  timeLeft: number = 300; // 5 minutes = 300 seconds
  formattedTime: string = '05:00';
  isTimerRunning: boolean = false;
   passwordCriteria = {
  minLength: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
};

  constructor(private fb: FormBuilder, private router: Router, public customerService: CustomerService,private toastr:ToastrService,private spinner: NgxSpinnerService) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zip_code: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });

    this.passwordForm = this.fb.group({
      newPassword: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: [{ value: '', disabled: true }, [
        Validators.required
      ]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  get passwordFormField() {
    return this.passwordForm.get('newPassword');
  }
  checkPasswordStrength() {
  const password = this.passwordForm.get('newPassword')?.value || '';
  this.passwordCriteria.minLength = password.length >= 8;
  this.passwordCriteria.uppercase = /[A-Z]/.test(password);
  this.passwordCriteria.lowercase = /[a-z]/.test(password);
  this.passwordCriteria.number = /[0-9]/.test(password);
  this.passwordCriteria.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

 onKeyDown(event: KeyboardEvent, index: number): void {
  const input = event.target as HTMLInputElement;
  if (event.key === 'Backspace' && !input.value && index > 0) {
    const prev = document.querySelectorAll('.otp-box')[index - 1] as HTMLElement;
    prev?.focus();
  }
}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: this.fb.array(new Array(6).fill('').map(() => new FormControl('', Validators.required)))
    });
  }

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
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

  onNext(): void {
    this.spinner.show();
    this.emailExists = false;
    if (this.registrationForm.invalid) {
      this.spinner.hide();
      return;
    }


    // this.email = this.registrationForm.value.email;

    this.email = JSON.parse(
      JSON.stringify(this.registrationForm.value.email)
    );

    this.customerService.checkEmailExists(this.email).subscribe(
      response => {
        this.spinner.hide();
        if (response.emailExists) {
          this.emailExists = true;
           this.toastr.error(`${this.email} already exists.`);
        } else {
          this.emailExists = false;
          this.generateOTP();
          this.isOTPSent = true;
          this.isOTPSendMessage = true;
        }
        
      },
      error => {
        this.spinner.hide();
        console.error('Error checking email', error);
      }
    );
  }

 generateOTP() {
  this.spinner.show();
  this.customerService.signUpSendOTP(this.email).subscribe(
    (response: any) => {
      this.spinner.hide();
      this.isOTPSent = true;
       this.timeLeft = 300; // reset to 5 minutes
       this.startTimer();
      this.toastr.success(`OTP send to ${this.email}`);
    },
    (error) => {
      this.spinner.hide();
      this.isOTPSent = false;
      console.error('Error sending OTP', error);

      // Check for custom backend error message
      if (
        error?.error?.message === 'Please check your internet connection'
      ) {
        this.toastr.error('Please check your internet connection');
        this.isOTPSent = false;
      } else {
        this.toastr.error('Failed to send OTP. Please try again.', 'Error');
      }
    }
  );
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

  verifyOTP(): void {
    this.spinner.show();
    const enteredOTP = this.otpForm.value.otp.join('');

    if (enteredOTP.length < 6 || !/^\d{6}$/.test(enteredOTP) ) {
      this.toastr.error('Please enter a OTP.');
      return;
    }

    this.customerService.signUpVerifyOTP(this.email, enteredOTP).subscribe(
      response => {
        this.spinner.hide();
        if (response.message === 'OTP verified successfully') {
          this.isOTPVerified = true;
          // this.errorMessage = '';
          this.toastr.success('OTP verified');
          this.otpExpiredMessage = false;
          this.passwordForm.controls['newPassword'].enable();
          this.passwordForm.controls['confirmPassword'].enable();
          this.afterOtpVerified = true;
          //console.log('Token:', response.token);
          //localStorage.setItem('jwt', response.token);
        } else if (response.message === 'OTP expired') {
          this.isOTPVerified = false;
          this.toastr.error('OTP expired');
          // this.errorMessage = '';
          this.otpExpiredMessage = true;
        } else {
          this.isOTPVerified = false;
          // this.errorMessage = 'Incorrect OTP. Please try again.';
           this.toastr.error('Incorrect OTP. Please try again.');
          this.otpExpiredMessage = false;
        }
      },
      error => {
        this.spinner.hide();
        this.isOTPVerified = false;
        this.errorMessage = error.error.message || 'Error verifying OTP. Please try again.';
        this.otpExpiredMessage = false;
      }
    );
  }

  resendOTP(): void {
    this.spinner.show();
    this.customerService.signUpResendOTP(this.email).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.message === 'OTP resent to email') {
          console.log(`OTP resend to ${this.email}`);
          this.isOTPReSendMessage=true;
          this.toastr.success(`OTP resend to ${this.email}`);
          this.timeLeft = 300; // reset to 5 minutes
          this.startTimer();
          // this.resendMsg =`OTP resent to ${this.email}`;
        }
       else{
        this.isOTPReSendMessage=false;
       }
       
      },
      error => {
        this.spinner.hide();
        console.error('Error sending OTP', error);
      }
    );
  }

  onSubmit(): void {
    this.spinner.show();
    if (this.passwordForm.invalid || !this.isOTPVerified) {
      this.spinner.hide();
      return;
    }

    this.signup.firstName = JSON.parse(
      JSON.stringify(this.registrationForm.value.firstName)
    );
    this.signup.lastName = JSON.parse(
      JSON.stringify(this.registrationForm.value.lastName)
    );
    this.signup.email = JSON.parse(
      JSON.stringify(this.registrationForm.value.email)
    );
    this.signup.phone = JSON.parse(
      JSON.stringify(this.registrationForm.value.phone)
    );
    this.signup.password = JSON.parse(
      JSON.stringify(this.passwordForm.value.newPassword)
    );
   this.signup.customer_type= "seller" ;
   this.signup.address = JSON.parse(
    JSON.stringify(this.registrationForm.value.address)
  );
  this.signup.state = JSON.parse(
    JSON.stringify(this.registrationForm.value.state)
  );
  this.signup.city = JSON.parse(
    JSON.stringify(this.registrationForm.value.city)
  );
  this.signup.zip_code = JSON.parse(
    JSON.stringify(this.registrationForm.value.zip_code)
  );

    this.customerService.signUp(this.signup).subscribe(
      response => {
        this.spinner.hide();
        if (response.message ===  'User registered successfully') {
          this.afterEmailExists = false;
          this.router.navigate(['/signUpSuccess']);    
        }
        else{
          this.afterEmailExists = true;
        }
        
      },
      error => {
        this.spinner.hide();
        console.error('Error submitting form', error);
      }
    );
  }
}
