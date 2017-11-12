import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderFormPage } from './order-form';
import { SelectSearchableModule } from '../../components/select/select-module';

@NgModule({
    declarations: [
        OrderFormPage,
    ],
    imports: [
        IonicPageModule.forChild(OrderFormPage),
        SelectSearchableModule
    ],
})
export class OrderFormPageModule {
}
