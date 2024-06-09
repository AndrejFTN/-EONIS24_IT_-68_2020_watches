import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dialog',
  template: `
    <h2 mat-dialog-title>Payment</h2>
    <mat-dialog-content>
      <app-payment-form [orderID]="data.orderID" [amount]="data.amount" (paymentCompleted)="handlePaymentCompleted()"></app-payment-form>
    </mat-dialog-content>
  `,
})
export class PaymentDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  handlePaymentCompleted() {
    // Emitujte događaj da se zna da je plaćanje uspešno završeno
  }
}

