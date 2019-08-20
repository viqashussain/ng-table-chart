import { Component, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'lib-ng-table-chart',
  templateUrl: 'ng-table-CharacterData.component.html',
  styleUrls: ['ng-table-CharacterData.component.scss']
})
export class NgTableChartComponent implements OnInit {

  constructor() { }

  @Input() data;

  columnKeys: string[];

  table;
  selectedColumns;
  sumOfColumns: number[] = [];

  isMouseDown = false;
  startRowIndex = null;
  startCellIndex = null;

  startOfSelectedRowIndex: number;
  startOfSelectedColumnIndex: number;

  endOfSelectedRowIndex: number;
  endOfSelectedColumnIndex: number;

  sumOfSelectedCells: number = 0;
  countOfSelectedCells: number = 0;

  graphData: any[] = [];

  ngOnInit() {

    this.columnKeys = Object.keys(this.data[0]);

    const that = this;

    document.addEventListener("DOMContentLoaded", function () {

      that.columnKeys.forEach(columnKey => {
        let sumOfColumn = 0;
        for (var r = 0; r < that.data.length; r++) {
          const value = that.data[r][columnKey];
          sumOfColumn = sumOfColumn + parseFloat(value);
        }
  
        that.sumOfColumns.push(sumOfColumn);
      });

      that.table = document.getElementById('table');

      var alltds = that.table.querySelectorAll('td');
      var allths = that.table.querySelectorAll('th');

      allths.forEach(th => {

        th.addEventListener('click', function (e) {
          var t0 = performance.now();
          var cell = e.target;

          that.table.querySelectorAll(".selected").forEach(element => {
            element.className = '';
          });

          if (e.shiftKey) {
            let lastRow = that.table.rows[that.table.rows.length - 1];
            let lastCell = lastRow.cells[cell.cellIndex];

            that.selectTo(lastCell);
          } else {
            that.startCellIndex = cell.cellIndex;
            that.startRowIndex = 1;
            let lastRow = that.table.rows[that.table.rows.length - 1];
            let lastCell = lastRow.cells[cell.cellIndex];

            that.selectTo(lastCell);
          }
          var t1 = performance.now();
          console.log("Call to click took " + (t1 - t0) + " milliseconds.")
          return false;
        })
      });

      alltds.forEach(td => {

        td.addEventListener('mousedown', function (e) {
          that.isMouseDown = true;
          const cell = e.target;

          if (that.table.querySelector(".selected")) {
            that.table.querySelectorAll(".selected").forEach(element => {
              element.className = '';
            });

          }

          if (e.shiftKey) {
            that.selectTo(cell);
          } else {
            cell.className = 'selected';
            that.startCellIndex = cell.cellIndex;
            that.startRowIndex = cell.parentNode.rowIndex;
          }

          return false; // prevent text selection
        })

        td.addEventListener('mouseover', function (e) {
          if (!that.isMouseDown) return;
          if (that.table.querySelector(".selected")) {
            that.table.querySelectorAll(".selected").forEach(element => {
              element.className = '';
            });
          }
          that.selectTo(e.target);
        });
      });

    });

    document.addEventListener('mouseup', e => {
      this.isMouseDown = false;
    });

  }

  calculateSelectedFields() {
    var t1 = performance.now();
    let selectedData = [];

    this.graphData = [];

    this.sumOfSelectedCells = 0;
    this.countOfSelectedCells = 0;

    if (this.endOfSelectedColumnIndex < this.startOfSelectedColumnIndex) {
      const temp = this.endOfSelectedColumnIndex;
      this.endOfSelectedColumnIndex = this.startOfSelectedColumnIndex;
      this.startOfSelectedColumnIndex = temp;
    }

    if (this.endOfSelectedRowIndex < this.startOfSelectedRowIndex) {
      const temp = this.endOfSelectedRowIndex;
      this.endOfSelectedRowIndex = this.startOfSelectedRowIndex;
      this.startOfSelectedRowIndex = temp;
    }

    const allTrs = document.getElementsByTagName('tr');
    for (var currentColumn = this.startOfSelectedColumnIndex; currentColumn <= this.endOfSelectedColumnIndex; currentColumn++) {

      selectedData.push({ key: currentColumn, sumOfSelected: 0, sumOfColumn: 0 });
      const currentSelectedData = selectedData[selectedData.length - 1];
      let sumOfSelected = 0;
      for (var row = this.startOfSelectedRowIndex + 1; row <= this.endOfSelectedRowIndex + 1; row++) {

        const td = allTrs[row].cells[currentColumn];
        sumOfSelected = sumOfSelected + parseFloat(td.textContent);

        this.sumOfSelectedCells = this.sumOfSelectedCells + parseFloat(td.textContent);
        this.countOfSelectedCells++;
      }

      currentSelectedData.sumOfSelected = sumOfSelected;

      currentSelectedData.sumOfColumn = this.sumOfColumns[currentColumn];

      this.graphData.push(currentSelectedData);
    }

    var t2 = performance.now();
    console.log("Call to calculateSelectedFields " + (t2 - t1) + " milliseconds.")
  }

  drawGraph() {
    var svg = document.getElementById('chart');
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    let i = 0;
    this.graphData.forEach(data => {

      const backgroundBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundBar.setAttributeNS(null, 'y', (i * 30).toString());
      backgroundBar.setAttributeNS(null, 'height', '20');
      backgroundBar.setAttributeNS(null, 'width', '100%');
      backgroundBar.setAttributeNS(null, 'fill', 'red');
      var txt = document.createTextNode("Hello World");
      backgroundBar.appendChild(txt);
      svg.appendChild(backgroundBar);

      const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      element.setAttributeNS(null, 'y', (i * 30).toString());
      element.setAttributeNS(null, 'height', '20');
      element.setAttributeNS(null, 'fill', 'green');
      const totalCountPerc = ((data.sumOfSelected / data.sumOfColumn) * 100) + '%';
      element.setAttributeNS(null, 'width', totalCountPerc);
      var txt = document.createTextNode("Hello World");
      element.appendChild(txt);
      svg.appendChild(element);

      i++;
    });
  }

  selectTo(cell) {

    var t0 = performance.now();

    var cellIndex = cell.cellIndex;
    var rowIndex = cell.parentNode.rowIndex;

    this.endOfSelectedRowIndex = rowIndex - 1;
    this.endOfSelectedColumnIndex = cellIndex;

    var rowStart, rowEnd, cellStart, cellEnd;

    if (rowIndex < this.startRowIndex) {
      rowStart = rowIndex;
      rowEnd = this.startRowIndex;
    } else {
      rowStart = this.startRowIndex;
      rowEnd = rowIndex;
    }

    if (cellIndex < this.startCellIndex) {
      cellStart = cellIndex;
      cellEnd = this.startCellIndex;
    } else {
      cellStart = this.startCellIndex;
      cellEnd = cellIndex;
    }

    this.startOfSelectedRowIndex = this.startRowIndex - 1;
    this.startOfSelectedColumnIndex = this.startCellIndex;


    const allTrs = document.getElementsByTagName('tr');
    for (var i = rowStart; i <= rowEnd; i++) {
      var rowCells = eq(i, allTrs).querySelectorAll("td");
      for (var j = cellStart; j <= cellEnd; j++) {
        eq(j, rowCells).className = 'selected';
      }
    }

    var t1 = performance.now();
    console.log("Call to selectTo took " + (t1 - t0) + " milliseconds.")

    this.calculateSelectedFields();
    this.drawGraph();
  }

}

function eq(index, trs) {
  if (index >= 0 && index < trs.length)
    return trs[index];
  else
    return -1;
}


