define(['BodyCell'],
    function (BodyCell) {
        'use strict';

        var NumericalCell = function(text, value, column){
            var cell = this,
                numberCellClass = 'datagrid-table-cell cell-type-number',
                firstSymbol = text.charAt(0),
                lastSymbol = text.slice(-1),
                cellclass = function(){
                    if(isNaN(lastSymbol)){
                        return (parseFloat(value) >= 0) ? numberCellClass + ' positive' : numberCellClass + ' negative';
                    } else{
                        return numberCellClass;
                    }
                },
                formatNumber = function(){
                    var addCommas = function(value) {
                        //http://stackoverflow.com/a/2901298/542369
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    };
                    if(isNaN(lastSymbol)) {
                        return addCommas(parseFloat(text.split(lastSymbol)[0]).toFixed(2)) + lastSymbol;
                    } else if(isNaN(firstSymbol)) {
                        return firstSymbol + addCommas(parseFloat(text.split(firstSymbol)[1]).toFixed(2));
                    } else {
                        return addCommas(parseFloat(text).toFixed(2));
                    }
                };
            this.base = BodyCell;
            this.base(formatNumber(), value, column, cellclass());
        };

        NumericalCell.prototype = new BodyCell;

        return NumericalCell;
    }
);