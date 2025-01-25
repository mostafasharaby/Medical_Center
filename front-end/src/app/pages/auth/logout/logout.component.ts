import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-services/auth-service.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private authService: AuthServiceService) { }


  ngOnInit() {
  }

  //--------------------logout Dialog-------------------
  
  confirmLogout(): void {
    console.log('Logging out...');    
    this.authService.logout();     
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload();
    });
  }

  cancelLogout(): void {
    console.log('Logout cancelled.');
    this.router.navigate(['/pages/home']);
  }


}
