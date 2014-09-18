/**
 * Vigram
 * @version : 1.1
 * @author: Nicolas (@neodern) Jamet <neodern@gmail.com>
 * @about: Download pics & videos from Vine & Instagram with a single click !
 */

var image = chrome.extension.getURL("medias/images/vigram_128.png");

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
            var tmp = url.split('/');
            tmp = tmp[tmp.length - 1];
            var name = tmp.substring(0, tmp.indexOf('.'));

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

function channelsVine()
{
    var timeline = document.querySelectorAll('.ember-application')[0];
    var vigramed = [];
    timeline.addEventListener('DOMNodeInserted', function(e) {
        e = e ? e : window.event;
        if (hasClass(e.target, 'ember-view'))
        {
            var cards = document.querySelectorAll('.card');
            for (var i = 0; i < cards.length; ++i)
            {
                var id = cards[i].querySelector('.more-actions').id;
                var linkSingleVine = cards[i].querySelector('.share-overlay a');
                if (linkSingleVine.href !== null && vigramed.indexOf(id) == -1)
                {
                    vigramed.push(id);
                    ajax('GET', linkSingleVine.href, function(content, index) {
                        var pattern = 'twitter:player:stream" content="',
                            start = content.indexOf(pattern, 0) + pattern.length,
                            end = content.indexOf('>', start, 200) - 1,
                            url = content.substring(start, end).split('?')[0],
                            tmp = url.split('/'),
                            name = tmp[tmp.length - 1];

                        var VigramLink = document.createElement('a'),
                            VigramButton = document.createElement('img'),
                            VigramContainer = cards[index].querySelector('.share').cloneNode(true);

                        VigramContainer.className += " VineButtonChannels";
                        VigramContainer.id = '';
                        VigramContainer.removeChild(VigramContainer.querySelector('.icon-share_stroked'))
                        VigramContainer.removeChild(VigramContainer.querySelector('.icon-share_stroked'))
                        VigramContainer.querySelector('.caption').textContent = 'Vigram';
                        VigramLink.className = 'VineButtonChannels';
                        VigramLink.href = url;
                        VigramLink.setAttribute('download', name);
                        VigramButton.src = image;
                        VigramLink.appendChild(VigramButton);
                        VigramContainer.appendChild(VigramLink);
                        cards[index].querySelector('.post-actions').appendChild(VigramContainer);
                    }, i);
                }
            }
        }
    });
}

function playlistsVine()
{

}

switch (window.location.pathname.split('/')[1]) {
    case 'v':
        singleVine();
        break;
    case 'channels':
        channelsVine();
        break;
    case 'playlists':
        playlistsVine();
        break;
}
