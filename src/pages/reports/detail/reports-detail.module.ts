import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsDetailPage } from './reports-detail';

@NgModule({
  declarations: [
    ReportsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsDetailPage),
  ],
})
export class ReportsDetailPageModule {}
