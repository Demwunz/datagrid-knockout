define(['module',
        'knockout',
        'reqwest',
        'DataGrid'],
    function (module, ko, reqwest, DataGridViewModel) {
        'use strict';

        var DataProvider = function(){
            reqwest({
                url: module.config().source,
                type: 'json',
                method: 'get',
                contentType: 'application/json',
                crossOrigin: true,
                withCredentials: false,
                error: function (err) {
                    console.log(err);
                },
                success: function (response) {
                    ko.applyBindings(new DataGridViewModel(response.feed));
                }
            });
        };

        return DataProvider;
    }
);