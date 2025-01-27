import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationService {


  private apiUrl = 'http://localhost:5004/api/Account/confirm-email';

  constructor(private http: HttpClient  ,private authService :AuthServiceService) { }

  confirmEmail(userId: string, token: string): Observable<any> {
    const encodedToken = encodeURIComponent(token);
    // console.log("decodedToken ", encodedToken);
     const url = `${this.apiUrl}?userId=${userId}&token=${encodedToken}`;
    // console.log("url",url); 
   
    const headers = this.authService.getHeaders();  
    return this.http.get(url, { headers, responseType: 'text' });

  }

}
