var trendlines = function() {

    var trendlineToggle = $('#trendlineAction'),
        isDragging = false,
        trendlineCanvas;
    
    var calculateAll = function() {
    
        //if(!isDragging) { return; }
    
        var lines = [],
            head = null,
            notDigits = /[^\d]/g,
            percentExpr = /[\d\.]+%/;
            
        $('#trendlineContainer').children().each(function(i, elm) {
            var $elm = $(elm);
            if($elm.hasClass('pos') || $elm.hasClass('neg') || $elm.hasClass('unch')) {
                head = {
                    handles: [],
                    changeElm: null
                };
                
                lines.push(head);
                return;
            }
            
            if(head === null) {
                console.log('Element did not belong to a trendline:');
                console.log(elm);
                return;
            }
            
            if($elm.hasClass('trendlineHandle')) {
                var handle = {
                    element: $elm,
                    top: parseInt($elm.css('top').replace(notDigits, ''), 10),
                    left: parseInt($elm.css('left').replace(notDigits, ''), 10)
                };
                
                head.handles.push(handle);
                return;
            }
            
            if($elm.hasClass('trendChange')) {
                head.changeElm = $elm;
                return;
            }
            
            console.log('Element unrelated to trendline:');
            console.log(elm);
            
        });
        
        $.each(lines, function(i, l) {
            if(l.handles.length !== 2) {
                console.log('Handle count unexpected: ' + l.handles.length);
                return;
            }
            
            var rise = Math.abs(l.handles[0].top - l.handles[1].top),
                run = Math.abs(l.handles[0].left - l.handles[1].left);
                
            if(rise === 0 || run === 0) {
                return;
            }
            
            var gradient = (rise/run).toFixed(3);
                
            if(l.changeElm === null) {
                console.log('Change elm missing.');
                return;
            }
            
            var percent = percentExpr.exec(l.changeElm.text())[0];
            l.changeElm.text( percent + ' ' + gradient );
        });
    };
    
    var updateEvent = 'mousemove.trendline';
    var startEvent = 'mousedown.trendline';
    var endEvent = 'mouseup.trendline';
    
    //var startDrag = function() { isDragging = true; };
    var endDrag = function() { calculateAll(); /*isDragging = false;*/ };
    
    var init = function() {
        trendlineCanvas = $('#TrendLineCanvas');
        //trendlineCanvas.on(updateEvent, null, calculateAll);
        //trendlineCanvas.on(startEvent, null, startDrag);
        $(document).on(endEvent, null, endDrag);
        trendlineToggle.one('click', '*', dispose);
    };
    
    var dispose = function() {
        //trendlineCanvas.off(updateEvent, null, calculateAll);
        //trendlineCanvas.off(startEvent, null, startDrag);
        $(document).off(endEvent, null, endDrag);
        trendlineToggle.one('click', '*', init);
    };
    
    if(trendlineToggle.hasClass('checked')) {
        init();
    } else {
        trendlineToggle.one('click', '*', init);
    }
};

$(function() {

    trendlines();
    
});
