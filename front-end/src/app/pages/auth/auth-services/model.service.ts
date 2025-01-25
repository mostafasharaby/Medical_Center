import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

constructor() { }
private dialogState = new BehaviorSubject<boolean>(false);
dialogState$ = this.dialogState.asObservable();

openDialog() {
  setTimeout(() => {
    this.dialogState.next(true);
  }, 100);
  this.dialogState.next(true);
}

closeDialog() {
  setTimeout(() => {
       this.dialogState.next(false);
    }, 200);
 
}
}
