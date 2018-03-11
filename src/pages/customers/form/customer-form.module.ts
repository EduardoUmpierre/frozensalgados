import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerFormPage } from './customer-form';

@NgModule({
  declarations: [
    CustomerFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerFormPage),
  ],
})
export class CustomerFormPageModule {}
