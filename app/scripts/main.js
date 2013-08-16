require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest',
        reqwest : '../bower_components/reqwest/reqwest.min'
    }
});

require(['dataGrid','knockout','reqwest'], function (DataGridViewModel, ko, reqwest) {
    'use strict';
    var __DATASOURCE_LIST = 'https://spreadsheets.google.com/feeds/list/0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc/od6/public/values?alt=json';
    var __DATASOURCE_CELLS = 'https://spreadsheets.google.com/feeds/cells/0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc/od6/public/values?alt=json';
    var dataGrid = new DataGridViewModel(__DATASOURCE_LIST);

    ko.applyBindings(dataGrid, document.getElementById('datagrid'));
});