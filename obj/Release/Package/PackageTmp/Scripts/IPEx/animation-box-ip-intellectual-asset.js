// global variables
var firstAnimation = true;
var duration = 0;

// default box variables
var defaultWidth = 141;
var defaultHeight = 141;
var defaultGapLeft = 20;
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


var $parent = $('.animation-box');
var $form = $('.animation-box form');
var $item = $('.animation-box--item');
var $list = $('.ipIntellectualAssets-list');
var $itemThis = $('.animation-box--item.inactive');

$parent.height(defaultHeight * 2 + inactiveGapTop)
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
$('.animation-box--item').on('click', function (e) {
    var $this = $(this);
    if ($this.hasClass('active')) {
        $parent.height(defaultHeight * 2 + inactiveGapTop)
        $form.fadeOut(duration * 1000);
        $item.removeClass('active').removeClass('inactive');
        $this.children().removeClass('active')
        $('.nametag .tag').contents().filter(function () {
            return this.nodeType === 3;
        }).remove();
        $item.each(function (index, el) {
            $itemThis = $(this);
            if ($(el).find('.name').text() === 'Recommendations' || $(el).find('.name').text() === 'Recom-mendations') {
                $(el).find('.name').replaceWith('<div class="name">Recommendations</div>')
            }
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
        $($list).each(function (index, el) {
            if ($this.parent($parent).find($list).hasClass($this.find('.name').text()) && $this.index() === index + 1) {
                $(el).addClass('active')
            } else {
                $(el).removeClass('active')
                $(el).find('.list-group-item').removeClass('active')
            }
        })
        $('.nametag .tag').replaceWith($('<span class="tag"> - ' + $this.find('.name').text() + '</span>'))
        if ($this.find('.name').text() === 'Recommendations' || $this.find('.name').text() === 'Recom-mendations') {
            $this.find('.name').replaceWith('<div class="name">Recommendations</div>')
            $('.nametag .tag').replaceWith($('<span class="tag"> - Recs</span>'))
        }
        $form.fadeIn(duration * 1000);
        $this.addClass('active').removeClass('inactive');
        $item.not($this).addClass('inactive').removeClass('active');
        $this.children().addClass('active')
        $item.not($this).children().removeClass('active')

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
});

function ResetHeightForm() {
    // loop inactive box
    $('.animation-box--item.inactive').each(function (index, el) {
        $itemThis = $(this);
        if ($(el).find('.name').text() === 'Recommendations') {
            $(el).find('.name').replaceWith('<div class="name">Recom-mendations</div>')
        }
        //gsap.to($parent, {
        //    height:
        //        $form.innerHeight() + 100,
        //});
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