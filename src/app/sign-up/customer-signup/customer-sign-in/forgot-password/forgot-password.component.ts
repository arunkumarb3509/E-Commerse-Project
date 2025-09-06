import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SignIn } from 'src/Model/signIn';
import { CustomerService } from 'src/Services/customer.service'; // Adjust path as per your project structure

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChildren('otpInput')
  otpInputs!: QueryList<any>;
  email: string = '';
  emailExists:boolean=false;
  isOTPSent:boolean=false;
  otpForm!: FormGroup; 
  isOTPVerified: boolean = false;
  isOTPSendMessage: boolean=false;
  otpExpiredMessage: boolean = false;
  afterOtpVerified: boolean = false;
  errorMessage: string = '';
  passwordForm: FormGroup;
  invalidMessage:boolean =false;
  passwordUpdated:boolean=false;
  otpSend=`OTP sent to ${this.email}`;
  resendMsg:string ='';
  isOTPReSendMessage:boolean = false;
  signin: SignIn = new SignIn();

  constructor(private fb: FormBuilder,private customerService: CustomerService, private router: Router,private toastr:ToastrService) {

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

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
  }

  onNext() {
    if (!this.email) { 
      this.invalidMessage =true;
      return;
    }

    this.customerService.forgotSendOtp(this.email).subscribe(
      (response: any) => {
        if (response.isOTPSendMessage) {
          this.isOTPSendMessage=true;
          this.emailExists=false;
          this.isOTPSent=true;
        } else {
          this.emailExists=true;
          this.isOTPSent=false;
          this.isOTPSendMessage=false;
        }
      },
      (error) => {
  this.isOTPSent = false;
  console.error('Error sending OTP', error);

  const errorMessage = error?.error?.message;

  if (errorMessage === 'Please check your internet connection') {
    this.toastr.error('Please check your internet connection');
    this.emailExists = false; // still try to allow retry
  } else if (errorMessage === 'Email does not exist') {
    this.toastr.warning('This email is not registered.');
    this.emailExists = true;
  } else {
    this.toastr.error('Failed to send OTP. Please try again.', 'Error');
    this.emailExists = false;
  }
}

    );
  }


  verifyOTP(): void {
    const enteredOTP = this.otpForm.value.otp.join('');

    this.customerService.forgotVerifyOTP(this.email, enteredOTP).subscribe(
      response => {
        if (response.message === 'OTP verified successfully') {
          this.isOTPVerified = true;
          this.isOTPReSendMessage=false;
          this.errorMessage = '';
          this.otpExpiredMessage = false;
          this.passwordForm.controls['newPassword'].enable();
          this.passwordForm.controls['confirmPassword'].enable();
          this.afterOtpVerified = true;
        } else if (response.message === 'OTP expired') {
          this.isOTPVerified = false;
          this.errorMessage = '';
          this.otpExpiredMessage = true;
        } else {
          this.isOTPVerified = false;
          this.errorMessage = 'Incorrect OTP. Please try again.';
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
    this.customerService.forgotPasswordResendOTP(this.email).subscribe(
      (response: any) => {
        if (response.message === 'OTP resent to email') {
          console.log(`OTP resent to ${this.email}`, response);
          this.isOTPReSendMessage=true;
          this.resendMsg =`OTP resent to ${this.email}`;
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
  
    this.signin.email = JSON.parse(
      JSON.stringify(this.email)
    );
   
    this.signin.password = JSON.parse(
      JSON.stringify(this.passwordForm.value.newPassword)
    );

    this.customerService.forgotPassword(this.signin.email,this.signin.password).subscribe(
      response => {
        if (response.message=='Password updated successfully') {
          this.passwordUpdated=true;
          this.isOTPVerified = false;
          setTimeout(() => {
            this.router.navigate(['/customer-signIn']);
          }, 2000);
        }  else {
          this.passwordUpdated = false;
        }
      },
      error => {
        console.error('Error submitting form', error);
      }
    );
  }

}
