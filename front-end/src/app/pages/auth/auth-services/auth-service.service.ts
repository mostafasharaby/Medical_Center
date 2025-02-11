import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError, timer } from 'rxjs';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {

  //isLoggedSubject: BehaviorSubject<boolean>;
  public isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,  private toaster: ToastrService) {
    //this.isLoggedSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn);  // old
   // this.isLoggedSubject = new BehaviorSubject<boolean>(this.isTokenExpired());
   // console.log("isUserLoggedIn", this.isUserLoggedIn);
    console.log("this.isTokenExpired()", this.isTokenExpired());
    this.updateAuthStatus();
    //this.startTokenExpiryCheck();
  }

  private loginUrl = `${environment.api}/Account/login`;
  public googleloginUrl = `${environment.api}/Account/LoginWithGoogle`;
  private registerUrl = `${environment.api}/Account/register/user`;
  private userUrl = '';
  private tokenCheckInterval: any;
  usernameTakenError: boolean = false;
  private username: string | null = null;

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    return this.http.post<any>(this.loginUrl, loginData).pipe(
      tap((response: any) => {
        console.log("response token: " + response.token);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          //this.isLoggedSubject.next(true);

          this.updateAuthStatus();
          //this.startTokenExpiryCheck(); 


          this.username = this.getUsernameFromToken();
          console.log("username", this.username,);
          // const decodedToken = jwtDecode(response.token) as any;
          // console.log("decodedToken ", JSON.stringify(decodedToken));
        }
      })
    );
  }

  register(userName: string, email: string, password: string, confirmPassword: string): Observable<any> {
    const registerData = { userName, email, password, confirmPassword };

    return this.http.post<any>(this.registerUrl, registerData).pipe(
      tap((response: any) => {
        //console.log('User registered successfully:', response);
      }),
      catchError((error: any) => {
        if (error.status === 400 && error.error.includes("Username")) {
          this.usernameTakenError = true;
        }
        return throwError(() => new Error(error));
      })
    );
  }

  logout() {
    this.toaster.info("Please log in again to your account");
    localStorage.removeItem('token');
    this.isLoggedSubject.next(false);    
  }

  get isUserLoggedIn(): boolean {
    return (localStorage.getItem('token')) ? true : false;
  }

  getloggedStatus(): Observable<boolean> {
    console.log("Getting logged status " , this.isLoggedSubject.value)   // false means not logged in (expired token)
    return this.isLoggedSubject.asObservable();
  }


  isTokenExpired(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return true; 

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log( "isTokenExpired ",Date.now() >= payload.exp * 1000);
      return Date.now() >= payload.exp * 1000; 
    } catch (e) {
      return true; 
    }
  }

  private updateAuthStatus(): void {
    const isLoggedIn = !this.isTokenExpired();
    this.isLoggedSubject.next(isLoggedIn);

    if (!isLoggedIn) {
      this.logout(); // If token is expired, log the user out
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const timeRemaining = expiryTime - Date.now();

      timer(timeRemaining).subscribe(() => {
        this.logout(); // Auto logout when token expires
      });

    } catch {
      this.logout();
    }
  }
  
  private startTokenExpiryCheck(): void {
    clearInterval(this.tokenCheckInterval); // Ensure no duplicate intervals
    this.tokenCheckInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        this.logout();
      }
    }, 10000); // Check every 10 seconds
  }

isRole(role: string): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as any;
      console.log('decodedToken', JSON.stringify(decodedToken));
      return (
        decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] === role
      );
    }
    return false;
  }

  getNameIdentifier(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as any;
      console.log('decodedToken', JSON.stringify(decodedToken));
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    }
    return null;
  }


  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as any;
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
    return null;
  }

  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }


}
