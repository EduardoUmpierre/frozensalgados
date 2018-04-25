import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsViewPage } from './reports-view';

@NgModule({
  declarations: [
    ReportsViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsViewPage),
  ],
})
export class ReportsViewPageModule {}
