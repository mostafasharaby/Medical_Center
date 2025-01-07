import { AfterViewInit, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadService implements AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {
    console.log('Angular view fully initialized');
    this.initializeLoader();
  }

  initializeLoader(): void {
    console.log('initializeLoader is running');
    // Check for loader and preloader elements
    const loader = document.querySelector('.loader');
    const preloader = document.getElementById('preloader');

    if (!loader || !preloader) {
      console.warn('Loader or preloader elements are missing from the DOM');
      return; 
    }

    // Reset the loader visibility if needed
    preloader.style.display = 'block';
    loader.classList.remove('fade-out');
    loader.classList.add('fade-in'); 

    // Fade out the loader after a short timeout
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 300); 

   
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600); 
  }

  resetLoader(): void {
    console.log('Resetting loader');
    // Reset loader and preloader to initial state
    const loader = document.querySelector('.loader');
    const preloader = document.getElementById('preloader');
    
    if (!loader || !preloader) {
      console.warn('Loader or preloader elements are missing from the DOM');
      return; 
    }

    // Show the preloader again
    preloader.style.display = 'block';
    loader.classList.remove('fade-out');
    loader.classList.add('fade-in');
  }
}
