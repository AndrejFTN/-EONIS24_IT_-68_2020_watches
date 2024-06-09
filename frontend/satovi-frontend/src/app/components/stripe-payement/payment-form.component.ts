import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Stripe, StripeCardElement, StripeElements} from '@stripe/stripe-js';
import {StripeService} from './stripe-payement.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements AfterViewInit {

  @Input()
  orderID: string = "";

  @Input()
  amount: number = 0;

  @Output()
  paymentCompleted: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('cardElement') cardElement?: ElementRef;


  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  processing = false;
  errorMessage: string | null = null;

  constructor(private stripeService: StripeService,
              private cdr: ChangeDetectorRef,
              private toastService: ToastrService) {}

  async ngAfterViewInit() {
    this.stripe = await this.stripeService.getStripe();

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');

      this.cdr.detectChanges();

      this.card.mount('#card-element');
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.card) {
      return;
    }

    this.processing = true;

    const newPayment: PaymentModel = {
      orderId: this.orderID,
      amount: this.amount,
      currency: "usd"
    }

    const response = await this.stripeService.createPaymentIntent(newPayment);
    if (response === 'Payment successful!') {
      this.toastService.info("Payment successful!");
      this.paymentCompleted.emit();
    } else {
      this.toastService.error("Payment unsuccessful!");
    }
  }
}

export class PaymentModel {
  amount?: number;
  orderId?: string;
  currency?: string;
}
