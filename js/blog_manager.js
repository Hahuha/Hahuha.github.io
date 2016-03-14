var BlogManager= (function() {
  var pages= {
      home: 0,
      list: 1,
      content: 2
    },
    articles = null,
    projects = null,
    loadError = {
      hasError: false,
      messages: []
    };

  function init() {
    resetError();
    $('.go-up').click(function() {
      var index = $(this).data('index');
      toPage (transitions.up, index - 1 );
    });

    $('#cat-link .articles').click(function () {
      toPage (transitions.down, pages.list);
    });

    $('#cat-link .projects').click(function () {
      toPage (transitions.down, pages.list);
    });
  }

  function load() {
    var articleLoading = $.getJSON('/feed_article.json')
      .done(function(data) {
        console.log("dsfdfd");
        articles = data;
        console.log(articles);
      })
      .fail(function(jqxhr, textStatus, error) {
        loadError.hasError = true;
        loadError.messages.push("Error while loading articles.");
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        console.error(jqxhr);
      });

    // $.getJSON('/feed_project.json')
    //   .done(function(data) {
    //     projects = data;
    //     console.log(projects);
    //   })
    //   .fail(function(jqxhr, textStatus, error) {
    //     loadError.hasError = true;
    //     loadError.messages.push("Error while loading projects.");
    //     var err = textStatus + ", " + error;
    //     console.log("Request Failed: " + err);
    //   });
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
    articles: articles,
    load: load,
    loadError: loadError,
    projects: projects,
    resetError: resetError
  };
})();
