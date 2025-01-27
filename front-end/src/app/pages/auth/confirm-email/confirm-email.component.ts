import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailConfirmationService } from '../auth-services/email-confirmation.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html'
})
export class ConfirmEmailComponent implements OnInit {

  confirmationMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
     private http: HttpClient, 
     private router: Router,
     private emailConfirmationService: EmailConfirmationService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const token = params['token'];
      
      console.log(token);
      if (userId && token) {
        this.confirmEmail(userId, token);
      } else {
        this.errorMessage = 'Invalid confirmation link.';
      }
    });
  }

  confirmEmail(userId: string, token: string) {
    this.emailConfirmationService.confirmEmail(userId, token).subscribe(
      (response: any) => {
        this.confirmationMessage = response.message || 'Email confirmed successfully.';
        console.log("confirmationMessage", this.confirmationMessage);
        this.errorMessage = null;         
         this.router.navigate(['/auth/login']);
      },
      (error: any) => {
        this.errorMessage = error.error || 'An error occurred while confirming your email.';
        this.confirmationMessage = null;
      }
    );
  }

}
