import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTableChartComponent } from './ng-table-chart.component';

describe('NgTableChartComponent', () => {
  let component: NgTableChartComponent;
  let fixture: ComponentFixture<NgTableChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgTableChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTableChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
