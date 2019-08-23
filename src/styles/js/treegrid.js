+function ($) {
    function loadTreeGrid() {
        $('.tree').treegrid({
            expanderExpandedClass: 'icon-dropdown-arrow',
            expanderCollapsedClass: 'icon-next-arrow',
            onCollapse: function () {
                const childs = $(this).treegrid('getChildNodes');

                $(this).removeClass('parentExpand');

                if (childs) {
                    $(childs).removeClass('childrenExpand');
                }
            },
            onExpand: function () {
                const childs = $(this).treegrid('getChildNodes');

                $(this).addClass('parentExpand');

                if (childs) {
                    $(childs).addClass('childrenExpand');
                }
            }
        });

        $('.tree.preventCollapse').treegrid({
            'initialState': 'expanded',
            expanderExpandedClass: '',
            expanderCollapsedClass: '',
            onCollapse: function () {
                $('.tree.preventCollapse').treegrid('expandAll');
            }
        });

        if($('.tree-node.tr-expand').length) {
            $('.tree-node.tr-expand').each(function () {
                if (!$(this).treegrid('isLeaf')) {
                    $(this).treegrid('expand');
                }
            });
        }

        if($('.tree-node.tr-collapse').length) {
            $('.tree-node.tr-collapse').each(function () {
                if (!$(this).treegrid('isLeaf')) {
                    $(this).treegrid('collapse');
                }
            });
        }
    }

    $(document)
        .ready(function () {
            loadTreeGrid();
        })
        .ajaxComplete(function () {
            loadTreeGrid();
        });
}(jQuery);