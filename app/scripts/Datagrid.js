/*global define */
define([
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'
    ],
    function (reqwest, ko) {
        'use strict';

        return function DataGridViewModel(datasource){
            var self = this,
                rowCount, colCount;
            
            //knockout UI
            self.headers = [];
            self.rows = ko.observableArray([]);
            
            var DataGridCell = function(cell){
                //only store the data we're going to work with
                this.text = cell.$t;
                this.column = cell.col;
                if(cell.numericValue){
                    this.numericValue = cell.numericValue;
                }
            };
            
            var DataGridRow = function(){};
    
            DataGridRow.prototype.getValue = function(column){
                var cell = this[column],
                    numericValue = cell.numericValue;
                // determine if the cell is numeric
                if(numericValue){
                    //is it a floating point integer? (regex stolen from elsewhere)
                    if(numericValue.match(/^[-+]?[0-9]+\.[0-9]+$/)){
                        return parseFloat(numericValue);
                    } else{
                        return parseInt(numericValue, 10);
                    } 
                } else {
                    //must be a string
                    return cell.text;
                }
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

            var setRows = function(cells){
                var rowsArray = [];
                //go over each cell and determine where to put it
                cells.forEach(function(cell, index){
                    //if its less then the column count, must be the header (first row)
                    if(index < colCount) {
                        self.headers.push({title: cell.$t, column : cell.col});
                    } else {
                        //create a row if it doesnt already exist
                        if(!rowsArray[cell.row].length) {                        
                            rowsArray.push(new DataGridRow());
                        }
                        //push the cell into the row
                        rowsArray[cell.row][cell.col] = new DataGridCell(cell);
                    }    
                });
                //once the custom Array is built, populate the UI
                self.rows(rowsArray);
            };

            self.sortRows = function(){
                self.rows.sort(function(a,b) {
                    if (a > b) {
                        return 1;
                    } else if (a < b) {
                        return -1;
                    } else {
                        // a must be equal to b
                        return 0;
                    }
                });
            };
        };
    }
);