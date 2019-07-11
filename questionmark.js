function q(that, selector) {
    let functionOwner;
    let trackingProxy = new Proxy(function dummy() {}, {
        get: function(obj, prop) {
            if (that !== null && that !== undefined) {
                if (typeof(that[prop]) === "function") {
                    functionOwner = that;
                }
                that = that[prop];
            } else {
                that = undefined;
            }

            return trackingProxy; 
        },

        apply: function(obj, prop, args) {
            if (that !== null && that !== undefined && typeof(that) === "function") {
                that = that.apply(functionOwner || that, args);
            } else {
                that = undefined;
            }
            return trackingProxy;
        }
    });

    selector(trackingProxy);

    return that;
}

Object.prototype.q = function qProto(selector) {
    return q(this, selector);
}

module.exports = q;