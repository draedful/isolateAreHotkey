;(function(window){
    window.extend = function (child, parent){
        var F = function () { };
        F.prototype = parent.prototype;

        child.prototype = new F();
        child.prototype.constructor = child;
        child.super = parent.prototype;
    }

    window.isFunction = function (v) {
        return typeof v === "function";
    }
})(window)