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

function hasClass(elem, className)
{
    var classes = elem.className;
    if (typeof classes === 'undefined')
        return false;
    classes.split(' ');
    if (classes.indexOf(className) !== -1)
        return true;
    return false;
}

function    ajax(verb, url, cb)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            return cb(xmlhttp.responseText);
    };
    xmlhttp.open(verb, url, true);
    xmlhttp.send();
}

/**
 * Callback for Event Profile Instagram (Loading / NewNode)
 * @param $this
 */
var getFromInstagramProfile = function(elem) {
    if (hasClass(elem, 'Vigram'))
        return;

    elem.className += ' Vigram';
    var urlToMedia = elem.querySelectorAll('a')[0].href;
    ajax('GET', urlToMedia, function(content) {
        var url = getRealImgFromInstagram(content);
        var fName = url.split("/")[4];
        var VigramLink = document.createElement('a');
        var VigramButton = document.createElement('img');
        VigramButton.className = "VigramEffect size25 invisible";
        VigramButton.src = image;
        VigramLink.className = "VigramProfileButton";
        VigramLink.href = url;
        VigramLink.setAttribute('download', fName);
        VigramLink.appendChild(VigramButton);
        elem.appendChild(VigramLink)
    });
};

var getFromInstagramTimeline = function(elem) {
    if (elem.hasClass('Vigram'))
        return;

    var url = elem.find('.Video').first().attr('src');
    if (typeof url == 'undefined')
        url = elem.find('.timelinePhoto').attr('src');
    elem.addClass('Vigram');
    if (typeof url != 'undefined') {
        var fName = url.split("/")[4];
        elem.find('.timelineLikeButton').after(
            $("<a>", {class: "timelineLikeButton", style: "background:none;", href: url, download: fName})
                .append($("<div>", {class: "Vcenter"})
                    .append($("<img>", {class: "size25", src: image}))
            )
        );
    }
};

var image = chrome.extension.getURL("medias/images/vigram_128.png");

/* Event when mouse enter or leave a pic/video block */
//$('.photo-feed').on('mouseenter', '.photo', function () { $(this).find('.VigramEffect').css('width', '25px'); });
//$('.photo-feed').on('mouseleave', '.photo', function () { $(this).find('.VigramEffect').css('width', '0'); });

var medias = document.querySelectorAll('.photoShadow');
for (var i = 0; i < medias.length; ++i)
{
    medias[i].addEventListener("mouseover", function(e){
        e = e ? e : window.event;
        var reactId = e.target.getAttribute('data-reactid'),
            photo = e.target.parentNode.parentNode.parentNode,
            vigramId = photo.getAttribute('data-reactid'),
            allMedias = document.querySelectorAll('.VigramEffet, .visible');

        for (var j = 0; j < allMedias.length; ++j)
        {
            if (allMedias[j].id.split('-')[1] !== reactId)
                allMedias[j].className = 'VigramEffect size25 invisible';
        }

        if (hasClass(photo, 'photo'))
        {
            var vigramMedia = photo.querySelector('.VigramEffect');
            if (vigramMedia !== null)
            {
                vigramMedia.className = 'VigramEffect size25 visible';
                vigramMedia.id = 'vigramId-' + vigramId;
            }
        }
    });
//    medias[i].addEventListener("mouseout", function(e){
//        e = e ? e : window.event;
//
//        var photo = e.target.parentNode.parentNode.parentNode;
//        var reactId = photo.getAttribute('data-reactid');
////        if (hasClass(photo, 'photo'))
//        {
//            var vigramMedia = photo.querySelector('.VigramEffect');
////            var allMedias = document.querySelectorAll('.VigramEffet, .visible');
////            console.log(allMedias);
////            for (var j = 0; j < allMedias.length; ++j)
////            {
//                var vigramId = vigramMedia.id.split('-')[1];
////                    allMedias[j].className = 'VigramEffect size25 invisible';
////            }
//
//
//            console.log(vigramId)
//            console.log(reactId);
////            console.log(reactId)
//            if (vigramMedia !== null)
//            {
//                vigramMedia.className = 'VigramEffect size25 invisible';
//            }
//        }
//    });
}

//document.addEventListener("mousemove", function (e) {
//    e = e ? e : window.event;
//    var classes = e.target.className.split(' ');
//    if (classes.indexOf('photoShadow') !== -1)
//        return;
//
//    //console.log(enabled);
//    if (enabled !== null)
//        enabled.className = 'VigramEffect size25 invisble';
//
//
//});

var photoFeed = document.querySelectorAll('.photo-feed')[0];
if (typeof photoFeed !== 'undefined')
{
    var medias = photoFeed.querySelectorAll('.photo');
    for (var i = 0; i < medias.length; ++i)
        getFromInstagramProfile(medias[i]);
}


/* Events Handlers. */
//$('.photo-feed').ready(function () { $('.photo-wrapper').each(getFromInstagramProfile($(this))); });
//$('.photo-feed').on('DOMNodeInserted', '.photo', function (e) { getFromInstagramProfile($(e.target).parent()); });

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
