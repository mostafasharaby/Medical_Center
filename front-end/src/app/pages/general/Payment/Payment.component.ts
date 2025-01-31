import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnakebarService } from '../../../shared/service/SnakebarService.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-Payment',
  templateUrl: './Payment.component.html',
  styleUrls: ['./Payment.component.css']
})

export class PaymentComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,

  ) {
    this.checkoutForm = this.fb.group({
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      postalCode: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
    });
  }

  get cardHolderName() { return this.checkoutForm.get('cardHolderName'); }
  get postalCode() { return this.checkoutForm.get('postalCode'); }
  get cardNumber() { return this.checkoutForm.get('cardNumber'); }
  get expiryDate() { return this.checkoutForm.get('expiryDate'); }
  get cvv() { return this.checkoutForm.get('cvv'); }

  ngOnInit() {
  }
  @Output() paymentSuccess = new EventEmitter<boolean>(); 
  @Output() close = new EventEmitter<void>();
  closeModal() {
    this.close.emit();
  }
  onSubmitPayment(event: Event) {
    event.preventDefault();
    if (this.checkoutForm.valid) {
      console.log('Payment successful:', this.checkoutForm.value);
      this.paymentSuccess.emit(true); 
    } else {
      this.paymentSuccess.emit(false); 
    }
  }
}
