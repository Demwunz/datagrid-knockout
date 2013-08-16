/*global define */
define([
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'
    ],
    function (reqwest, ko) {
        'use strict';

        var DataGridCell = function(cell){
            var self = this;
            //only store the data we're going to work with
            self.text = cell.$t;
            self.column = cell.col;
            if(cell.numericValue){
                self.numericValue = cell.numericValue;
            }
        };

        DataGridCell.prototype.getValue = function(){
            // determine if the cell is numeric
            if(this.numericValue){
                //is it a floating point integer? (regex stolen from elsewhere)
                if(this.numericValue.match(/^[-+]?[0-9]+\.[0-9]+$/)){
                    return parseFloat(this.numericValue);
                } else{
                    return parseInt(this.numericValue, 10);
                } 
            } else {
                //must be a string
                return this.text;
            }
        };

        var DataGridViewModel = function(datasource){
            var self = this,
                rowCount, colCount;
            
            self.headers = [];
            self.rows = ko.observableArray([]);
            
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
                        rowCount = parseInt(response.feed.gs$rowCount.$t),
                        colCount = parseInt(response.feed.gs$colCount.$t);
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
                            rowsArray.push([]);
                        }
                        //push the cell into the array
                        rowsArray[cell.row].push(new DataGridCell(cell));
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
        return DataGridViewModel;
    }
);