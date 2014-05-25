/**
 * Vigram
 * @version : 1.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */


/**
 *
 * @param content
 * @returns {string}
 */
function getUrlFromInstagramMedia(content) {
    var start = content.indexOf('og:video" content="', 0);
    if (start == -1) {
        start = content.indexOf('og:image" content="', 0);
    }
    var end = content.indexOf('"', start + 19);
    return content.substring(start + 19, end);
}

/**
 *
 * @param content
 * @returns bool
 */
function getTypeFromInstagramMedia(content) {
    return content.indexOf('og:video" content="', 0) === -1;
}


/**
 *
 * @param content
 * @returns {string}
 */
function getRealImgFromInstagram(content) {
    var url = getUrlFromInstagramMedia(content);
    var is_pic = getTypeFromInstagramMedia(content);
    if (!is_pic) {
        url = url.replace("s3.amazonaws", "ak.instagram");
        url = url.replace("_6.", "_7.");
    }
    return url;
}

/**
 * Callback for Event Profile Instagram (Loading / NewNode)
 * @param $this
 */
var getFromInstagramProfile = function($this) {
    if (($this.hasClass('Vigram')))
        return;

    $this.addClass('Vigram');
    var urlToMedia = $this.find('a').first().attr('href');
    $.get(urlToMedia, function (content) {
        var url = getRealImgFromInstagram(content);
        var fName = url.split("/")[4];
        $('<a>', {class: "VigramProfileButton", href: url, download: fName})
            .append($("<img>", {class: "VigramEffect size25", src: image}))
            .appendTo($this);
    });

};

var getFromInstagramTimeline = function($this) {
    if ($this.hasClass('Vigram'))
        return;

    var url = $this.find('.Video').first().attr('src');
    if (typeof url == 'undefined')
        url = $this.find('.timelinePhoto').attr('src');
    $this.addClass('Vigram');
    if (typeof url != 'undefined') {
        var fName = url.split("/")[4];
        $this.find('.timelineLikeButton').after(
            $("<a>", {class: "timelineLikeButton", style: "background:none;", href: url, download: fName})
                .append($("<div>", {class: "Vcenter"})
                    .append($("<img>", {class: "size25", src: image}))
            )
        );
    }
};

var image = chrome.extension.getURL("medias/images/vigram_128.png");

/* Event when mouse enter or leave a pic/video block */
$('.photo-feed').on('mouseenter', '.photo', function () { $(this).find('.VigramEffect').css('width', '25px'); });
$('.photo-feed').on('mouseleave', '.photo', function () { $(this).find('.VigramEffect').css('width', '0'); });

/* Events Handlers. */
$('.photo-feed').ready(function () { $('.photo-wrapper').each(getFromInstagramProfile($(this))); });
$('.photo-feed').on('DOMNodeInserted', '.photo', function (e) { getFromInstagramProfile($(e.target).parent()); });

$('.timelineContainer').ready(function () { $('.timelineItem').each(function () { getFromInstagramTimeline($(this)); }); });
$('.timelineContainer').on('DOMNodeInserted', '.timelineItem', function (e) { getFromInstagramTimeline($(e.target)); });

/**
 * Event on Instagram's Modal
 */
$('body').on('click', function() {
    $('body').on('DOMNodeInserted', '.igDialogContent', function (e) {

        var $elem = $(e.target).find('.Image.iLoading.Frame').first();
        if ($elem.hasClass('Vigram'))
            return;

        var urlToMedia  = $elem.attr('src'),
            fName       = urlToMedia.split("/")[4];

        $elem.addClass('Vigram');

        $("<a>", {class: "VigramModal", style: "background:url("+image+")", href: urlToMedia, download: fName})
            .appendTo($elem);
    });
});

/**
 * Event pic/video page Instagram.
 */
$('.lbAnimation').ready(function () {
    $.get(null, function (content) {
        var url = getUrlFromInstagramMedia(content);
        if (typeof url === 'undefined')
            return;

        var fName = url.split("/")[3];
        if (typeof fName === 'undefined' || fName === 'profiles')
            return;

        var is_pic = getTypeFromInstagramMedia(content);
        var text_button = chrome.i18n.getMessage("dl_button_vid");
        if (is_pic)
            text_button = chrome.i18n.getMessage("dl_button_pic");

        $('.top-bar-actions').ready(function () {
            if (!($('#VigramSingleImg').length)) {
                var topBar = $('.top-bar-home').attr('id', '');
                topBar.children().attr('id', '');

                $("<li>", {id: "VigramSingleImg"})
                    .append($("<a>", {href: url, download: fName})
                        .append($("<span>", {class: "img-outset"})
                            .append($("<img>", {src: image}))
                        )
                        .append($("<strong>").text(text_button))
                    )
                    .appendTo($('.top-bar-actions').first());

                $('#VigramSingleImg').animate({ marginTop: '0px' }, 1500);
            }
        });
    });
});


/**
 * Event Vine. \o/
 */
$('.badges').ready(function () {
    var url = $('.vine-video-container').children().attr('src');
    if (typeof url === 'undefined')
        return;
    var splittedUrl = url.split('/')[5];
    var name = splittedUrl.substring(0, splittedUrl.indexOf('.'));

    if (!($('#VineButton').length)) {
        var info = $('.info');
        $("<div>", {class: "share-badge"})
            .append($("<a>", {id: "VineButton", href: url, download: name})
                .append($("<img>", {src: image})))
            .append($("<p>").text("Vigram"))
            .prependTo($('.badges'));
    }
});
