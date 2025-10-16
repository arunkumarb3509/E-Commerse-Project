

import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder, private router: Router, public customerService: CustomerService,private toastr:ToastrService) {
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

  onInput(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 1) {
      inputElement.value = inputElement.value.slice(0, 1);
    }
  }

  onNext(): void {
    this.emailExists = false;
    if (this.registrationForm.invalid) {
      return;
    }
console.log("seller");

    // this.email = this.registrationForm.value.email;

    this.email = JSON.parse(
      JSON.stringify(this.registrationForm.value.email)
    );

    this.customerService.checkEmailExists(this.email).subscribe(
      response => {
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
        console.error('Error checking email', error);
      }
    );
  }

 generateOTP() {
  this.customerService.signUpSendOTP(this.email).subscribe(
    (response: any) => {
      this.isOTPSent = true;
      this.toastr.success(`OTP send to ${this.email}`, response);
    },
    (error) => {
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

  verifyOTP(): void {
    const enteredOTP = this.otpForm.value.otp.join('');

    this.customerService.signUpVerifyOTP(this.email, enteredOTP).subscribe(
      response => {
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
        this.isOTPVerified = false;
        this.errorMessage = error.error.message || 'Error verifying OTP. Please try again.';
        this.otpExpiredMessage = false;
      }
    );
  }

  resendOTP(): void {
    this.customerService.signUpResendOTP(this.email).subscribe(
      (response: any) => {

        if (response.message === 'OTP resent to email') {
          console.log(`OTP resend to ${this.email}`, response);
          this.isOTPReSendMessage=true;
          this.toastr.success(`OTP resend to ${this.email}`);
          // this.resendMsg =`OTP resent to ${this.email}`;
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

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.isOTPVerified) {
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
        if (response.message ===  'User registered successfully') {
          this.afterEmailExists = false;
          this.router.navigate(['/signUpSuccess']);    
        }
        else{
          this.afterEmailExists = true;
        }
        
      },
      error => {
        console.error('Error submitting form', error);
      }
    );
  }
}
