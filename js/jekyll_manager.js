(function(window) {
    'use strict';

    function define() {
        var jmanager = {};
        var selectedCollection = {}; // Object from jekyll_data.js
        var collDataLoaded = 0;
        var transitionend = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';
        var pages = {
            home: 0,
            list: 1,
            content: 2
        };
        var transitions = {
            right: 1,
            left: 2,
            down: 11,
            up: 12
        };
        var keyBinding = {
            37: 'left',
            38: 'up',
            39: 'right'
        };
        var socialShare = {
            twitter: 'https://twitter.com/intent/tweet?url=__SHARE-URL__&text=__SHARE-TITLE__',
            facebook: 'http://www.facebook.com/sharer.php?u=__SHARE-URL__',
            linkedin: 'http://www.linkedin.com/shareArticle?url=__SHARE-URL__&title=__SHARE-TITLE__'
        };

        /****************************************************************************/
        /*  .______   .______       __  ____    ____  ___   .___________. _______   */
        /*  |   _  \  |   _  \     |  | \   \  /   / /   \  |           ||   ____|  */
        /*  |  |_)  | |  |_)  |    |  |  \   \/   / /  ^  \ `---|  |----`|  |__     */
        /*  |   ___/  |      /     |  |   \      / /  /_\  \    |  |     |   __|    */
        /*  |  |      |  |\  \----.|  |    \    / /  _____  \   |  |     |  |____   */
        /*  | _|      | _| `._____||__|     \__/ /__/     \__\  |__|     |_______|  */
        /*                                                                          */
        /****************************************************************************/

        /*
         * load blog with parameters
         *
         * active_page: '#list', // id of the active section on open
         * section: 'projects', // wich section is selected (projects, articles)
         * post_id: '', // Id of the displayed post (if necessary)
         */
        var initData = function (options) {
          if (!options || !options.active_page) {
            return;
          }

          // $('.pt-page').removeClass('.pt-page-current');
          // $(options.active_page).addClass('pt-page-current');

          if (!options.section) {
            return;
          }

          var nbColl = jdata.collections().length;
          var timedOut = false;
          window.setTimeout(function () {
            if (nbColl == collDataLoaded )
            {
                $('#cat-link .' + options.section + ' a' ).click();
            }
          }, 2000);


        }

        /*
         * Load post data in the content section
         */
        var loadContent = function(postId) {
            // TODO manage collection null
            var section = selectedCollection.id;
            var post = jdata.collectionDataById(section, postId);

            // Manage index of post in data and navigation
            $('#content .menu').removeClass('transition-out transition-in').addClass('transition-out').on(transitionend, function() {
                $('#content [class^="go-"]').removeClass('hidden');
                if (jdata.isCollectionDataFirst(selectedCollection.id, postId)) {
                    $('#content .go-left').addClass('hidden');
                }
                if (jdata.isCollectionDataLast(selectedCollection.id, postId)) {
                    $('#content .go-right').addClass('hidden');
                }
                $(this).removeClass('transition-out').addClass('transition-in').on(transitionend, function() {
                    $(this).removeClass('transition-in');
                });
            });

            // Manage post content
            $('#content .wrapper').removeClass('transition-out-left transition-in-left load-right').addClass('transition-out-left').on(transitionend, function() {
                $(this).removeClass('transition-out-left').addClass('load-right').on(transitionend, function() {
                    if (post != undefined) {
                        $('#content').data('post-id', post.id);
                        $('#content h1').text(post.title);
                        $('#content .article').html(decodeURI(post.content));
                        $('#content .breadcrumb li:last-child').text(post.title);
                    }
                    $(this).removeClass('load-right').addClass('transition-in-left').on(transitionend, function() {
                        $(this).removeClass('load-right').removeClass('transition-in-left');
                    });
                });
            });

            shareURL('content', post.title, '/' + post.url);

            return true;
        };

        /**
         * Create an element of the posts list
         */
        var createListElement = function(value, index) {
            var listElem = '<li><a href="#" data-id="' + value.id + '"><span class="date">' + value.date + '</span><span class="title">' + value.title + '</span></a></li>';
            $(listElem).appendTo('#list .list').children('a').click(function() {
                loadContent($(this).data("id"));
                jmanager.toPage(pages.content, transitions.down );
                // TODO manage error
            });

            return true;
        };

        /*
         * Initialize the home section
         */
        var initHome = function() {
            // Init social URL in home
            shareURL('home', 'gffds', ''); // TODO change text

            // Init links to categories in home
            $('#cat-link a').click(function() {
                jmanager.prepareList($(this).data('section'));
                jmanager.toPage(pages.list, transitions.down);
            });
        };

        /*
         * change the url in the social share links in the section defined by id.
         */
        var shareURL = function(id, title, url) {
            $('#' + id + ' .menu .social a[rel="clip-link"] input').val(jdata.url() + url);
            $('#' + id + ' .menu .social a[rel="twitter"]')
                .attr('href', socialShare.twitter.replace('__SHARE-URL__', encodeURI(jdata.url() + url)).replace('__SHARE-TITLE__', encodeURI(title)));
            $('#' + id + ' .menu .social a[rel="facebook"]')
                .attr('href', socialShare.facebook.replace('__SHARE-URL__', encodeURI(jdata.url() + url)));
            $('#' + id + ' .menu .social a[rel="linkedin"]')
                .attr('href', socialShare.linkedin.replace('__SHARE-URL__', encodeURI(jdata.url() + url)).replace('__SHARE-TITLE__', encodeURI(title)));
        };

        /***********************************************************/
        /*  .______    __    __  .______    __       __    ______  */
        /*  |   _  \  |  |  |  | |   _  \  |  |     |  |  /      | */
        /*  |  |_)  | |  |  |  | |  |_)  | |  |     |  | |  ,----' */
        /*  |   ___/  |  |  |  | |   _  <  |  |     |  | |  |      */
        /*  |  |      |  `--'  | |  |_)  | |  `----.|  | |  `----. */
        /*  | _|       \______/  |______/  |_______||__|  \______| */
        /*                                                         */
        /***********************************************************/

        /*
         * "constructor" of the blog, init variables and stuff
         */
        jmanager.init = function(options) {
            this.loadData();
            initHome();

            // Manage about me section opening
            $('#about .close-btn').click(function() {
                $('#about').addClass('closed').removeClass('opened');
            });
            $('.menu .info').click(function() {
                $('#about').addClass('opened').removeClass('removed');
            })

            // init copy-pasting functionnality on url link
            $('.menu .social a[rel="clip-link"]').click(function() {
                if (ctrl_c.copy($(this).find('input')[0])) {
                    poppify.add({
                        direction: 'top',
                        text: 'Link copied to clipboard !'
                    });
                } else {
                    poppify.add({
                        direction: 'top',
                        text: 'Error while copying to clipboard !'
                    });
                }
            });

            // Event to manage click on menu arrays
            $('.menu [class^="go-"]:not(.hidden)').click(function() {
                // go up to parent section
                if ($(this).hasClass('go-up')) {
                    var index = $(this).data('index');
                    jmanager.toPage(index - 1, transitions.up);
                    return;
                }

                // (only for content section) go right/left for next/previous post
                var parent = $(this).parents('.pt-page');
                if ($(parent).attr('id') === "content") {
                    var newId = 0;
                    if ($(this).hasClass('go-right')) {
                        newId = jdata.nextCollectionData(selectedCollection.id, $(parent).data('post-id'));
                    } else {
                        newId = jdata.previousCollectionData(selectedCollection.id, $(parent).data('post-id'));
                    }
                    loadContent(newId);

                }
            });

            // Binding keyboard arrows with menu arrows
            $(document).keydown(function(e) {
                var direction = keyBinding[e.which];
                if (!direction) {
                    return;
                }
                var button = $('.pt-page-current .go-' + direction + ':not(.hidden)');
                if ($(button).length) {
                    $(button).click();
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
            });

            // Init breadcrumbs links
            $('.breadcrumb [data-level="0"]').click(function() {
                jmanager.toPage(pages.home, transitions.up);
            });
            $('.breadcrumb [data-level="1"]').click(function() {
                jmanager.toPage(pages.list, transitions.up);
            });

            // call initData to load blog to required position
            initData(options);
        };

        /*
         * load Collections data into jekyll_data
         */
        jmanager.loadData = function() {
            // TODO : check why there is one empty collectionId
            // TODO : refacto to write clean, pretty code
            var array = jdata.collections();
            for (var c in array) {
                var coll = array[c].id;
                $.ajax({
                    url: '/feed_' + coll + '.json',
                    dataType: 'json',
                    async: false,
                    success: function(obj) {
                        jdata.setCollectionData(array[c].id, obj);
                        ++collDataLoaded;
                        // TODO Manage error
                    },
                    error : function(jqxhr, textStatus, error) {
                        // TODO Manage errors
                        ++collDataLoaded;
                        var err = textStatus + ", " + error;
                        console.error("Request Failed: " + err);
                        console.error(jqxhr);
                    }
                });

            }
        };

        /**
         * Allow to go to said page with said transition
         */
        jmanager.toPage = function(page, transition) {
            if (typeof page === 'undefined' || !page) {
                page = pages.home;
            }

            if (!transition) {
                transition = transitions.up;
            }

            PageTransitions.nextPage({
                animation: transition,
                showPage: page
            });
        };

        /**
         * load the List section with the datas of the collectionId in param
         */
        jmanager.prepareList = function(collectionId) {
            var newSection = jdata.collectionById(collectionId);
            // TODO check if null

            var oldSection = selectedCollection.id;
            selectedCollection = newSection;

            shareURL('list', selectedCollection.title, '/' + selectedCollection.id);

            // Change wrapper section to change color theme
            // (Both list and content)
            $('#list .wrapper, #content .wrapper').removeClass(oldSection).addClass(collectionId);

            // Change breadcrumb level
            $('#list .breadcrumb li:last').text(collectionId);
            $('.breadcrumb [data-level="1"]').text(collectionId);

            // Change title
            $('#list .wrapper h1').text(collectionId);

            // LIST MANAGEMENT
            $('#list .list').empty();
            $('#list').data('section', collectionId);

            // fill list
            var data = jdata.collectionById(selectedCollection.id).data;
            _.each(data, function(value, index, list) {
                createListElement(value, index);
                // TODO manager error
            });

            return true;
        };

        return jmanager;
    }

    if (typeof(jmanager) === 'undefined') {
        window.jmanager = define();
    } else {
        console.error("jmanager is already defined.");
    }
})(window);
