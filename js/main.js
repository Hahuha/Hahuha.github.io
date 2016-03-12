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
});


$('.go-up').click(function() {
  PageTransitions.nextPage({
    animation: 4,
    showPage: $(this).data('parent') - 1
  });
});
