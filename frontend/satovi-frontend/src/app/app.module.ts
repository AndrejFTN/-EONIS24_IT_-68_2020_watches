import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './helpers/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { WatchComponent } from './components/watch/watch.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { ContentWrapperComponent } from './components/content-wrapper/content-wrapper.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {ToastrModule} from 'ngx-toastr';
import { OrderDetailViewComponent } from './components/order-detail-view/order-detail-view.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { PendingOrdersComponent } from './components/pending-orders/pending-orders.component';
import {PaymentFormComponent} from './components/stripe-payement/payment-form.component';
import {PaymentDialogComponent} from './components/stripe-payement/payment-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    WatchComponent,
    CartComponent,
    OrderComponent,
    MenubarComponent,
    ContentWrapperComponent,
    OrderDetailViewComponent,
    PendingOrdersComponent,
    PaymentFormComponent,
    PaymentDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MenubarModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
