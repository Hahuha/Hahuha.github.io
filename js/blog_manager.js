var BlogManager = (function() {
  var pages = {
      home: 0,
      list: 1,
      content: 2
    },
    data = {
      articles: null,
      projects: null
    },
    keyBinding = {
      37: "left",
      38: "up",
      39: "right"
    },
    loadError = {
      hasError: false,
      messages: []
    };

  function init() {
    resetError();
    $('.menu [class^="go-"]:not(.hidden)').click(function() {
      if ($(this).hasClass('go-up')) {
        var index = $(this).data('index');
        toPage(transitions.up, index - 1);
        return;
      }
      var parent = $(this).parents('.pt-page');
      var newIndex = 0;
      if ($(parent).attr('id') === "content") {
        newIndex = $(parent).data('post-index');
        newIndex += $(this).hasClass('go-right') ? +1 : -1;
        loadPost(newIndex);
      }
    });

    // On bind les flèches du clavier avec les flèches du menu
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

    $('.breadcrumb [data-level="0"]').click(function() {
      toPage(transitions.up, pages.home);
    });
    $('.breadcrumb [data-level="1"]').click(function() {
      toPage(transitions.up, pages.list);
    });

    $('#cat-link a').click(function() {
      var newSection = $(this).data('section');
      var oldSection = newSection == 'articles' ? 'projects' : 'articles';
      $('#list .wrapper, #content .wrapper').removeClass(oldSection).addClass(newSection);
      $('#list .wrapper h1').text(newSection);
      $('#list .list').empty();
      $('#list').data('section', newSection);
      $('.breadcrumb [data-level="1"]').text(newSection);
      _.each(data.articles, function(value, index, list) {
        createListElement(value, index);
      });
      toPage(transitions.down, pages.list);
    });

  }

  function createListElement(value, index) {
    var section = $('#list').data('section');
    $('#content .breadcrumb li:last-child').text(value.title);

    var listElem = '<li><a href="#" data-id="' + value.id + '"><span class="date">' + value.date + '</span><span class="title">' + value.title + '</span></a></li>';
    $(listElem).appendTo('#list .list').children('a').click(function() {
      var result = _.findWhere(data[section], {
        id: $(this).data("id")
      });

      // Manage index of post in data and navigation
      $('#content [class^="go-"]').removeClass('hidden');
      if (index == 0) {
        $('#content .go-left').addClass('hidden');
      }
      else if (index >= data[section].length-1) {
        $('#content .go-right').addClass('hidden');
      }

      // Manage post content
      if (result != undefined) {
        $('#content').data('post-index', index);
        $('#content').data('post-id', result.id);
        $('#content h1').text(result.title);
        $('#content .article').html(decodeURI(result.content));
      }
      toPage(transitions.down, pages.content);
    });
  }

  function load() {
    var articleLoading = $.getJSON('/feed_article.json')
      .done(function(obj) {
        data.articles = obj;
      })
      .fail(function(jqxhr, textStatus, error) {
        loadError.hasError = true;
        loadError.messages.push("Error while loading articles.");
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        console.error(jqxhr);
      });

    $.getJSON('/feed_project.json')
      .done(function(obj) {
        data.projects = obj;
      })
      .fail(function(jqxhr, textStatus, error) {
        loadError.hasError = true;
        loadError.messages.push("Error while loading projects.");
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });
  }

  function toPage(transition, to, options) {
    if (typeof to === 'undefined' || !to) {
      to = pages.home;
    }

    if (!transition) {
      transition = transitions.up;
    }
    // Load datas into next page

    // Go to next page
    PageTransitions.nextPage({
      animation: transition,
      showPage: to
    });
  }

  function resetError() {
    loadError = {
      hasError: false,
      messages: []
    };
  }

  function loadPost(postIndex) {
    var section = $('#list').data('section');
    var post = data[section][postIndex];

    // Manage index of post in data and navigation
    $('#content [class^="go-"]').removeClass('hidden');
    if (postIndex == 0) {
      $('#content .go-left').addClass('hidden');
    }
    else if (postIndex >= data[section].length-1) {
      $('#content .go-right').addClass('hidden');
    }

    // Manage post content
    if (post != undefined) {
      $('#content').data('post-index', postIndex);
      $('#content').data('post-id', post.id);
      $('#content h1').text(post.title);
      $('#content .article').html(decodeURI(post.content));
    }
  }

  init();

  return {
    articles: data.articles,
    load: load,
    loadError: loadError,
    projects: data.projects,
    resetError: resetError
  };
})();