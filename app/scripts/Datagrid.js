/*global define */
define([
    'bean',
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'],
    function (bean, reqwest, ko) {
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
                };

            GridCell.prototype.getFormattedText = function(){
                var cell = this;
                return cell.text;
            }
            GridCell.prototype.getCellClass = function(){
                var cell = this,
                    classes = ['datagrid-table-cell'];
                if(!isNaN(cell.value)){
                    classes.push('cell-type-number');
                    if(cell.text.indexOf('%') != -1){
                        if(parseFloat(cell.value) >= 0){
                            classes.push('positive');
                        } else {
                            classes.push('negative');
                        }
                    }
                }
                return classes.join(' ');
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
                var value = cell.gs$cell.numericValue ? parseFloat(cell.gs$cell.numericValue) : cell.gs$cell.$t;
                return new GridCell(cell.gs$cell.$t, value, cell.gs$cell.col);
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