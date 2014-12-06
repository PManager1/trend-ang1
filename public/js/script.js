jQuery(document).ready(function($) {
    // Code that uses jQuery's $ can follow here.



    console.log(' document loaded & now script loaded   ==== ', $);

    
    function onEnter () {
      console.log(' on enter called');
      var bla =  $('#INPUT_6').val();
      console.log(' bla  = ', bla);
      window.location="http://localhost:9000/#/trend/";
    };


    $('#INPUT_6').keypress(function(e) {
        if (e.which == 13) {
            console.log('Enter pressed !!');
            onEnter(); 
            return false; //<---- Add this line
        }
    });




    // console.log(' search input  = ', $('#searchInput'));


    // $('#searchInput').css('background-color', 'black');
    // console.log(' blacking ~~~~~~~~~~~');


    $(".trenda").on("click", function(event) {
        event.preventDefault();
        console.log('clicked  trend a ', $(".trenda"));
        alert(' a clicked ');
        // alert ( $( this ).text() );
    });



    // $(".trendli").click(function  (event) {
    //     event.preventDefault(); 
    //     console.log( 'link clicked ');
    //     alert(' a clicked ');     
    // }); 




    // $('#searchInput').css('background-color','black');  

    // jQuery(selector).click(function(){



    //  $('.nobullets').on("click", ".trendli", function(e) {

    //     console.log(' From Script js  ');

    //     // $('#searchInput').text('background-color', 'blue');
    //     $('#searchInput').val(text);

    //     $scope.$apply(function() {
    //         console.log(' 2  From Script js');

    //     });
    // });






    // jQuery('.trendli').on('click', function(event) {
    //     $scope.$apply(function() {
    //         event.preventDefault();
    //         console.log(' clicking li');
    //     });
    // });




    $(window).load(function() {
        // console.log('not clicked  trend li ', $(".trendli"));
        // console.log('not clicked  trend a ', $(".trenda"));

    });





    $('#searchInput');
    // console.log("ready!");
    // console.log(' $ = ', $);


});
