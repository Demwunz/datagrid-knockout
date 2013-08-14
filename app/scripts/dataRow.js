/*global define */
define([
    'knockout'
    ],
    function (ko) {
        'use strict';

        var DataGridRow = function(rowData){
            var self = this;
            self.hiliteClass = ko.observable(false);
            self.id = rowData.id.$t.split('/values/')[1];
            self.updated = rowData.updated.$t;
            self.ticker = rowData.gsx$ticker.$t;
            self.industry = rowData.gsx$industry.$t;
            self.marketcap = rowData.gsx$marketcap.$t;
            self.price = rowData.gsx$price.$t;
            self.change = rowData.gsx$change.$t;
            self.volume = rowData.gsx$volume.$t;

            self.getTicker = function(){
                return self.ticker;
            };
            self.getIndustry = function(){
                return self.industry;
            };
            self.getMarketcap = function(){
                return parseFloat(self.marketcap);
            };
            self.getPrice = function(){
                return parseFloat(self.price.split('£')[1]);
            };
            self.getChange = function(){
                return parseFloat(self.change.split('%')[0]);
            };
            self.getVolume = function(){
                return parseInt(self.volume, 10);
            };
            self.positiveChangeValue = function(){
                return this.getChange() >= 0;
            };
        };

        return DataGridRow;
    }
);