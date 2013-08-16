/*global define */
define([
    'knockout'
    ],
    function (ko) {
        'use strict';

        var DataGridRow = function(rowData){
            var self = this;
            self.hiliteClass = ko.observable(false);
            self.id = rowData.id.$t;
            self.updated = rowData.updated.$t;
            self.ticker = rowData.gsx$ticker.$t;
            self.industry = rowData.gsx$industry.$t;
            self.marketcap = rowData.gsx$marketcap.$t;
            self.price = rowData.gsx$price.$t;
            self.change = rowData.gsx$change.$t;
            self.volume = rowData.gsx$volume.$t;
        };

        DataGridRow.prototype.getTicker = function(){
            return this.ticker;
        };
        DataGridRow.prototype.getIndustry = function(){
            return this.industry;
        };
        DataGridRow.prototype.getMarketcap = function(){
            return parseFloat(this.marketcap);
        };
        DataGridRow.prototype.getPrice = function(){
            return parseFloat(this.price.split('£')[1]);
        };
        DataGridRow.prototype.getChange = function(){
            return parseFloat(this.change.split('%')[0]);
        };
        DataGridRow.prototype.getVolume = function(){
            return parseInt(this.volume, 10);
        };
        DataGridRow.prototype.positiveChangeValue = function(){
            return this.getChange() >= 0;
        };

        return DataGridRow;
    }
);