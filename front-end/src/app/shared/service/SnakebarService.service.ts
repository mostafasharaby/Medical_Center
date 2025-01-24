import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnakebarService {
  
constructor(private snakebar: MatSnackBar 
  
  ) { }

showSnakeBar(message: string) {  
  this.snakebar.open(message, "Close", {
    duration: 3000,
    horizontalPosition: "start",
    verticalPosition: "top",
    panelClass: ['error-snackbar']
  });
}


}

