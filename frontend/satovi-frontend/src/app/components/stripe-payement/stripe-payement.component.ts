import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentModel } from './payment-form.component';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private orderService: OrderService) {
    this.stripePromise = loadStripe(environment.stripe.publicKey);
  }

  async createPaymentIntent(payment: PaymentModel): Promise<string> {
    try {
      // Pozivamo servis za plaćanje
      const response = await this.orderService.payOrder(payment).toPromise();
      return response.message; // Vraćamo odgovor servisa za plaćanje
    } catch (error) {
      console.error('Error during payment:', error);
      throw error; // Propagiramo grešku dalje
    }
  }

  async getStripe() {
    return await this.stripePromise;
  }
}
