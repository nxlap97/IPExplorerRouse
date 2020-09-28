
// global variables
var firstAnimation = true;
var duration = 0.2;

// default box variables
var defaultWidth = 141;
var defaultHeight = 141;
var defaultGapLeft = 19;
var defaultGapTop = 20;
var defaultRadius = 25;
var defaultItemsPerRow = 2;

// active box variables
var activeWidth = 300;
var activeHeight = 50;
var activeRadius = 10;

// inactive box variables
var inactiveWidth = 88;
var inactiveHeight = 88;
var inactiveGapLeft = 19;
var inactiveGapTop = 20;
var inactiveRadius = 15;
var inactiveItemsPerRow = 3;

var oLeft = $('.animation-box').offset().left;

var $form = $('.animation-box form');
var $parent = $('.animation-box');
var $itemThis = $('.animation-box--item.inactive');
var $item = $('.animation-box--item');
var heightForm = $form.innerHeight()

$parent.height(defaultHeight * 2 + inactiveGapTop)
$('.animation-box--item').on('click', function (e) {
    var $this = $(this);
    if ($this.hasClass('active')) {
        // $form.fadeOut(duration * 1000, function () {
        //     $(this).css('height', 0);
        // });
        // $parent.height($item.innerHeight() * 2)
        // $parent.css({ height: $item.innerHeight() * 2 })
        $parent.height(defaultHeight * 2 + inactiveGapTop)
        $form.fadeOut(duration * 1000);
        $item.removeClass('active').removeClass('inactive');
        $item.children().removeClass('active').removeClass('inactive');
        $item.each(function (index, el) {
            $itemThis = $(this);
            gsap.to($itemThis, {
                width: defaultWidth,
                height: defaultHeight,
                top: (defaultWidth + defaultGapLeft) * (index % defaultItemsPerRow),
                left: Math.floor(index / defaultItemsPerRow) * (
                    defaultGapTop + defaultHeight),
                borderRadius: defaultRadius,
                duration: duration
            });
        });
    } else {
        // height 200px test, actually height auto
        $form.fadeIn(duration * 1000);
        // $form.show().parent('.animation-box').css('height', $form.innerHeight() + $('.btn-circle').innerHeight() + inactiveHeight).fadeIn(duration * 1000);
        $this.addClass('active').removeClass('inactive');
        $this.children().addClass('active');
        $item.not($this).addClass('inactive').removeClass('active');

        if (firstAnimation) {
            $parentX = $parent.offset().top;
            $parentY = $parent.offset().left;
            $x = $this.offset().top;
            $y = $this.offset().left;
            $transaleX = $parentX - $x;
            $transaleY = $parentY - $y;
        } else {
            $transaleX = 0;
            $transaleY = 0;
        }

        gsap.to($this, {
            top: 0,
            left: 0,
            width: activeWidth,
            height: activeHeight,
            borderRadius: activeRadius,
            duration: duration
        });

        ResetHeightForm();
        firstAnimation = false;
    }
    setTimeout(function () {
        calcPositionTooltips();
        ResetHeightForm();
    }, duration * 1000);
});

// tooltip animation

function calcPositionTooltips() {
    $('.animation-box--tooltip-icon').each(function () {
        var $this = $(this);
        var tooltip = $this.data('tooltip');
        var $tooltipContent = $('.tooltip-box[data-tooltip=' + tooltip + '] .tooltip-box--content');
        var thisWidth = $this.outerWidth();
        var thisHeight = $this.outerHeight();
        var top = $this.offset().top;
        var left = $this.offset().left;
        var height = $tooltipContent.attr('data-height');
        var sTop = top - height;
        $tooltipContent.css({
            'top': sTop,
            'left': oLeft
        });
        $tooltipContent.attr('data-top', sTop);
        $tooltipContent.attr('data-left', oLeft);

    });
}

$('.tooltip-box--content').each(function () {
    var $this = $(this);
    var height = $this.outerHeight();
    var width = $this.outerWidth();
    $this.attr('data-width', width);
    $this.attr('data-height', height);
    $this.css({
        'width': width,
        'height': height
    });
});

calcPositionTooltips();

// $(window).on("resize", function () {
//     calcPositionTooltips();
// }).resize();

$('.animation-box--tooltip-icon').on('click', function (e) {
    $this = $(this);
    var tooltip = $this.data('tooltip');
    var $tooltipContent = $('.tooltip-box[data-tooltip=' + tooltip + '] .tooltip-box--content');
    e.preventDefault();
    e.stopPropagation();
    var thisTop = $this.offset().top;
    var thisLeft = $this.offset().left;
    var thisWidth = $this.outerWidth();
    var thisHeight = $this.outerHeight();
    thisTop = thisTop + thisHeight / 2;
    thisLeft = thisLeft + thisWidth / 2;

    if ($this.hasClass('open')) {
        $this.removeClass('open');


        gsap.to($($tooltipContent), {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            top: thisTop,
            left: thisLeft,
            padding: 0,
            duration: duration
        });

    } else {
        $this.addClass('open');
        $('.tooltip-box[data-tooltip=' + tooltip + ']').css({
            'overflow': 'initial'
        });

        $tooltipContent.css({
            'top': thisTop,
            'left': thisLeft,
            'width': 0,
            'height': 0,
            'overflow': 'hidden'
        });

        tooltipTop = $tooltipContent.attr('data-top');
        tooltipLeft = $tooltipContent.attr('data-left');
        tooltipHeight = $tooltipContent.attr('data-height');
        tooltipWidth = $tooltipContent.attr('data-width');

        gsap.to($($tooltipContent), {
            x: 0,
            y: 0,
            width: tooltipWidth,
            height: tooltipHeight,
            top: tooltipTop,
            left: tooltipLeft,
            padding: "15px 19px",
            duration: duration
        });
    }

});

function addRowInput(value) {
    value = value ?? "";
    $form.children('.form-group').append('<div class="prefix-number-add"><input type="text" class="form-control txt-prefix-number" id="validationCustom03" value="' + value + '" placeholder="Prefix / Number" required></div>')
    ResetHeightForm()
    $('.animation-box--item.inactive').each(function (index, el) {
        $itemThis = $(this);
        gsap.to($itemThis, {
            width: inactiveWidth,
            height: inactiveHeight,
            left: (inactiveWidth + inactiveGapLeft) * (index % inactiveItemsPerRow),
            top: $form.innerHeight(),
            borderRadius: inactiveRadius,
            duration: duration
        });
    });
    setTimeout(function () {
        calcPositionTooltips();
    }, duration * 1000);
}


function ResetHeightForm() {
    // loop inactive box
    // console.log($form.innerHeight());
    $('.animation-box--item.inactive').each(function (index, el) {
        $itemThis = $(this);
        $itemThis.children().removeClass('active');
        // $parent.height($form.innerHeight()+$itemThis.innerHeight())
        gsap.to($itemThis, {
            width: inactiveWidth,
            height: inactiveHeight,
            left: (inactiveWidth + inactiveGapLeft) * (index % inactiveItemsPerRow),
            top: $form.innerHeight(),
            borderRadius: inactiveRadius,
            duration: duration
        });
        $parent.height($form.innerHeight() + inactiveHeight)
    });
}