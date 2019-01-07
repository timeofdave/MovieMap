

function Bubble(title) {
    this.movieId = 0;
    this.title = title;
    this.year = 0;
    this.tomato = -1;
    this.opinion = -1;
    this.popularity = 0;
    this.plot = "";
    this.color = colorLead;
    this.maturity = null;
    this.poster = new Image();
    this.ring = 0;
    this.position = 0;
    this.mx = 0.0;
    this.my = 0.0;

    this.pinToMap = function () {
        var ringPosition = claimNextRingPosition();
        this.ring = ringPosition[0];
        this.position = ringPosition[1];

        var location = ringPositionToMapLocation(this.ring, this.position);
        this.mx = location[0];
        this.my = location[1];

    }
    this.mSize = function () {
        return popularityToMapSize(this.popularity)
    };
    this.fullTitle = function () {
        return (this.title + ' (' + this.year + ')');
    };

    this.cx = function () {
        return toCX(this.mx);
    }
    this.cy = function () {
        return toCY(this.my);
    }
    this.cSize = function () {
        return toCDistance(this.mSize());
    }
}



function addBubble(movie) {
    var b = new Bubble(movie.title);
    b.year = movie.year;
    b.popularity = votesToPopularity(movie.imdbVotes);
    b.plot = movie.plot;
    b.color = colorYellow;
    b.poster.src = movie.poster;
    b.maturity = movie.rated;
    var tomatoIndex = movie.ratings.findIndex(item => item.source === 'Rotten Tomatoes');
    if (tomatoIndex != -1) {
        b.tomato = (movie.ratings[tomatoIndex].value).replace(/\D+/g, '');
    }
    b.pinToMap();
    bubbles.push(b);

    addLink(b);

    cameraPan(b);

    return b;
}