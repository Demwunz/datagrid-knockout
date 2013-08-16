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
                var r = reqwest({
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
                                setTimeout(function () {
                                r.then(function (resp) {
                                        processResponse(response.feed);
                                    },
                                    function (err) { })
                                  .always(function (resp) {
                                    //
                                    getData();
                                  })
                              }, 3000)
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

            var hiliteRow = function(row){
                console.log(row);
                row.hiliteClass(!row.hiliteClass());
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