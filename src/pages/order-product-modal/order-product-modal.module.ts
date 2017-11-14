import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderProductModalPage } from './order-product-modal';

@NgModule({
  declarations: [
    OrderProductModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderProductModalPage),
  ],
})
export class OrderProductModalPageModule {}
