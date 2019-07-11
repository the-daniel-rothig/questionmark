const q = require("../questionmark");
var assert = require('assert');

const testObject = {
    name: "myName",
    foo: {
        bar: "baz"
    },
    arr: [{name: "Luke Skywalker"}],
    0: "zero",
    zero: 0,
    nil: null,
    notTrue: false,
    funFunction: () => ({result: "success"})
}

const functionTestObject = {
    theFunction: function() {
        return "val = " + this.val;
    },
    theLambda: () => "val = " + this.val,

    val: "objectVal"
}

functionTestObject.theFunction.val = "functionVal";
functionTestObject.theLambda.val = "lambdaVal";

function TestConstructor() {
    this.result = "free ponies";

    this.getResult = function() {
        return "you get: " + this.result;
    }
}

describe("q get", () => {
    it("should return an existing value", () => {
        assert.equal(q(testObject, x => x.name), "myName");
    });

    it("should work with falsey properties", () => {
        assert.equal(q(testObject, x => x[0]), "zero");
    });

    it("should work with nested properties", () => {
        assert.equal(q(testObject, x => x.foo.bar), "baz");
    });

    it("should work with array values", () => {
        assert.equal(q(testObject, x => x.arr[0].name), "Luke Skywalker");
    })

    it("should return undefined for properties that don't exist", () => {
        assert.equal(q(testObject, x => x.nope), undefined);
    });

    it("should return undefined when trying to drill down from properties that don't exist", () => {
        assert.equal(q(testObject, x => x.nope.nada), undefined);
    });
    
    it("should return undefined when trying to access array indexes that don't exist", () => {
        assert.equal(q(testObject, x => x.arr[1].name), undefined);
    });

    it("should return falsey values: 0", () => {
        assert.equal(q(testObject, x => x.zero), 0);
    });
    
    it("should return falsey values: null", () => {
        assert.equal(q(testObject, x => x.nil, null));
    });
    
    it("should return falsey values: false", () => {
        assert.equal(q(testObject, x => x.notTrue), false);
    });

    it("should work with arrays", () => {
        assert.equal(q([1,2,3], x => x[2]), 3);
    });

    it("should work with string literals", () => {
        assert.equal(q("foo", x => x.length), 3);
    });

    it("should work with null literals", () => {
        assert.equal(q(null, x => x.nope), undefined);
    });

    it("should be able to return null literals", () => {
        assert.equal(q(null, x => x), null);
    });

    it("should be able to return undefined literals", () => {
        assert.equal(q(undefined, x => x), undefined);
    });

    it("should be able to return  number literals", () => {
        assert.equal(q(1.5, x => x), 1.5);
    });
 
});

describe("Object.q", () => {
    it("should work on a POCO", () => {
        assert.equal(testObject.q(x => x.foo.bar), "baz");
    })

    it("should work on an array", () => {
        assert.equal([1,2,3].q(x => x[1]), 2);
    })

    it("should work with string literals", () => {
        assert.equal("foo".q(x => x.length), 3);
    })    

    it("should work with functions", () => {
        function foo() {}
        assert.equal(foo.q(x => x.name), "foo");
    });

    it("should work with lambdas", () => {
        let foo = () => "success";
        assert.equal(foo.q(x => x()), "success");
    })

    it("should return undefined when accessing nonexistent function members", () => {
        function foo() {}
        assert.equal(foo.q(x => x.none.nada), undefined);
    });    
});

describe("q invoke", () => {
    it("should allow invoking member functions", () => {
        assert.equal(q(testObject, x => x.funFunction().result), "success");
    })

    it("should allow accessing function properties", () => {
        assert.equal(q(testObject, x => x.funFunction.name), "funFunction");
    })
    
    it("should return undefined when invoking nonexistent member functions", () => {
        assert.equal(q(testObject, x => x.sadFunction().result), undefined);
    })

    it("should return undefined when trying to invoke nonfunction members", () => {
        assert.equal(q(testObject, x => x.foo()), undefined);
    })

    it("should work with functions", () =>{
        function foo() { return "success"; }
        assert.equal(q(foo, x => x()), "success");
    })

    it("should work with lambdas", () =>{
        let foo = () => "success";
        assert.equal(q(foo, x => x()), "success");
    })

    it("should assign 'this' correctly in functions", () => {
        assert.equal(q(functionTestObject, x => x.theFunction()), functionTestObject.theFunction());
    })
    
    it("should assign 'this' correctly in lambdas", () => {
        assert.equal(q(functionTestObject, x => x.theLambda()), functionTestObject.theLambda());
    })

    it("should work with members of constructed objects", () => {
        var obj = new TestConstructor();
        assert.equal(q(obj, x => x.getResult()), obj.getResult());
    })
})