require.config({
    paths: {
        knockout : '../bower_components/knockout/build/output/knockout-latest',
        reqwest : '../bower_components/reqwest/reqwest.min',
        bean : '../bower_components/bean/bean.min'
    },
    config: {
        'DataProvider' : {
            source: 'https://spreadsheets.google.com/feeds/cells/0Akt_os3oK7whdHlVWDl5Rk5TMkJHaW5mRm9kYjJKLXc/od6/public/values?alt=json'
        }
    }
});

require(['DataProvider'], function (DataProvider) {
    'use strict';

        var DataGrid = new DataProvider();

});