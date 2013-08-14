require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest',
        reqwest : '../bower_components/reqwest/reqwest.min'
    }
});

require(['dataGrid','knockout','reqwest'], function (DataGrid, ko, reqwest) {
    'use strict';
    var __DATASOURCE = 'https://spreadsheets.google.com/feeds/list/0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc/od6/public/values?alt=json';
    var dataGrid = new DataGrid(__DATASOURCE);

    ko.applyBindings(dataGrid, document.getElementById('datagrid'));
});