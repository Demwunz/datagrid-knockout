define(['TableCell'],
    function (TableCell) {
        'use strict';

        var BodyCell = function(text, value, column, css){
            this.base = TableCell;
            this.base(text, value, column);
            this.isFiltered = false;
            this.cellClass = css || 'datagrid-table-cell';
        };

        BodyCell.prototype = new TableCell;

        BodyCell.prototype.getValue = function(){
            if(isNaN(this.value)){
                return this.value;
            } else{
                return parseFloat(this.value);
            }
        };

        return BodyCell;
    }
);