import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListFormPage } from './list-form';

@NgModule({
  declarations: [
    ListFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ListFormPage),
  ],
})
export class ListFormPageModule {}
