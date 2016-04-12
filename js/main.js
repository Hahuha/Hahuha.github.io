/*
 * Page transitions
 */
$(function() {

  var bManager = BlogManager;
  BlogManager.load();
  // while (bManager.loadError.hasError === false || (bManager.articles === null && bManager.projects === null)) {
  //   console.log("loaded !");
  // }
  // bManager.resetError();

  // Gestion de l'ouverture de la section "About Me"
  $('#about .close-btn').click(function () {
    $('#about').addClass('closed').removeClass('opened');
  });
  $('.menu .info').click(function () {
    $('#about').addClass('opened').removeClass('removed');
  })
});