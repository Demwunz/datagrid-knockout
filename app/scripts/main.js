require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest',
        reqwest : '../bower_components/reqwest/reqwest.min'
    }
});

require(['DataGrid','knockout'], function (DataGridViewModel, ko) {
    'use strict';
    var __SPREADSHEET = '0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc',
        __SHEET = 'od6',
        __DATASOURCE = 'https://spreadsheets.google.com/feeds/cells/' + __SPREADSHEET + '/' + __SHEET + '/public/values?alt=json';

    ko.applyBindings(new DataGridViewModel(__DATASOURCE), document.getElementById('datagrid'));
});