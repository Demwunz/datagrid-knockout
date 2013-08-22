require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest',
        reqwest : '../bower_components/reqwest/reqwest.min',
        bean : '../bower_components/bean/bean.min'
    }
});

require(['DataGrid', 'knockout', 'reqwest'], function (DataGridViewModel, ko, reqwest) {
    'use strict';
    var __SPREADSHEET = '0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc',
        __SHEET = 'od6',
        __DATASOURCE = 'https://spreadsheets.google.com/feeds/cells/' + __SPREADSHEET + '/' + __SHEET + '/public/values?alt=json';

    var getSpreadsheet = (function getData(){
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
                    ko.applyBindings(new DataGridViewModel(response.feed), document.getElementById('dialog'));
                }
            });
        })();
});