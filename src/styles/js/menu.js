+function ($) {
    function collapseMenu() {
        $(".navbar-static-side").find('.collapse').collapse('hide');
        $(".navbar-static-side").find('.active').removeClass('active');
        $(".navbar-static-side").find('.active').children('ul.collapse').find('ul.in').collapse('hide');
        setTimeout(function () {
            $("#app-root").addClass('mini');
        }, 350);
    }
    $(document).on("click", '#btn-open-menu', function (e) {
        if ($("#app-root.mini").length > 0) {
            $("#side-menu").fadeToggle(50);
            setTimeout(function () {
                $("#app-root").removeClass('mini');
                $(".navbar-static-side").find('li.selected').not('.profile-dropdown').children('ul.collapse').collapse('show');
                $(".navbar-static-side").find('li.selected').not('.profile-dropdown').addClass('active').children('li.selected').addClass('active');
                setTimeout(function () {
                    $("#side-menu").fadeIn(200);
                }, 250);
            }, 50);
        }
        else {
            collapseMenu();
        }
    })
        .mouseup(function (e) {
            var container = $(".navbar-static-side, .navbar-header");
            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                collapseMenu();
            }
        })
        .on("click", '.navbar-static-side .nav a', function (event) {
            event.preventDefault();
            if ($(this).siblings('ul')[0]) {
                if ($(this).parent(".active").length > 0) {
                    $(this).parent().find('.active').removeClass('active');
                    $(this).parent().removeClass("active");
                    $(this).parent().siblings('.selected').find('ul.in').collapse('hide');
                    $(this).parent().find('li ul.in').removeClass('in');
                }
                else {
                    $(this).parent().siblings(".active").removeClass("active").find('ul.in').collapse('hide');
                    $(this).parent().siblings().find('.active').removeClass('active');
                    $(this).parent().addClass("active");
                }
                setTimeout(() => {
                    $(this).parent().siblings().find('.collapse').collapse('hide');
                }, 200);
            }
            else {
                collapseMenu();
            }
        });

}(jQuery)