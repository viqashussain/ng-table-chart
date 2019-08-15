import { NgModule } from '@angular/core';
import { NgTableChartComponent } from './ng-table-chart.component';
import { KeyValuePipe, CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgTableChartComponent],
  imports: [
    CommonModule
  ],
  exports: [NgTableChartComponent]
})
export class NgTableChartModule { }
