import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
      passwordConfirmation: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordValidator(control: AbstractControl) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumbers;
    return valid ? null : { passwordStrength: true };
  }

  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const passwordConfirmation = group.get('passwordConfirmation')?.value;

    return password === passwordConfirmation ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Registered successfully!', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Error while registering';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getPasswordErrors(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }

    if (passwordControl?.hasError('minlength')) {
      return 'Minimum 6 characters';
    }

    if (passwordControl?.hasError('passwordStrength')) {
      return 'The password must contain uppercase letters, lowercases and numbers';
    }
    return '';
  }
}
