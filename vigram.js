
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
    if (content.indexOf('og:video" content="', 0) === -1)
        return true;
    return false;
}

$(document).ready(function () {

    var image = chrome.extension.getURL("medias/images/vigram_128.png");

    var getRealImgFromInstagram = (function (content) {
        var url = getUrlFromInstagramMedia(content);
        var is_pic = getTypeFromInstagramMedia(content);
        if (!is_pic) {
            url = url.replace("s3.amazonaws", "ak.instagram");
            url = url.replace("_6.", "_7.");
        }
        return url;
    });

    /**
     * Event when mouse enter or leave a pic/video block
     */
    $('.photo-feed').on('mouseenter', '.photo', function () {
        $(this).find('.VigramEffect').css('width', '25px');
    });
    $('.photo-feed').on('mouseleave', '.photo', function () {
        $(this).find('.VigramEffect').css('width', '0');
    });

    /**
     * Event Profile Instagram Loading
     */
    $('.photo-feed').ready(function () {
        $('.photo-wrapper').each(function () {
            var $this = $(this);
            if (($this.hasClass('Vigram')))
                return;

            var urlToMedia = $this.find('a').first().attr('href');
            $.get(urlToMedia, function (content) {
                var url = getRealImgFromInstagram(content);
                var fName = url.split("/")[3];
                $this.addClass('Vigram');
                $this.append('<a class="VigramProfileButton" href="' + url + '" download="' + fName + '" ><img class="VigramEffect size25" src="' + image + '"></a>');
            });
        });
    });

    /**
     * Event Profile Instagram NewNode
     */
    $('.photo-feed').on('DOMNodeInserted', '.photo', function (e) {
        var $elem = $(e.target);
        var $children = $elem.children().first();
        if ($elem.hasClass('Vigram') || $elem.hasClass('VigramProfileButton'))
            return;

        var urlToMedia = $elem.find('a').first().attr('href');
        $.get(urlToMedia, function (content) {
            var url = getRealImgFromInstagram(content);
            var fName = url.split("/")[3];
            $elem.addClass('Vigram');
            $("<a>", {class: "VigramProfileButton", href: url, download: fName})
                .append($("<img>", {class: "VigramEffect size25", src: image}))
                .appendTo($children);
        });
    });

    /**
     * Event Timeline Instagram Loading.
     */
    $('.timelineContainer').ready(function () {
        $('.timelineItem').each(function () {
            var $this = $(this);
            if ($this.hasClass('Vigram'))
                return;

            var url = $this.find('.Video').first().attr('src');
            if (typeof url == 'undefined')
                url = $this.find('.timelinePhoto').attr('src');
            $this.addClass('Vigram');
            if (typeof url != 'undefined') {
                var fName = url.split("/")[3];
                $this.find('.timelineLikeButton').after('<a class="timelineLikeButton" style="background:none;" href="' + url + '" download="' + fName + '" ><div class="Vcenter"><img class="size25" src="' + image + '"></div></a>');
            }
        });
    });

    /**
     * Event Timeline Instagram NewNode
     */
    $('.timelineContainer').on('DOMNodeInserted', '.timelineItem', function (e) {
        var $this = $(e.target);
        if ($this.hasClass('Vigram'))
            return;

        var url = $this.find('.Video').first().attr('src');
        if (typeof url == 'undefined')
            url = $this.find('.timelinePhoto').attr('src');
        $this.addClass('Vigram');
        if (typeof url != 'undefined') {
            var fName = url.split("/")[3];
            $this.find('.timelineLikeButton').after('<a class="timelineLikeButton" style="background:none;" href="' + url + '" download="' + fName + '" ><div class="Vcenter"><img class="size25" src="' + image + '"></div></a>');
        }
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
            if (is_pic)
                var text_button = chrome.i18n.getMessage("dl_button_pic");
            else
                var text_button = chrome.i18n.getMessage("dl_button_vid");
            $('.top-bar-actions').ready(function () {
                if (!($('#VigramSingleImg').length)) {
                    var topBar = $('.top-bar-home').attr('id', '');
                    topBar.children().attr('id', '');
                    $('.top-bar-actions').first().append('<li id="VigramSingleImg"><a href="' + url + '" download="' + fName + '" ><span class="img-outset"><img src="' + image + '"></span><strong>' + text_button + '</strong></a></li>');
                    $('#VigramSingleImg').animate({
                        marginTop: '0px'
                    }, 1500);
                }
            });
        });
    });

    /**
     * Event Vine. \o/
     */
    $('.user').ready(function () {
        var url = $('#post').children().attr('src');
        if (typeof url === 'undefined')
            return;
        var splittedUrl = url.split('/')[5];
        var name = splittedUrl.substring(0, splittedUrl.indexOf('.'));

        if (!($('#VineButton').length)) {
            var info = $('.info');
            $('.user').append('<a id="VineButton" href="' + url + '" download="' + name + '" ><img src="' + image + '"/></a>');
            info.find('h1').remove();
            $('.user').css('padding-bottom', '230px');
        }
    });
});
