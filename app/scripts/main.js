require.config({
    paths: {
        knockout : 'knockout',
        reqwest : 'reqwest.min',
        bean : 'bean.min'
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
