/*global define */
define([
    'reqwest',
    'knockout',
    'dataRow',
    'lib/knockout-delegatedEvents'
    ],
    function (reqwest, ko, DataRowViewModel) {
        'use strict';

        var DataGridViewModel = function(__DATASOURCE){
            var self = this,
                url = __DATASOURCE,
                lastUpdated,
                DataRow = DataRowViewModel,
                currentSort = 'ticker';

            self.rows = ko.observableArray([]);

            (function getData(){
                reqwest({
                    url: url,
                    type: 'json',
                    method: 'get',
                    contentType: 'application/json',
                    crossOrigin: true,
                    withCredentials: false,
                    error: function (err) {
                        console.log(err);
                    },
                    success: function (response) {
                        processResponse(response.feed);
                    }
                });
            })();

            var processResponse = function(response){
                var responseModifiedDate = response.updated.$t;
                if(responseModifiedDate != lastUpdated){
                    lastUpdated = responseModifiedDate;
                    updateData(response.entry);
                }
            };

            var updateData = function(entries){
                entries.forEach(function(entry){
                    self.rows.push(new DataRow(entry));
                });
            };

            self.sortRows = function(func){
                var sortColumn = function(){
                        self.rows.sort(function(a,b) {
                            var aValue = a[func](),
                                bValue = b[func]();
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

                if(currentSort == func){
                    sortColumn();
                    self.rows.reverse();
                } else{
                    currentSort = func;
                    sortColumn();
                }
            };

        };
        return DataGridViewModel;
    }
);