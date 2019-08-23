+function ($) {
    $(document).on({
        mouseenter: function () {
            const parent = $(this).parent()[0];
            const id = parent.getAttribute("data-id");
            // on hover, we get an "id", and all tr's that have class "row<id>" are the ones to color
            $("." + id).addClass("hover");
            $("." + id).removeClass("disable-hover");
        },
        mouseleave: function () {
            const parent = $(this).parent()[0];
            const id = parent.getAttribute("data-id");
            // on hover, we get an "id", and all tr's that have class "row<id>" are the ones to color
            $("." + id).removeClass("hover");
            $("." + id).addClass("disable-hover");
        }
    }, ".merge-row");
}(jQuery);
