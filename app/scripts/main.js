require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        lodash : '../bower_components/lodash/lodash',
        knockout : '../bower_components/knockout/build/output/knockout-latest'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery', 'lodash', 'knockout'], function (app, $, _, ko) {
    'use strict';
    var dataGrid = new app();
    console.log('Running jQuery %s', $().jquery);
});