import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgTableChartModule } from 'projects/ng-table-chart/src/lib/ng-table-chart.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgTableChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
