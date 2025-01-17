import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-services/auth-service.service';

@Component({
  selector: 'app-LoginSuccess',
  templateUrl: './LoginSuccess.component.html',
  styleUrls: ['./LoginSuccess.component.css']
})
export class LoginSuccessComponent implements OnInit {

    constructor(private route: ActivatedRoute , private router :Router , private authService :AuthServiceService) { }
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (token) {
          localStorage.setItem('token', token);
          this.authService.isLoggedSubject.next(true);
          console.log('Token stored successfully:', token);
           this.router.navigate(['/pages/home']);
        } else {
          console.error('Token not found in query parameters');
        }
      });
    }
  
  
}
