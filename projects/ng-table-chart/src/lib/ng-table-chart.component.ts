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

  isMouseDown = false;
  startRowIndex = null;
  startCellIndex = null;

  startOfSelectedRowIndex: number;
  startOfSelectedColumnIndex: number;

  endOfSelectedRowIndex: number;
  endOfSelectedColumnIndex: number;

  graphData: any[] = [];

  ngOnInit() {

    this.columnKeys = Object.keys(this.data[0]);

    const that = this;

    document.addEventListener("DOMContentLoaded", function () {
      that.table = document.getElementById('table');

      var alltds = that.table.querySelectorAll('td');

      alltds.forEach(td => {

        td.addEventListener('mousedown', function (e) {
          that.table = document.getElementById('table');
          that.isMouseDown = true;
          var cell = e.target;
          // var cell = $(this);

          if (that.table.querySelector(".selected")) {
            that.table.querySelectorAll(".selected").forEach(element => {
              element.classList.remove('selected') // deselect everything      
            });

          }

          if (e.shiftKey) {
            that.selectTo(cell);
          } else {
            cell.classList.add("selected");
            that.startCellIndex = cell.cellIndex;
            that.startRowIndex = cell.parentNode.rowIndex;
          }

          return false; // prevent text selection
        })

        td.addEventListener('mouseover', function (e) {
          if (!that.isMouseDown) return;
          if (that.table.querySelector(".selected")) {
            that.table.querySelector(".selected").classList.remove('selected') // deselect everything
          }
          that.selectTo(e.target);
        });
      });

    });


    document.addEventListener('mouseup', e => {
      this.isMouseDown = false;

      this.calculateSelectedFields();
      this.drawGraph();
    });

  }

  calculateSelectedFields() {
    let selectedData = [];

    this.graphData = [];

    const table = document.querySelector('table');
    for (var currentColumn = this.startOfSelectedColumnIndex; currentColumn <= this.endOfSelectedColumnIndex; currentColumn++) {

      selectedData.push({ key: currentColumn, sumOfSelected: 0, sumOfColumn: 0 });
      const currentSelectedData = selectedData[selectedData.length - 1];
      let sumOfSelected = 0;
      for (var row = this.startOfSelectedRowIndex + 1; row <= this.endOfSelectedRowIndex + 1; row++) {

        const td = table.rows[row].cells[currentColumn];
        sumOfSelected = sumOfSelected + parseFloat(td.textContent);
      }

      currentSelectedData.sumOfSelected = sumOfSelected;

      for (var r = 1; r <= this.data.length; r++) {
        const value = table.rows[r].cells[currentColumn].textContent.trim();
        currentSelectedData.sumOfColumn = currentSelectedData.sumOfColumn + parseFloat(value);
      }

      this.graphData.push(currentSelectedData);
    }
  }

  drawGraph() {
    var svg = document.getElementById('chart');
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    let i = 0;
    this.graphData.forEach(data => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      element.setAttributeNS(null, 'y', (i * 30).toString());
      element.setAttributeNS(null, 'height', '20');
      const totalCountPerc = ((data.sumOfSelected / data.sumOfColumn) * 100) + '%';
      element.setAttributeNS(null, 'width', totalCountPerc);
      var txt = document.createTextNode("Hello World");
      element.appendChild(txt);
      svg.appendChild(element);

      i++;
    });
  }

  selectTo(cell) {

    var row = cell.parentNode;
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


    const allTrs = this.table.querySelectorAll("tr");
    for (var i = rowStart; i <= rowEnd; i++) {
      var rowCells = eq(i, allTrs).querySelectorAll("td");
      for (var j = cellStart; j <= cellEnd; j++) {
        eq(j, rowCells).classList.add("selected");
      }
    }
  }

}

function eq(index, trs) {
  if (index >= 0 && index < trs.length)
    return trs[index];
  else
    return -1;
}


