var trendlines = function() {

    var trendlineToggle = $('#trendlineAction'),
        trendlineCanvas;
    
    var calculateAll = function() {
    
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
        
        var gradients = [];
        var canvasWidth = trendlineCanvas.width();
        
        $.each(lines, function(i, l) {
            if(l.handles.length !== 2) {
                console.log('Handle count unexpected: ' + l.handles.length);
                return;
            }
            
            var left, right;
            if(l.handles[0].left < l.handles[1].left) {
                left = l.handles[0];
                right = l.handles[1];
            } else {
                left = l.handles[1];
                right = l.handles[0];
            }
            
            var rise = -(right.top - left.top),
                run = right.left - left.left;
                
            if(rise === 0 || run === 0) {
                return;
            }
            
            var gradient = rise/run;
            gradients.push(gradient);
                
            if(l.changeElm === null) {
                console.log('Change elm missing.');
                return;
            }
            
            var percent = percentExpr.exec(l.changeElm.text())[0];
            l.changeElm.text( percent + ' ' + gradient.toFixed(3) );
            l.changeElm.css('text-shadow', '#ccc 1px 1px 1px');
            l.changeElm.css('background-color', 'rgba(255,255,255,0.8)');
            l.changeElm.css('font-weight', 'bold');
            
            var changeElmPosn = l.changeElm.position();
            
            if(changeElmPosn.left > (canvasWidth * 0.85)) {
                l.changeElm.css('right', (canvasWidth - changeElmPosn.left) + 'px');
                l.changeElm.css('left', '');
                var changeElmTopOffset = gradient < 0 ? 25 : 40;
                l.changeElm.css('top', (changeElmPosn.top + changeElmTopOffset) + 'px');
            } else {
                l.changeElm.css('right', '');
            }
        });
        
        if(gradients.length > 0) {
            var gradientSum = gradients.reduce(function(sum, g) { return sum + g; }, 0);
            var gradientAvg = gradientSum / gradients.length;
            
            var $timeframes = $('#ul-timeframe-nav');
            var avgSpacer = $timeframes.find('.csp-spacer');
            if(avgSpacer.length === 0) {
                avgSpacer = $('<span>').addClass('spacer csp-spacer').text('|');
                $timeframes.append(avgSpacer);
            }
            
            var avgLi = $timeframes.find('.csp-avg-li');
            if(avgLi.length === 0) {
                avgLi = $('<li>').addClass('csp-avg-li').css('padding', '0 5px');
                $timeframes.append(avgLi);
            }
            
            avgLi.text('Avg Grad: ' + gradientAvg.toFixed(4));
        }
    };
    
    var calcEvent = 'mouseup.trendline';
    
    var init = function() {
        trendlineCanvas = $('#TrendLineCanvas');
        $(document).on(calcEvent, null, calculateAll);
        trendlineToggle.one('click', '*', dispose);
    };
    
    var dispose = function() {
        $(document).off(calcEvent, null, calculateAll);
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
