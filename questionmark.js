function q(that, selector) {

    const specialGetValueKey = "$@$! ___QUESTIONMARK_SPECIAL_ESCAPE 27f99fbc-13e2-4f61-972c-1e291cae005a";
        
    function getValFromProxy(proxy) {
        if (!proxy) {
            return undefined;
        }
        return proxy[specialGetValueKey];
    }
    
    
    const makeTrackingProxy = (data, thisRef) => new Proxy(function dummy() {}, {
        get: function(obj, prop) {
            if (prop === specialGetValueKey) {
                return data;
            }

            let nextObject = undefined;
            let nextIsFunction = false;
            if (data !== null && data !== undefined) {
                nextObject = data[prop];                
                nextIsFunction = typeof(data[prop]) === "function";
            }

            return makeTrackingProxy(nextObject, nextIsFunction ? data : nextObject); 
        },

        set: function(obj, prop, value) {
            let nextObject = undefined;
            if (data !== null && data !== undefined) {
                nextObject = data[prop] = value;                
            }
            return makeTrackingProxy(nextObject, nextObject);
        },

        apply: function(obj, prop, args) {
            let nextObject = undefined;
            if (data !== null && data !== undefined && typeof(data) === "function") {
                nextObject = data.apply(thisRef, args);
            }
            
            return makeTrackingProxy(nextObject, nextObject);
        }
    });

    let res = selector(makeTrackingProxy(that, that), getValFromProxy);

    return getValFromProxy(res);
}

Object.prototype.q = function qProto(selector) {
    return q(this, selector);
}

module.exports = q;