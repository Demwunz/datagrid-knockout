require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest'
    }
});

require(['datagrid', 'knockout'], function (Datagrid, ko) {
    'use strict';
    var dataGrid = new Datagrid();
});