import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy {

  loggedStatusSubscription!: Subscription;
  constructor(private authService:AuthServiceService,
              private router : Router,
  ) { }
  ngOnDestroy(): void {
   if (this.loggedStatusSubscription) {
     this.loggedStatusSubscription.unsubscribe();
   }
  }


  isLoggedIn = true;
  
  ngOnInit() {
    this.loggedStatusSubscription = this.authService.getloggedStatus().subscribe(status => {
      this.isLoggedIn = status;
      console.log("status",status);
    });    
  }
  
  //---------------------Toggle----------------------

  isCollapsed = true;
  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isDrawerOpen = false;
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  } 


//-------------------- social icons loops-------------------
  socialLinks = [
    { href: '#', icon: 'fa-facebook', aria: 'Facebook' },
    { href: '#', icon: 'fa-twitter', aria: 'Twitter' },
    { href: '#', icon: 'fa-google-plus', aria: 'Google Plus' },
    { href: '#', icon: 'fa-instagram', aria: 'Instagram' },
    { href: '#', icon: 'fa-pinterest-p', aria: 'Pinterest' },
  ];
  
  menuItems = [
    { href: '/pages/home', label: 'Home' },
    { href: '/pages/about-us', label: 'About' },
    { href: '/pages/service', label: 'Service' },
    { href: '/pages/gallery', label: 'Gallery' },
    { href: '/pages/team', label: 'Team' },
    { href: '/pages/appointment', label: 'Appointment' },
    { href: '/pages/blog', label: 'Blog' },
    { href: '/pages/contact', label: 'Contact' }
  ];

}
