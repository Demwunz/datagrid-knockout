/*global define */
define([
    'bean',
    'reqwest',
    'knockout'],
    function (bean, reqwest, ko) {
        'use strict';

        return function DataGridViewModel(datasource){
            var self = this,
                sort;

            //knockout UI
            self.headers = ko.observableArray([]);
            self.rows = ko.observableArray([]);
            self.column = ko.observable(null);

            var GridCell = function(text, value, column){
                    this.text = text;
                    this.value = value,
                    this.column = column;
                };

            GridCell.prototype.setFormattedText = function(){
                var cell = this,
                    text = cell.text,
                    firstSymbol = text.charAt(0),
                    lastSymbol = text.slice(-1),
                    addCommas = function(value) {
                        //http://stackoverflow.com/a/2901298/542369
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    };

                if(!isNaN(cell.value)) {
                    if(isNaN(lastSymbol)) {
                        return addCommas(parseFloat(text.split(lastSymbol)[0]).toFixed(2)) + lastSymbol;
                    } else if(isNaN(firstSymbol)) {
                        return firstSymbol + addCommas(parseFloat(text.split(firstSymbol)[1]).toFixed(2));
                    } else {
                        return addCommas(parseFloat(text).toFixed(2));
                    }
                } else {
                    return text;
                }
            };

            GridCell.prototype.setCellClass = function(){
                var cell = this,
                    classes = ['datagrid-table-cell'];
                if(!isNaN(cell.value)){
                    classes.push('cell-type-number');
                    if(isNaN(cell.text.slice(-1))){
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
                var rowsArray = [],
                    headersArray = [];
                //go over each cell and determine where to put it

                cells.forEach(function(cell, index){
                    var cellRow = cell.gs$cell.row,
                        cellCol = cell.gs$cell.col-=1;
                    //if its less then the column count, must be the header (first row)
                    if(cellRow == '1') {
                        headersArray.push({title: cell.gs$cell.$t, column : cellCol, numerical : false});
                    } else {
                        //fixed the column header alignment
                        if(cellRow == '2'){
                            if(cell.gs$cell.numericValue){
                                headersArray[cellCol].numerical = true;
                            }
                        }
                        //rejig the index, don't need empty cells
                        cellRow-=2;
                        //create a row if it doesnt already exist
                        if(!rowsArray[cellRow]) {
                            rowsArray[cellRow] = [];
                        }
                        //push the cell into the row
                        rowsArray[cellRow][cellCol] = setGridCell(cell);
                    }
                });

                //once the custom Array is built, populate the UI
                self.headers(headersArray);
                self.rows(rowsArray);
            };

            var setGridCell = function setGridCell(cell){
                var value = cell.gs$cell.numericValue ? parseFloat(cell.gs$cell.numericValue) : cell.gs$cell.$t;
                return new GridCell(cell.gs$cell.$t, value, cell.gs$cell.col);
            };

            self.sortColumn = function sortColumn(data){
                var column = data.column;
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
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