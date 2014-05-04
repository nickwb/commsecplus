var _ = require('underscore');

var trendlines = {};

var calcEvent = 'mouseup.trendline',
    $toggleTrendlines,
    $canvas,
    canvasWidth;
    
    
trendlines.init = function() {
    $toggleTrendlines = $('#trendlineAction');

    if($toggleTrendlines.hasClass('checked')) {
        onTrendlinesEnabled();
    } else {
        $toggleTrendlines.one('click', '*', onTrendlinesEnabled);
    }
};

function onTrendlinesEnabled() {
    $canvas = $('#TrendLineCanvas');
    canvasWidth = $canvas.width();
    $(document).on(calcEvent, null, calculateAllTrendlines);
    $toggleTrendlines.one('click', '*', onTrendlinesDisabled);
}

function onTrendlinesDisabled() {
    $(document).off(calcEvent, null, calculateAllTrendlines);
    $toggleTrendlines.one('click', '*', onTrendlinesEnabled);
}

function extractPositionFromCss($elm, prop) {
    var notDigits = /[^\d]/g;
    var digits = $elm.css(prop).replace(notDigits, '');
    return parseInt(digits, 10);
}

function Trendline() {
    this.handles = [];
    this.$changeLabel = null;
}

Trendline.prototype.sortHandles = function() {
    this.handles = _.sortBy(this.handles, function(h) { return h.left; });
};

Trendline.prototype.updateChangeLabel = function(gradient) {
    var lbl = this.$changeLabel;
    var percentExpr = /[\d\.]+%/;
    var percent = percentExpr.exec(lbl.text())[0];
    
    lbl.text( percent + ' ' + gradient.toFixed(3) );
    lbl.css('text-shadow', '#ccc 1px 1px 1px');
    lbl.css('background-color', 'rgba(255,255,255,0.8)');
    lbl.css('font-weight', 'bold');
    
    var posn = lbl.position();
    
    if(posn.left > (canvasWidth * 0.85)) {
        lbl.css('right', (canvasWidth - posn.left) + 'px');
        lbl.css('left', '');
        
        var topOffset = gradient < 0 ? 25 : 40;
        lbl.css('top', (posn.top + topOffset) + 'px');
    } else {
        lbl.css('right', '');
    }
};

Trendline.prototype.calculateGradient = function() {
    this.sortHandles();
    
    if(this.handles.length !== 2) {
        return null;
    }
    
    var h0 = this.handles[0],
        h1 = this.handles[1],
        rise = -(h1.top - h0.top),
        run = h1.left - h0.left;
        
    if(rise === 0 || run === 0) {
        return;
    }
    
    var gradient = rise/run;
    this.updateChangeLabel(gradient);
    
    return gradient;
};

function Handle($elm) {
    this.$elm = $elm;
    this.top = extractPositionFromCss($elm, 'top');
    this.left = extractPositionFromCss($elm, 'left');
}

function extractTrendlines() {

    var allTrendlines = [],
        currentTrendline = null;

    $('#trendlineContainer').children().each(function(i, elm) {
        var $elm = $(elm);
        
        if($elm.hasClass('pos') || $elm.hasClass('neg') || $elm.hasClass('unch')) {
            currentTrendline = new Trendline();
            allTrendlines.push(currentTrendline);
            return;
        }
        
        if(currentTrendline === null) {
            return;
        }
        
        if($elm.hasClass('trendlineHandle')) {
            currentTrendline.handles.push(new Handle($elm));
            return;
        }
        
        if($elm.hasClass('trendChange')) {
            currentTrendline.$changeLabel = $elm;
            return;
        }        
    });
    
    return allTrendlines;
}

function calculateAllTrendlines() {
    var lines = extractTrendlines(),
        gradients = _.map(lines, function(l) { return l.calculateGradient(); });
        
    
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
}

module.exports = trendlines;