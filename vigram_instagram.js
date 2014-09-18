/**
 * Vigram
 * @version : 1.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

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
 * .hasClass from jQuery.
 * @param elem
 * @param className
 * @returns {boolean}
 */
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

/**
 * AJAX call.
 * @param verb
 * @param url
 * @param cb
 */
function    ajax(verb, url, cb, index)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            return cb(xmlhttp.responseText, index);
    };
    if (url === null)
        url = '';
    xmlhttp.open(verb, url, true);
    xmlhttp.send();
}

/**
 * Callback event - Instagram Profile page.
 * @param elem
 */
var getFromInstagramProfile = function(elem) {
    if (hasClass(elem, 'Vigram'))
        return;

    elem.className += ' Vigram';
    var urlToMedia = elem.querySelectorAll('a')[0].href;
    ajax('GET', urlToMedia, function(content, index) {
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

/**
 * Callback event - Instagram Timeline page.
 * @param elem
 */
var getFromInstagramTimeline = function(elem) {
    if (hasClass(elem, 'Vigram') || hasClass(elem, 'timelineLast'))
        return;

    var url = null;
    var video = elem.querySelectorAll('.Video')[0];
    if (typeof video !== 'undefined')
        url = video.getAttribute('src');
    if (typeof url == 'undefined' || url === null)
    {
        url = elem.querySelector('.timelineCenter .mediaPhoto .timelinePhoto').getAttribute('src');
        console.log(url)
    }

    elem.className += ' Vigram';
    if (typeof url !== 'undefined') {
        var fName = url.split("/")[4];

        var VigramLink = document.createElement('a');
        var VigramButton = document.createElement('span');

        VigramLink.className = "timelineLikeButton";
        VigramLink.style.background = 'url('+image+') no-repeat 50% 50%';
        VigramLink.style.backgroundSize = '30px'
        VigramLink.href = url;
        VigramLink.setAttribute('download', fName);
        VigramLink.appendChild(VigramButton);

        var referenceNode = elem.querySelector('.timelineLikeButton');
        referenceNode.parentNode.insertBefore(VigramLink, referenceNode.nextSibling);
    }
};

/**
 * Callback event - Instagram profile page.
 * @param e
 */
var mouseOverEvent = function(e) {
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
};

/**
 * Instagram - Profile Page.
 */
var photoFeed = document.querySelectorAll('.photo-feed')[0];
if (typeof photoFeed !== 'undefined')
{
    var medias = photoFeed.querySelectorAll('.photo');
    for (var i = 0; i < medias.length; ++i)
    {
        getFromInstagramProfile(medias[i]);
        medias[i].querySelector('.photoShadow').addEventListener("mouseover", mouseOverEvent);
    }
    photoFeed.addEventListener('DOMNodeInserted', function(e) {
        e = e ? e : window.event;
        var classes = e.target.className;
        if (classes.indexOf('photo') !== -1)
        {
            getFromInstagramProfile(e.target);
            e.target.querySelector('.photoShadow').addEventListener("mouseover", mouseOverEvent);
        }
    });
}

/**
 * Instagram - Timeline Page.
 */
var timelineFeed = document.querySelectorAll('.timelineContainer')[0];
if (typeof timelineFeed !== 'undefined')
{
    var medias = timelineFeed.querySelectorAll('.timelineItem');
    for (var i = 0; i < medias.length; ++i)
    {
        getFromInstagramTimeline(medias[i]);
    }
    timelineFeed.addEventListener('DOMNodeInserted', function(e) {
        e = e ? e : window.event;
        var classes = e.target.className;
        if (classes.indexOf('timelineItem') !== -1)
        {
            getFromInstagramTimeline(e.target);
        }
    });
}

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
 * Instagram - Single page.
 */
var singlePage = document.querySelectorAll('.lbAnimation')[0];
if (typeof singlePage !== 'undefined')
{
    ajax('GET', null, function(content, index) {
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

        var topbar = document.querySelectorAll('.top-bar-actions')[0];
        if (typeof topbar !== 'undefined')
        {
            if (!topbar.querySelector('#VigramSingleImg'))
            {
                var VigramList = document.createElement('li'),
                    VigramLink = document.createElement('a'),
                    VigramSpan = document.createElement('span'),
                    VigramButton = document.createElement('img'),
                    VigramText = document.createElement('strong');

                VigramList.id = "VigramSingleImg";
                VigramList.style.width = '225px';

                VigramLink.href = url;
                VigramLink.setAttribute('download', fName);

                VigramSpan.style.float = 'left';
                VigramSpan.style.display = 'inline';
                VigramSpan.style.margin = '-4px 7px 1px 0px';

                VigramButton.src = image;

                VigramText.innerHTML = text_button;
                VigramText.style.display = 'block';

                VigramSpan.appendChild(VigramButton);
                VigramLink.appendChild(VigramSpan);
                VigramLink.appendChild(VigramText);
                VigramList.appendChild(VigramLink);
                topbar.appendChild(VigramList);
            }
        }
    });
}

