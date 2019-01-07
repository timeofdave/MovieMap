

function Link(bubble1, bubble2) {
    this.bubble1 = bubble1;
    this.bubble2 = bubble2;
    this.color = colorSmoke;
    this.strength = 0.05;
    this.mx = 0.0;
    this.my = 0.0;

    this.mSize = function () {
        return popularityToMapSize(this.popularity)
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


function addLink(bubble) {
    var ancestor = null;

    // Using a for loop so I can exit.
    for (var i = 0; i < bubbles.length && ancestor == null; i++) {
        var b = bubbles[i];

        if (b.ring == bubble.ring - 1) {
            if (b.ring == 0) {
                ancestor = b;
            }
            if (Math.round((bubble.position / bubble.ring) * b.ring) == b.position) {
                ancestor = b;
            }
            if (bubble.position == 11 && b.position == 0 && b.ring == 1) {
                ancestor = b;
            }
        }
    }

    if (ancestor != null) {
        var link = new Link(ancestor, bubble);
        link.strength = 0.05;
        links.push(link);
    }
}
