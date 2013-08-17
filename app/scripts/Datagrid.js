/*global define */
define([
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'],
    function (reqwest, ko) {
        'use strict';

        return function DataGridViewModel(datasource){
            var self = this,
                rowCount, colCount, sort,
                GridCell = function(text, value, cellType){
                    this.text = text;
                    this.value = value ? value : text;
                    this.cellType = cellType ? cellType : 'text';
                },
                FloatingPointGridCell = function(text, value){
                    this.base = GridCell;
                    this.base(text, value, 'number');
                },
                GridRow = function(){
                    this.cells = [];
                    return this.cells;
                };

            FloatingPointGridCell.prototype = new GridCell;

            GridCell.prototype.getValue = function(column){
                return this.value;
            };

            //knockout UI
            self.headers = ko.observableArray([]);
            self.rows = ko.observableArray([]);

            var setRows = function setRows(cells){
                var rowsArray = [];
                //go over each cell and determine where to put it

                cells.forEach(function(cell, index){
                    var cellRow = cell.gs$cell.row,
                        cellCol = cell.gs$cell.col-=1;
                    //if its less then the column count, must be the header (first row)
                    if(cellRow == '1') {
                        self.headers.push({title: cell.gs$cell.$t, column : cellCol});
                    } else {
                        //create a row if it doesnt already exist
                        if(!rowsArray[cellRow]) {
                            rowsArray[cellRow] = new GridRow();
                        }
                        if(cell.gs$cell.col == 4){
                           console.log(cell.gs$cell.numericValue);
                        }
                        //push the cell into the row
                        rowsArray[cellRow][cellCol] = setCellType(cell);
                    }
                });

                //once the custom Array is built, populate the UI
                self.rows(rowsArray);
            };
            var setCellType = function(cell){
                var text = cell.gs$cell.$t,
                    numericValue = cell.gs$cell.numericValue;
                if(numericValue){
                    if(numericValue.match(/^[-+][0-9]+\.[0-9]+[eE][-+]?[0-9]+$/) || numericValue.match(/[-+][0-9]+\.[0-9]+$/) || numericValue.match(/^[-+]?[0-9]+\.[0-9]+$/)){

                        var value = parseFloat(numericValue).toFixed(2);
                        return new FloatingPointGridCell(text, value);
                    } else {
                        return new GridCell(text, parseInt(numericValue, 10));
                    }
                } else {
                    return new GridCell(text);
                }
            };

            self.sortRows = function sortRows(data){
                var column = data.column;

                self.rows.sort(function(a,b) {
                    var aValue = a[column].getValue(),
                        bValue = b[column].getValue();
                    if (aValue > bValue) {
                        return 1;
                    } else if (aValue < bValue) {
                        return -1;
                    } else {
                        // a must be equal to b
                        return 0;
                    }
                });

                if(sort == column){
                    self.rows.reverse();
                }
                sort = column;
            };

            //self invoke the ajax call, we need the data asap.
            (function getData(){
                reqwest({
                    url: datasource,
                    type: 'json',
                    method: 'get',
                    contentType: 'application/json',
                    crossOrigin: true,
                    withCredentials: false,
                    error: function (err) {
                        console.log(err);
                    },
                    success: function (response) {
                        rowCount = response.feed.gs$rowCount.$t;
                        colCount = response.feed.gs$colCount.$t;
                        setRows(response.feed.entry);
                    }
                });
            })();
        };
    }
);