(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "FrozenCols": FrozenCols
    }
  });


  function FrozenCols(options) {
    var _grid;
    var _self = this;
    var _defaults = {
      container: '#myGrid',
      frozenBottom: false,
      frozenColumn: -1,
      frozenRow: -1
    };
    var canvasWidth, canvasWidthL, canvasWidthR;
    var headersWidth, headersWidthL, headersWidthR;
    var hasFrozenRows = false;
    var frozenRowsHeight = 0;
    var actualFrozenRow = -1;
    var paneTopH = 0;
    var paneBottomH = 0;
    var viewportTopH = 0;
    var viewportBottomH = 0;
    var topPanelH = 0;
    var headerRowH = 0;
    var viewportH = 0;
    var numVisisbleRows = 0;
    
    var $activeCanvasNode;
    var $activeViewportNode;
    var $paneHeaderL;
    var $paneHeaderR;
    var $paneTopL;
    var $paneTopR;
    var $paneBottomL;
    var $paneBottomR;

    var $headerScrollerL;
    var $headerScrollerR;

    var $headerL;
    var $headerR;

    var $headerRowScrollerL;
    var $headerRowScrollerR;

    var $headerRowL;
    var $headerRowR;

    var $topPanelScrollerL;
    var $topPanelScrollerR;

    var $topPanelL;
    var $topPanelR;

    var $viewportTopL;
    var $viewportTopR;
    var $viewportBottomL;
    var $viewportBottomR;

    var $canvasTopL;
    var $canvasTopR;
    var $canvasBottomL;
    var $canvasBottomR;

    var $viewportScrollContainerX;
    var $viewportScrollContainerY;
    var $headerScrollContainer;
    var $headerRowScrollContainer;

    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      $container = $(options.container);
      _grid = grid;
      _grid.setOptions(options);

      // Containers used for scrolling frozen columns and rows
      $paneHeaderL = $("<div class='slick-pane slick-pane-header slick-pane-left' tabIndex='0' />").appendTo($container);
      $paneHeaderR = $("<div class='slick-pane slick-pane-header slick-pane-right' tabIndex='0' />").appendTo($container);
      $paneTopL = $("<div class='slick-pane slick-pane-top slick-pane-left' tabIndex='0' />").appendTo($container);
      $paneTopR = $("<div class='slick-pane slick-pane-top slick-pane-right' tabIndex='0' />").appendTo($container);
      $paneBottomL = $("<div class='slick-pane slick-pane-bottom slick-pane-left' tabIndex='0' />").appendTo($container);
      $paneBottomR = $("<div class='slick-pane slick-pane-bottom slick-pane-right' tabIndex='0' />").appendTo($container);

      // Append the header scroller containers
      $headerScrollerL = $("<div class='ui-state-default slick-header slick-header-left' />").appendTo($paneHeaderL);
      $headerScrollerR = $("<div class='ui-state-default slick-header slick-header-right' />").appendTo($paneHeaderR);

      // Cache the header scroller containers
      $headerScroller = $().add($headerScrollerL).add($headerScrollerR);

      // Append the columnn containers to the headers
      $headerL = $("<div class='slick-header-columns slick-header-columns-left' style='left:-1000px' />").appendTo($headerScrollerL);
      $headerR = $("<div class='slick-header-columns slick-header-columns-right' style='left:-1000px' />").appendTo($headerScrollerR);

      // Cache the header columns
      $headers = $().add($headerL).add($headerR);

      $headerRowScrollerL = $("<div class='ui-state-default slick-headerrow' />").appendTo($paneTopL);
      $headerRowScrollerR = $("<div class='ui-state-default slick-headerrow' />").appendTo($paneTopR);

      $headerRowScroller = $().add($headerRowScrollerL).add($headerRowScrollerR);
      $headerRowL = $("<div class='slick-headerrow-columns slick-headerrow-columns-left' />").appendTo($headerRowScrollerL);
      $headerRowR = $("<div class='slick-headerrow-columns slick-headerrow-columns-right' />").appendTo($headerRowScrollerR);

      $headerRow = $().add($headerRowL).add($headerRowR);

      // Append the top panel scroller
      $topPanelScrollerL = $("<div class='ui-state-default slick-top-panel-scroller' />").appendTo($paneTopL);
      $topPanelScrollerR = $("<div class='ui-state-default slick-top-panel-scroller' />").appendTo($paneTopR);

      $topPanelScroller = $().add($topPanelScrollerL).add($topPanelScrollerR);

      // Append the top panel
      $topPanelL = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScrollerL);
      $topPanelR = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScrollerR);

      $topPanel = $().add($topPanelL).add($topPanelR);
      
      // Append the viewport containers
      $viewportTopL = $("<div class='slick-viewport slick-viewport-top slick-viewport-left' tabIndex='0' hideFocus />").appendTo($paneTopL);
      $viewportTopR = $("<div class='slick-viewport slick-viewport-top slick-viewport-right' tabIndex='0' hideFocus />").appendTo($paneTopR);
      $viewportBottomL = $("<div class='slick-viewport slick-viewport-bottom slick-viewport-left' tabIndex='0' hideFocus />").appendTo($paneBottomL);
      $viewportBottomR = $("<div class='slick-viewport slick-viewport-bottom slick-viewport-right' tabIndex='0' hideFocus />").appendTo($paneBottomR);

      // Cache the viewports
      $viewport = $().add($viewportTopL).add($viewportTopR).add($viewportBottomL).add($viewportBottomR);

      // Default the active viewport to the top left
      $activeViewportNode = $viewportTopL;

      // Append the canvas containers
      $canvasTopL = $("<div class='grid-canvas grid-canvas-top grid-canvas-left' tabIndex='0' hideFocus />").appendTo($viewportTopL);
      $canvasTopR = $("<div class='grid-canvas grid-canvas-top grid-canvas-right' tabIndex='0' hideFocus />").appendTo($viewportTopR);
      $canvasBottomL = $("<div class='grid-canvas grid-canvas-bottom grid-canvas-left' tabIndex='0' hideFocus />").appendTo($viewportBottomL);
      $canvasBottomR = $("<div class='grid-canvas grid-canvas-bottom grid-canvas-right' tabIndex='0' hideFocus />").appendTo($viewportBottomR);

      // Cache the canvases
      $canvas = $().add($canvasTopL).add($canvasTopR).add($canvasBottomL).add($canvasBottomR);

      // Default the active canvas to the top left
      $activeCanvasNode = $canvasTopL;

      getViewportWidth();
      getViewportHeight();
    }

    function destroy() {
    }

    function getViewportHeight() {
      if (options.autoHeight) {
        viewportH = options.rowHeight
          * ( getDataLength()
              + (options.enableAddRow ? 1 : 0)
            )
          + ( ( options.frozenColumn == -1 ) ? $headers.outerHeight() : 0 );
      } else {
        topPanelH = ( options.showTopPanel )
          ? options.topPanelHeight + getVBoxDelta($topPanelScroller)
          : 0;

        headerRowH = ( options.showHeaderRow )
          ? options.headerRowHeight + getVBoxDelta($headerRowScroller)
          : 0;

        viewportH = parseFloat($.css($container[0], "height", true))
          - parseFloat($.css($container[0], "paddingTop", true))
          - parseFloat($.css($container[0], "paddingBottom", true))
          - parseFloat($.css($headerScroller[0], "height"))
          - getVBoxDelta($headerScroller)
          - topPanelH
          - headerRowH;
      }

      numVisibleRows = Math.ceil( viewportH / options.rowHeight );
    }

    function getViewportWidth() {
      viewportW = parseFloat($.css($container[0], "width", true));
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);
