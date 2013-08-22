/*global define */
define([
    'bean',
    'knockout'],
    function (bean, ko) {
        'use strict';

        return function DataGridViewModel(spreadsheet){
            var self = this,
                headCellClass = 'datagrid-table-head-cell',
                bodyCellClass = 'datagrid-table-cell',
                numberCellClass = 'datagrid-table-cell cell-type-number',
                sortDirection = 0,
                selectedColumn;

            //knockout UI
            self.headers = ko.observableArray([]);
            self.rows = ko.observableArray([]);
            self.column = ko.observable(null);

            //setup cell objects
            var TableCell = function(text, value, column){
                this.text = text;
                this.value = value;
                this.column = column;
            };

            var HeadCell = function(text, value, column, css){
                this.base = TableCell;
                this.base(text, value, column);
                this.cellClass = css || headCellClass;

                //expose sort column to the UI
                this.sortColumn = function(data){

                    if(selectedColumn != column){
                        sortDirection = 0;
                        selectedColumn = column;
                    } else {
                        sortDirection++;
                    }

                    self.rows.sort(function(a,b) {
                        var aValue, bValue;
                        if(sortDirection % 2 === 0){
                            aValue = a[column].getValue(),
                            bValue = b[column].getValue();
                        } else {
                            aValue = b[column].getValue(),
                            bValue = a[column].getValue();
                        }
                        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                        if (aValue > bValue) {
                            return 1;
                        } else if (aValue < bValue) {
                            return -1;
                        } else {
                            // a must be equal to b
                            return 0;
                        }
                    });
                };
            };

            var BodyCell = function(text, value, column, css){
                this.base = TableCell;
                this.base(text, value, column);
                this.cellClass = css || bodyCellClass;
            };

            var NumericalCell = function(text, value, column){
                var cell = this,
                    firstSymbol = text.charAt(0),
                    lastSymbol = text.slice(-1),
                    cellclass = function(){
                        if(isNaN(lastSymbol)){
                            return (parseFloat(value) >= 0) ? numberCellClass + ' positive' : numberCellClass + ' negative';
                        } else{
                            return numberCellClass;
                        }
                    },
                    formatNumber = function(){
                        var addCommas = function(value) {
                            //http://stackoverflow.com/a/2901298/542369
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        };
                        if(isNaN(lastSymbol)) {
                            return addCommas(parseFloat(text.split(lastSymbol)[0]).toFixed(2)) + lastSymbol;
                        } else if(isNaN(firstSymbol)) {
                            return firstSymbol + addCommas(parseFloat(text.split(firstSymbol)[1]).toFixed(2));
                        } else {
                            return addCommas(parseFloat(text).toFixed(2));
                        }
                    };
                this.base = BodyCell;
                this.base(formatNumber(), value, column, cellclass());
            };

            //setup the prototype chain
            HeadCell.prototype = new TableCell;
            BodyCell.prototype = new TableCell;
            //save some memory when sorting lots of items
            BodyCell.prototype.getValue = function(){
                if(isNaN(this.value)){
                    return this.value;
                } else{
                    return parseFloat(this.value);
                }
            };
            NumericalCell.prototype = new BodyCell;

            //setup table rows and cells
            var setRows = function setRows(feed){
                var rowsArray = [],
                    headersArray = [];

                //go over each cell and determine where to put it
                feed.entry.forEach(function(cell, index){
                    var cellRow = cell.gs$cell.row,
                        cellCol = cell.gs$cell.col-=1;
                    //if cellRow is 1 then must be the header (first row)
                    if(cellRow == '1') {
                        headersArray[cellCol] = new HeadCell(cell.gs$cell.$t, false, cellCol);
                    } else {
                        //fix the column header text alignment
                        if(cellRow == '2'){
                            if(cell.gs$cell.numericValue){
                                headersArray[cellCol].cellClass = headCellClass + ' numerical';
                            }
                        }
                        //rejig the index as google spreadsheets starts from 1 & we removed 1 row for the header
                        cellRow-=2;
                        //create a row if it doesnt already exist
                        if(!rowsArray[cellRow]) {
                            rowsArray[cellRow] = [];
                        }
                        //push the cell into the row
                        rowsArray[cellRow][cellCol] = setGridCell(cell);
                    }
                });

                //once the custom arrays are built, populate the UI in one go.
                self.headers(headersArray);
                self.rows(rowsArray);

                bindEvents();
            };

            //determine if the cell is numerical or text
            var setGridCell = function setGridCell(cell){
                if(cell.gs$cell.numericValue){
                    return new NumericalCell(cell.gs$cell.$t, cell.gs$cell.numericValue, cell.gs$cell.col);
                } else {
                    return new BodyCell(cell.gs$cell.$t, cell.gs$cell.$t, cell.gs$cell.col);
                }
            };

            //use event bubbling to determine which column to highlight, courtesy of bean.
            var bindEvents = function bindEvents(){
                bean.on(document.getElementById('datagrid'), {
                    mouseover : function(event){
                        var cell = event.target,
                            column = cell.getAttribute('data-column');
                        if(self.column() !== column){
                            self.column(column);
                        };
                    },
                    mouseout : function(event){
                        self.column(null);
                    }
                });
            };

            if(spreadsheet){
                setRows(spreadsheet);
            }
        };
    }
);