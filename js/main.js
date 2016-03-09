/*
 * Page transitions
 */

 $('.go-up').click(function () {
   PageTransitions.nextPage({ animation : 4, showPage : $(this).data('parent')-1});
 });
