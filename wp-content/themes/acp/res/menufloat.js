;(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    throttle ("scroll", "optimizedScroll");
})();


/*
 * function makeScrollFloater(
 *    DOMElement        element,
 *    integer function  getBoundaryHeight,
 *    boolean function  hasExtraCondition
 * )
 *
 * Example usage:
 *
 *  makeScrollFloater(
 *      mainMenu,
 *      function () {
 *          return mainHeader.offsetTop + mainHeader.offsetHeight;
 *      },
 *      function(){return menu.isOn;}
 *  );
 *
 * Description: adds a css class called "floating" to an element
 * once the scroll has passed a certain theshold. Can optionally
 * have an extra condition checker.
*/

var makeScrollFloater = function (element, getBoundaryHeight, hasExtraCondition) {
    var hasExtraCondition = hasExtraCondition || function () {return true;};

    window.addEventListener("optimizedScroll", function() {
        if (!hasExtraCondition()) return;


        if (!element.classList.contains("floating") && window.scrollY > getBoundaryHeight()) {
            element.classList.add("floating");
        }
        if (element.classList.contains("floating") && window.scrollY < getBoundaryHeight()) {
            element.classList.remove("floating");
        }

    });
}

var menu = (function () {
    var menu = {};
    menu.isOn = false;
    return menu;
}());


document.addEventListener("DOMContentLoaded", function(event) {

    ;(function () {
        var mainHeader = document.getElementById("top-header");
        var mainMenu = document.getElementById("main-menu");
        var hamburger = document.getElementById("hamburger");

        var getBoundaryHeight = function () {
            return mainHeader.offsetTop + mainHeader.offsetHeight;
        }

        makeScrollFloater(mainMenu, getBoundaryHeight, function(){return menu.isOn;});
        makeScrollFloater(hamburger.parentElement, getBoundaryHeight);


        hamburger.onclick = function () {
            if (menu.isOn) {
                menu.isOn = false;
                mainMenu.classList.remove("on");
                mainMenu.classList.remove("floating");
            }
            else {
                menu.isOn = true;
                mainMenu.classList.add("on");
                window.dispatchEvent(new CustomEvent('optimizedScroll'));
            }
        }

    }());


});
