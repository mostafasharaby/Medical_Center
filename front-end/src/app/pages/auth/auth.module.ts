import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forgetPassword/forgetPassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginSuccessComponent } from './LoginSuccess/LoginSuccess.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token/:email', component: ForgetPasswordComponent },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
] 

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,          
    HttpClientModule,
    FormsModule 
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    LoginSuccessComponent,
    ConfirmEmailComponent
  ],
  exports: [LogoutComponent]
})
export class AuthModule { }
