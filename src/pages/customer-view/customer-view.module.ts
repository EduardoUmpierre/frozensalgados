import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerViewPage } from './customer-view';

@NgModule({
  declarations: [
    CustomerViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerViewPage),
  ],
})
export class CustomerViewPageModule {}
