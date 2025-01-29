import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ForgotServiceService } from '../auth-services/forgot-service.service';
import { ModelService } from '../auth-services/model.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgetPassword',
  templateUrl: './forgetPassword.component.html'
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private forgetpasswordService: ForgotServiceService ,
     private modalService :ModelService,
     private toaster :ToastrService
    ) { }

  ngOnInit() {
    this.modalService.dialogState$.subscribe((state) => {
      this.isDialogOpen = state;
      this.isDialogMounted = state;
    });
  }


  isDialogOpen = false;
  isDialogMounted = false;

  openDialog(): void {
    this.isDialogOpen = true;
    setTimeout(() => {
      this.isDialogMounted = true;
    }, 10);
  }

  closeDialog(): void {
    this.modalService.closeDialog();
  }

  forgetForm !: FormGroup;
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




