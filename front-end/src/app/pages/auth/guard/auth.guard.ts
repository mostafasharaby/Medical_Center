import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isTokenExpired()) {
      console.log('Token expired');
      this.authService.logout();
      return false; 
    }
    console.log('token is valid'); 
    return true; 
  }
}
