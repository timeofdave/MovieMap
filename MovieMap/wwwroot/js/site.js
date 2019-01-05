// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

function makeCallBackup() {
    $.ajax({
        type: "GET",
        url: "/About?handler=List",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var dvItems = $("#dvItems");
            dvItems.empty();
            $.each(response, function (i, item) {
                var $tr = $('<li>').append(item).appendTo(dvItems);
            });
        },
        failure: function (response) {
            alert(response);
        }
    });
}