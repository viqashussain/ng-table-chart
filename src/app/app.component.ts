import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-table-charts';

  data: any[] = [];
  readonly recordsCount = 100;

  ngOnInit()
  {
    for (let i = 0; i < this.recordsCount; i++) {
      // const record = {
      //   columnA: Math.floor(Math.floor(Math.random() * 1000000)),
      //   columnB: Math.floor(Math.floor(Math.random() * 1000000)),
      //   columnC: Math.floor(Math.floor(Math.random() * 1000000))
      // }
      const record = {
        columnA: `${i}A`,
        columnB: `${i}B`,
        columnC: `${i}C`
      }
      this.data.push(record);
    }
  }
  
}
