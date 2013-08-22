/*global define */
define(['bean',
        'knockout',
        'TableCell',
        'HeadCell',
        'BodyCell',
        'NumericalCell'],
    function (bean, ko, TableCell, HeadCell, BodyCell, NumericalCell) {
        'use strict';

        return function DataGridViewModel(feed){
            var self = this,
                entries = feed.entry,
                rowsArray = [],
                sortDirection = 0;

            //knockout UI
            self.headers = ko.observableArray([]);
            self.rows = ko.observableArray([]);
            self.column = ko.observable(null);
            self.sortColumn = function(){

                self.rows.sort(function(a,b) {
                    var aValue, bValue;
                    if(sortDirection % 2 === 0){
                        aValue = a[self.column()].getValue(),
                        bValue = b[self.column()].getValue();
                    } else {
                        aValue = b[self.column()].getValue(),
                        bValue = a[self.column()].getValue();
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

                sortDirection++;
            };

            //setup table rows and cells
            var setRows = function setRows(){
                var headersArray = [];
                //go over each cell and determine where to put it
                entries.forEach(function(cell, index){
                    var cellRow = cell.gs$cell.row,
                        cellCol = cell.gs$cell.col-=1;
                    //if cellRow is 1 then must be the header (first row)
                    if(cellRow == '1') {
                        headersArray[cellCol] = new HeadCell(cell.gs$cell.$t, false, cellCol);
                    } else {
                        //fix the column header text alignment
                        if(cellRow == '2'){
                            if(cell.gs$cell.numericValue){
                                headersArray[cellCol].cellClass = 'datagrid-table-head-cell numerical';
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

                document.getElementById('datagrid-container').removeChild(document.getElementById('loader'));
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

            setRows();
        };
    }
);