

function submitSearch() {
    if (inputTitle.value == null || inputTitle.value == "") {
        // focus inputTitle
    }
    getMovieDetails(inputTitle.value, inputYear.value);
    inputTitle.blur();
    inputYear.blur();
    canvas.focus();
}

function searchReturned(movie) {
    console.log(movie);

    if (movie.title == null) {
        inputTitle.focus();
    }
    else {
        inputTitle.value = "";
        inputYear.value = "";

        var b = addBubble(movie);

        //currentBubble = b;
        //pinInfo = true;

        render();
    }

}



function getMovieDetails(title, stringYear) {
    var year = parseInt(stringYear);

    if (year == null || year == NaN || year == "" || year > 9999 || year <= 999) {
        year = 0;
    }
    var queryString = "&title=" + title + "&year=" + year;

    $.ajax({
        type: "GET",
        url: "/About?handler=FetchMovie" + queryString,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            searchReturned(response);
        },
        failure: function (response) {
            console.log(response);
        }
    });
}
