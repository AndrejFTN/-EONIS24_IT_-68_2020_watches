import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {WatchComponent} from './components/watch/watch.component';
import {CartComponent} from './components/cart/cart.component';
import {OrderComponent} from './components/order/order.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {AuthGuard} from './helpers/auth.guard';
import {OrderDetailViewComponent} from './components/order-detail-view/order-detail-view.component';
import {PendingOrdersComponent} from './components/pending-orders/pending-orders.component';

const routes: Routes = [
  { path: '',
    redirectTo: '/watches',
    pathMatch: 'full'
  },
  {
    path: 'watches',
    component: HomeComponent
  },
  {
    path: 'watch/:id',
    component: WatchComponent
  },
  {
    path: 'order/:id',
    component: OrderDetailViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pending-orders',
    component: PendingOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '/watches' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
