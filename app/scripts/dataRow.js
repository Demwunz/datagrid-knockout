/*global define */
define([
    'knockout'
    ],
    function (ko) {
        'use strict';

        var DataGridRow = function(rowData){
            var self = this;
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