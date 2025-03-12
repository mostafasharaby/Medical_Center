import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ForgotServiceService } from '../auth-services/forgot-service.service';
import { ModelService } from '../auth-services/model.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetPassword',
  templateUrl: './forgetPassword.component.html'
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  isDialogOpen = false;
  isDialogMounted = false;
  forgetForm!: FormGroup;
  private modalSubscription!: Subscription;

  constructor(private forgetpasswordService: ForgotServiceService,
              private modalService: ModelService,
              private toaster: ToastrService) { }

  ngOnInit() {
    this.modalSubscription = this.modalService.dialogState$.subscribe((state) => {
      this.isDialogOpen = state;
      this.isDialogMounted = state;
    });
  }
  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
  openDialog(): void {
    this.isDialogOpen = true;
    setTimeout(() => {
      this.isDialogMounted = true;
    }, 10);
  }

  closeDialog(): void {
    this.modalService.closeDialog();
  }

  get Forgotemail() {
    return this.forgetForm.get('emailForgot');
  }

  onForgotSubmit() {
    const emailForgetVal = this.forgetForm.value.emailForgot;
    console.log("emailForgot", emailForgetVal);
    this.forgetpasswordService.forgetPassword(emailForgetVal).subscribe({
      next: (res) => {
        this.toaster.success(`Success: ${res.message}`);
      },
      error: (err) => this.toaster.error(`Error: ${err.message}`)
    });
  }


}
