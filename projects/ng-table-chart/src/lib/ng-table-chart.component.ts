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

      document.getElementById('table').addEventListener('mousewheel', function (event) {
        event.preventDefault();
        return that.onMouseWheel(event);
      });

      that.updateLayout();

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

  $table: HTMLElement = null;
  $tbody = null;
  itemHeight = -1;
  processedItems = {};
  yPosition = 0;
  totalItems: any[] = [];
  $scrollbar = document.getElementById('scrollbar');

  updateLayout() {

    this.$table = document.getElementById('table');
    this.$tbody = document.getElementById('tbody');

    if (this.data.length > 0) {

      var height = this.$table.scrollHeight;

      // this.$tbody.detach();

      var i = -1;
      var startPosition = Math.ceil(this.yPosition / this.itemHeight);
      var offset = -(this.yPosition % this.itemHeight);

      // this.setItemPosition(this.$tbody, 0, -this.yPosition);
      this.processedItems = {};

      while (((i) * this.itemHeight) < 2 * (height + (2 * this.itemHeight))) {

        var index = Math.max(startPosition + i, 0);
        index = Math.min(index, this.data.length);

        var item = this.getItemAtIndex(index);
        this.totalItems.push(item);

        this.processedItems[index.toString()] = item;
        // this.setItemPosition(item, 0, ((startPosition + i) * this.itemHeight));

        //if not attached
        if (item.parentElement === null) {
          this.$tbody.append(item);

          if (this.itemHeight <= 0) {
            this.$table.append(this.$tbody);
            this.itemHeight = item.scrollHeight;
            this.updateLayout();
            return;
          }
        }
        i++;
      }

      // this.cleanupListItems(true);
      // if ( ignoreScrollbar !== true ) {
      this.updateScrollBar();
      // }
      // this.$scrollbar.before(this.$tbody);
    }
  }

  SCROLLBAR_BORDER = 1;
  SCROLLBAR_MIN_SIZE = 10;

  updateScrollBar() {
    var height = this.$table.clientHeight;
    var maxScrollbarHeight = this.$table.clientHeight - (2 * this.SCROLLBAR_BORDER);
    var maxItemsHeight = (this.data.length) * this.itemHeight;
    var targetHeight = Math.min(maxScrollbarHeight / maxItemsHeight, 1) * maxScrollbarHeight;
    var actualHeight = Math.max(targetHeight, this.SCROLLBAR_MIN_SIZE);

    var scrollPosition = this.SCROLLBAR_BORDER + ((this.yPosition / (maxItemsHeight - height)) * (maxScrollbarHeight - actualHeight));
    if (scrollPosition < this.SCROLLBAR_BORDER) {

      actualHeight = Math.max(actualHeight + scrollPosition, 0);
      scrollPosition = this.SCROLLBAR_BORDER;
    }
    else if (scrollPosition > (height - actualHeight)) {
      actualHeight = Math.min(actualHeight, (height - (scrollPosition + this.SCROLLBAR_BORDER)));
    }

    // this.$scrollbar.height(actualHeight);
    var parent = document.getElementById('scrollbar').parentElement;

    if ((this.data.length * this.itemHeight) <= this.$table.clientHeight) {
      if (parent) {
        this.$scrollbar.remove();
      }
    }
    else {
      if (parent) {
        this.$table.append(this.$scrollbar);
      }
      document.getElementById('scrollbar').style.top = scrollPosition.toString();
    }

  }


  getItemAtIndex(i) {
    let listItems = this.data;
    var item;
    if (this.data === listItems) {
      item = document.createElement('tr');
      const td = document.createElement('td');
      td.innerHTML = listItems[i].columnA;
      item.appendChild(td);
    }
    else if (i !== undefined) {
      var iString = i.toString();

      if (listItems[iString] === null || listItems[iString] === undefined) {
        item = document.createElement('tr');
        listItems[iString] = item;
      }
      else {
        item = listItems[i];
      }
      if (i >= 0 && i < this.data.length) {
        var data = this.data[i];
        // var label = this.labelFunction ? this.labelFunction(data) : data.toString();
        // item.html(label);
      }
    }
    if (item !== null && item !== undefined) {
      // item.attr("list-index", i);
    }
    return item;
  }

  onMouseWheel(event) {
    // clearTimeout(this.cleanupTimeout);

    //only concerned about vertical scroll
    //scroll wheel logic from: https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
    var orgEvent = event;
    var delta = 0;

    // Old school scrollwheel delta
    if (orgEvent.wheelDelta) { delta = orgEvent.wheelDelta / 120; }
    if (orgEvent.detail) { delta = -orgEvent.detail / 3; }

    // Webkit
    if (orgEvent.wheelDeltaY !== undefined) { delta = orgEvent.wheelDeltaY / 120; }

    this.yPosition -= (delta * this.itemHeight);


    //limit the mouse wheel scroll area
    var maxPosition = ((this.data.length) * this.itemHeight) - this.$table.clientHeight;
    if (this.yPosition > maxPosition) {
      this.yPosition = maxPosition;
    }
    if (this.yPosition < 0) {
      this.yPosition = 0;
    }

    var self = this;
    this.updateLayout();
    // this.cleanupTimeout = setTimeout(function () { self.cleanupListItems(); }, 100);

    return false;
  }

}

function eq(index, trs) {
  if (index >= 0 && index < trs.length)
    return trs[index];
  else
    return -1;
}


