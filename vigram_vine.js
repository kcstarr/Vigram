/**
 * Vigram
 * @version : 1.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

function getVineNameFromUrl(url)
{
    var tmp = url.split('/');
    tmp = tmp[tmp.length - 1];
    return tmp.substring(0, tmp.indexOf('.'));
}

/**
 * Vine - Single page. <o/
 */
function singleVine()
{
    var badges = document.querySelectorAll('.badges')[0];
    if (typeof badges !== 'undefined')
    {
        var vineContainer = document.querySelectorAll('.vine-video-container')[0];
        var fullUrl = vineContainer.querySelector('video').getAttribute('src');
        if (typeof fullUrl !== 'undefined')
        {
            var url = fullUrl.split('?')[0];
            var name = getVineNameFromUrl(url);

            if (!!document.querySelectorAll('#VineButton'))
            {
                var VigramBlock = document.createElement('div'),
                    VigramLink = document.createElement('a'),
                    VigramButton = document.createElement('img'),
                    VigramText = document.createElement('p');

                VigramBlock.className = 'share-badge';
                VigramLink.id = 'VineButton';
                VigramLink.href = url;
                VigramLink.setAttribute('download', name);
                VigramButton.src = image;
                VigramText.innerHTML = 'Vigram';

                VigramLink.appendChild(VigramButton);
                VigramLink.appendChild(VigramText);
                VigramBlock.appendChild(VigramLink);
                badges.insertBefore(VigramBlock, badges.querySelector('.twitter'));
            }
        }
    }
}

switch (window.location.pathname.split('/')[1]) {
    case 'v':
        singleVine();
        break;
}
