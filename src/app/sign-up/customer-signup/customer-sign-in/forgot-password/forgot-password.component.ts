import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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

  constructor(private fb: FormBuilder,private customerService: CustomerService, private router: Router,private toastr:ToastrService,private spinner: NgxSpinnerService) {

    this.passwordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
          )
        ]
      ],
      confirmPassword: [{ value: '', disabled: true }, [
        Validators.required
      ]]
    }, { validators: this.passwordMatchValidator });
   }

  passwordMatchValidator(form: FormGroup) {
  const password = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
checkPasswordStrength() {
  const password = this.passwordForm.get('newPassword')?.value || '';
  this.passwordCriteria.minLength = password.length >= 8;
  this.passwordCriteria.uppercase = /[A-Z]/.test(password);
  this.passwordCriteria.lowercase = /[a-z]/.test(password);
  this.passwordCriteria.number = /[0-9]/.test(password);
  this.passwordCriteria.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

  get passwordFormField() {
    return this.passwordForm.get('newPassword');
  }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: this.fb.array(new Array(6).fill('').map(() => new FormControl('', Validators.required)))
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

  get otpArray() {
    return this.otpForm.get('otp') as FormArray;
  }

  onNext() {
    if (!this.email) { 
      this.invalidMessage =true;
      return;
    }
    this.spinner.show();

    this.customerService.forgotSendOtp(this.email).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.isOTPSendMessage) {
          this.isOTPSendMessage=true;
          this.toastr.success(`OTP send to ${this.email}`);
          this.emailExists=false;
          this.isOTPSent=true;
           this.timeLeft = 300; // reset to 5 minutes
          this.startTimer();
        } else {
          this.emailExists=true;
          this.isOTPSent=false;
          this.isOTPSendMessage=false;
        }
      },
      (error) => {
        this.spinner.hide();
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
    this.spinner.show();
    const enteredOTP = this.otpForm.value.otp.join('');

    // this.customerService.forgotVerifyOTP(this.email, enteredOTP).subscribe(
    //   response => {
    //     if (response.message === 'OTP verified successfully') {
    //       this.isOTPVerified = true;
    //       this.isOTPReSendMessage=false;
    //       // this.errorMessage = '';
    //       this.toastr.success('OTP verified');
    //       this.otpExpiredMessage = false;
    //       this.passwordForm.controls['newPassword'].enable();
    //       this.passwordForm.controls['confirmPassword'].enable();
    //       this.afterOtpVerified = true;
    //     } else if (response.message === 'OTP expired') {
    //       this.isOTPVerified = false;
    //       this.toastr.error('OTP expired');
    //       // this.errorMessage = '';
    //       this.otpExpiredMessage = true;
    //     } else {
    //       this.isOTPVerified = false;
    //       // this.errorMessage = 'Incorrect OTP. Please try again.';
    //       this.toastr.error('Incorrect OTP. Please try again.');
    //       this.otpExpiredMessage = false;
    //     }
    //   },
    //   error => {
    //     this.isOTPVerified = false;
    //     this.errorMessage = error.error.message || 'Error verifying OTP. Please try again.';
    //     this.otpExpiredMessage = false;
    //   }
    // );

    this.customerService
  .forgotVerifyOTP(this.email, enteredOTP)
  .subscribe(
    (response) => {
      this.spinner.hide();
      const msg = (response?.message || '').trim();

      if (msg === 'OTP verified successfully') {
        this.isOTPVerified = true;
        this.isOTPReSendMessage=false;
        this.toastr.success('OTP verified successfully');
        this.otpExpiredMessage = false;
        this.passwordForm.controls['newPassword'].enable();
        this.passwordForm.controls['confirmPassword'].enable();
        this.afterOtpVerified = true;
      }

      else if (msg === 'OTP expired') {
        this.isOTPVerified = false;
        this.otpExpiredMessage = true;
        this.toastr.error('OTP expired. Please request a new one.');
      }

      else if (msg === 'Incorrect OTP') {
        this.isOTPVerified = false;
       this.isOTPVerified = false;
        this.toastr.error('Incorrect OTP. Please try again.');
      }

      else {
        this.isOTPVerified = false;
        this.otpExpiredMessage = false;
        this.toastr.error(msg || 'Unexpected error. Please try again.');
        this.otpExpiredMessage = false;
      }
    },
    (error) => {
      this.spinner.hide();
      const errorMsg = error?.error?.message?.trim?.() || 'Server error. Please try again.';
      this.isOTPVerified = false;
      this.otpExpiredMessage = false;
      this.afterOtpVerified = false;
      this.toastr.error(errorMsg);
      console.error('Error verifying OTP:', error);
    }
  );

  }
  

  resendOTP(): void {
    this.spinner.show();
    this.customerService.forgotPasswordResendOTP(this.email).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.message === 'OTP resent to email') {
          console.log(`OTP resent to ${this.email}`, response);
          this.toastr.success(`OTP resend to ${this.email}`);
          this.isOTPReSendMessage=true;
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
  
    this.signin.email = JSON.parse(
      JSON.stringify(this.email)
    );
   
    this.signin.password = JSON.parse(
      JSON.stringify(this.passwordForm.value.newPassword)
    );

    this.customerService.forgotPassword(this.signin.email,this.signin.password).subscribe(
      response => {
        this.spinner.hide();
        if (response.message=='Password updated successfully') {
          this.passwordUpdated=true;
          this.toastr.success('Password updated successfully');
          this.isOTPVerified = true;
          setTimeout(() => {
            this.router.navigate(['/customer-signIn']);
          }, 2000);
        }  else {
          this.passwordUpdated = false;
        }
      },
      error => {
        this.spinner.hide();
        console.error('Error submitting form', error);
      }
    );
  }

//   onKeyDown(event: KeyboardEvent, index: number): void {
//   const input = event.target as HTMLInputElement;
//   if (event.key === 'Backspace' && !input.value && index > 0) {
//     const prev = document.querySelectorAll('.otp-box')[index - 1] as HTMLElement;
//     prev?.focus();
//   }
// }

}
