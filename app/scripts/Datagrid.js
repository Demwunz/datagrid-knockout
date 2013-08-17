/*global define */
define([
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'],
    function (reqwest, ko) {
        'use strict';

        return function DataGridViewModel(datasource){
            var self = this,
                sort;

            //knockout UI
            self.headers = ko.observableArray([]);
            self.rows = ko.observableArray([]);
            self.column = ko.observable(null);

            var GridRow = function(){
                    this.cells = [];
                    return this.cells;
                },
                GridCell = function(text, value, column){
                    this.text = text;
                    this.value = value,
                    this.column = column;
                },
                TextCell = function(text, value, column){
                    this.base = GridCell;
                    this.base(text, value, column);
                },
                NumericCell = function(text, value, column){
                    this.base = GridCell;
                    this.base(text, value, column);
                },
                NumericSpecialCell = function(text, value, column){
                    this.base = NumericCell;
                    this.base(text, value, column);
                };

            TextCell.prototype = new GridCell;
            NumericCell.prototype = new GridCell;
            NumericSpecialCell.prototype = new NumericCell;

            GridCell.prototype.getNumericSpecialType = function(){
                if(this instanceof NumericSpecialCell){
                    if(parseFloat(this.value) > 0){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };

            GridCell.prototype.getCellType = function(){
                return this instanceof NumericCell;
            };

            GridCell.prototype.getCellType = function(){
                return this instanceof NumericCell;
            };

            GridCell.prototype.enableColumn = function(){
                console.log('over');
                return self.column(this.column);
            };

            GridCell.prototype.disableColumn = function(){
                console.log('out');
                return self.column(0);
            };

            //get the data asap
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
                        setRows(response.feed.entry);
                    }
                });
            })();

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
                        cellRow-=2;
                        //create a row if it doesnt already exist
                        if(!rowsArray[cellRow]) {
                            rowsArray[cellRow] = new GridRow();
                        }
                        //push the cell into the row
                        rowsArray[cellRow][cellCol] = setGridCell(cell);
                    }
                });

                //once the custom Array is built, populate the UI
                self.rows(rowsArray);
            };

            var setGridCell = function setGridCell(cell){
                var text = cell.gs$cell.$t,
                    column = cell.gs$cell.col,
                    numeric = cell.gs$cell.numericValue,
                    value = numeric ? parseFloat(numeric) : text;

                if(numeric){
                    if(text.indexOf('%') != -1){
                        return new NumericSpecialCell(text, value, column);
                    } else {
                        return new NumericCell(text, value, column);
                    }
                } else {
                    return new GridCell(text, value, column);
                }
            };

            self.sortRows = function sortRows(data){
                var column = data.column;

                self.rows.sort(function(a,b) {
                    var aValue = a[column].value,
                        bValue = b[column].value;
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
        };
    }
);