import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ForgotServiceService } from '../auth-services/forgot-service.service';
import { ModelService } from '../auth-services/model.service';

@Component({
  selector: 'app-forgetPassword',
  templateUrl: './forgetPassword.component.html'
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private forgetpasswordService: ForgotServiceService , private modalService :ModelService) { }

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
    // this.isDialogMounted = false;
    // setTimeout(() => {
    //   this.isDialogOpen = false;
    // }, 200);
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
        alert(`Success: ${res.message}`)
      },
      error: (err) => alert(`Errorrrr: ${err.error.message}`)
    });

  }


}




