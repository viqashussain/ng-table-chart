import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'lib-ng-table-chart',
  templateUrl: 'ng-table-CharacterData.component.html',
  styleUrls: ['ng-table-CharacterData.component.scss']
})
export class NgTableChartComponent implements OnInit {

  constructor() { }

  table;

  isMouseDown = false;
  startRowIndex = null;
  startCellIndex = null;

  ngOnInit() {

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
            this.selectTo(cell);
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
          // this.selectTo($(this));
        });
      });
      //   .mouseover(function() {
      //   if (!this.isMouseDown) return;
      //   that.table.find(".selected").removeClass("selected");
      //   // this.selectTo($(this));
      // })
      //   .bind("selectstart", function() {
      //   return false;
      // });


    });


    // $(document).mouseup(function() {
    //   this.isMouseDown = false;
    // });

    document.addEventListener('mouseup', e => {
      this.isMouseDown = false;
    });

    // console.log(that.table.querySelectorAll('td'))

  }

  selectTo(cell) {
    console.log('selectTo')

    var row = cell.parentNode;
    var cellIndex = cell.cellIndex;
    var rowIndex = cell.parentNode.rowIndex;

    console.log(cellIndex)
    console.log(rowIndex)

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


    for (var i = rowStart; i <= rowEnd; i++) {
      var rowCells = eq(i, this.table.querySelectorAll("tr")).querySelectorAll("td");
      console.log(rowCells)
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


