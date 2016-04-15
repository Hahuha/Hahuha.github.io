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
    }
  loadError = {
    hasError: false,
    messages: []
  };

  function init() {
    resetError();
    $('.go-up').click(function() {
      var index = $(this).data('index');
      toPage(transitions.up, index - 1);
    });

    //pt-page-current
    // On bind les flèches du clavier avec les flèches du menu
    $(document).keydown(function(e) {
      var direction = keyBinding[e.which];
      if (!direction) {
        return;
      }

      var button = $('.pt-page-current .go-' + direction);
      if ($(button).length) {
        $(button).click();
        e.preventDefault(); // prevent the default action (scroll / move caret)
      }
    });

    $('.breadcrumb [data-level="0"]').click(function() {
      toPage(transitions.up, pages.home);
    });
    $('.breadcrumb [data-level="1"]').click(function() {
      toPage(transitions.up, pages.list);
    });

    $('#cat-link .articles').click(function() {
      $('#list .wrapper, #content .wrapper').removeClass('projects').addClass('articles');
      $('#list .wrapper h1').text('Articles');
      $('#list .list').empty();
      $('.breadcrumb [data-level="1"]').text("articles");
      _.each(data.articles, function(value, key, list) {
        createListElement('articles', value);
      });
      toPage(transitions.down, pages.list);
    });

    $('#cat-link .projects').click(function() {
      $('#list .wrapper, #content .wrapper').removeClass('articles').addClass('projects');
      $('#list .wrapper h1').text('Projects');
      $('#list .list').empty();
      $('.breadcrumb [data-level="1"]').text("projects");
      _.each(data.projects, function(value, key, list) {
        createListElement('projects', value);
      });
      toPage(transitions.down, pages.list);
    });
  }

  function createListElement(section, value) {
    $('#content .breadcrumb li:last-child').text(value.title);
    var listElem = '<li><a href="#" data-id="' + value.id + '"><span class="date">' + value.date + '</span><span class="title">' + value.title + '</span></a></li>';
    $(listElem).appendTo('#list .list').children('a').click(function() {
      var result = _.findWhere(data[section], {
        id: $(this).data("id")
      });
      if (result != undefined) {
        $('#content h1').text(result.title);
        $('#content .article').html(decodeURI(result.content));
        console.log(result.content);
        console.log(decodeURI(result.content));
      }
      toPage(transitions.down, pages.content);
    });
  }

  function load() {
    var articleLoading = $.getJSON('/feed_article.json')
      .done(function(obj) {
        console.log("article");
        data.articles = obj;
        console.log(data.articles);
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
        console.log("project");
        data.projects = obj;
        console.log(data.projects);
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

  function list(options) {

  }

  function content(options) {
    // body...
  }

  function resetError() {
    loadError = {
      hasError: false,
      messages: []
    };
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