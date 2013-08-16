/*global define */
define([
    'reqwest',
    'knockout',
    'lib/knockout-delegatedEvents'
    ],
    function (reqwest, ko) {
        'use strict';
        var gsData, rowCount, colCount;

        var DataGridCell = function(data){
            var self = this;
            self.text = data.$t;
            self.column = data.column;
            if(data.numericValue){
                self.numericValue = data.numericValue;
            }
        };

        DataGridCell.prototype.getValue = function(){
            if(this.numericValue){
                 return parseFloat(this.numericValue);
            } else{
                return this.$t;
            }
        };

        var DataGridViewModel = function(__DATASOURCE){
            var self = this;

            self.headers = [];
            self.rows = [];

            (function getData(){
                reqwest({
                    url: __DATASOURCE,
                    type: 'json',
                    method: 'get',
                    contentType: 'application/json',
                    crossOrigin: true,
                    withCredentials: false,
                    error: function (err) {
                        console.log(err);
                    },
                    success: function (response) {
                        gsData = response.feed;
                        rowCount = parseInt(gsData.gs$rowCount.$t),
                        colCount = parseInt(gsData.gs$colCount.$t);
                        var row = {};
                        var rowCells = colCount;
                        var tbody = parseInt(rowCount - 1);
                        while(rowCells--){
                            row[rowCells + 1] = null;
                        };
                        while(tbody--){
                            self.rows.push(row);
                        };
                        createTable(gsData.entry);
                    }
                });
            })();

            var createTable = function(cells){
                cells.forEach(function(cell, index, array){
                    if(index < colCount){
                        self.headers.push(cell.gs$cell);
                    } else {
                        createRows(cell.gs$cell);
                    }
                });
            };

            var createRows = function(cell){
                console.log(self.rows[cell.row][cell.col]);
                // self.rows[cell.row][cell.col] = new DataGridCell(cell);
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