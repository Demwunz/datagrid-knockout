define(['TableCell'],
    function (TableCell) {
        'use strict';

        var HeadCell = function(text, value, column, css){
            this.base = TableCell;
            this.base(text, value, column);
            this.cellClass = css || 'datagrid-table-head-cell';
        };

        HeadCell.prototype = new TableCell;

        return HeadCell;
    }
);