document.body.onload = addElement(printDivs);
var profiles;
var currentProfileIndex = 0;

function addElement(callback) {
    var lst = [1, 2, 3, 4]
    var currentDiv = document.querySelector("footer");

    for (var i = lst.length - 1; i >= 0; i--) {

        var newDiv = document.createElement("div");
        newDiv.classList.add("profile");

        var newContent = document.createTextNode("Hi there and greetings!" + i);

        newDiv.appendChild(newContent);

        document.body.insertBefore(newDiv, currentDiv);
        currentDiv = newDiv;
    }
    callback();
}

var lastScrollTop = 0;
// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener("scroll", function () { // or window.addEventListener("scroll"....
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"


    if (st > lastScrollTop) {
        scrollToNearestProfile(false, 50);
        this.console.log("down");

    } else {
        scrollToNearestProfile(true, 50);
        this.console.log("up");
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

/* Smoothly scrolls to different sections of the page. */
const scrollToNearestProfile = function (bool, duration) {
    var target;
    if (bool) {
        var ind = Math.max(0, currentProfileIndex - 1);
        target = profiles[ind];
        console.log(target);
        currentProfileIndex = ind;
    }
    else {
        var ind = Math.min(profiles.length - 1, currentProfileIndex + 1);
        target = profiles[ind];
        currentProfileIndex = ind;
    }

    var position = target.getBoundingClientRect().top;
    var startPosition = window.pageYOffset;
    var startTime = null;
    function animate(currentTime) {
        if (startTime === null) {
            startTime = currentTime;
        }
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, position, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animate);
        }
    };
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };
    
    requestAnimationFrame(animate);
}

function printDivs() {
    profiles = document.querySelectorAll(".profile");
    console.log(profiles);
}
