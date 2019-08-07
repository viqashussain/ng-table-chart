import { TestBed } from '@angular/core/testing';

import { NgTableChartService } from './ng-table-chart.service';

describe('NgTableChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgTableChartService = TestBed.get(NgTableChartService);
    expect(service).toBeTruthy();
  });
});
