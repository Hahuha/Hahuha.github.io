var BlogManager= (function() {
  var articles = null,
    projects = null,
    loadError = {
      hasError: false,
      messages: []
    };

  function init() {
    resetError();
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
