define(['DataGrid'], function (DataGrid) {
        'use strict';

        var TableCell = function(text, value, column){
            this.text = text;
            this.value = value;
            this.column = column;
        };

        return TableCell;
    }
);