# questionmark.js

A tiny and mighty utility for optional chaining in pure JavaScript.

Similar to [idx.macro](https://www.npmjs.com/package/idx.macro) but doesn't get babel involved.

```shell
# get it 
npm install questionmark
```

```javascript
const q = require('questionmark');

// If data.foo.bar.baz[0].bat[10] exists, its value will be returned.
// If any of bar, baz, baz[0], or bat[10] don't exist, we return undefined.
// You don't have to worry about accessing properties on null/undefined anymore!
data.q(q => q.foo.bar.baz[0].bat[10]);

// Not sure if `data` itself is null or undefined? No problem. 
// Use this alternative syntax:
q(data, q => q.foo.bar.baz[0].bat[10]);

// q works with function invocations as well:
data.q(q => q.doSomethingGreat().result);
```

## Tests

Lovingly tested in mocha.

```shell
npm test
```

## Contribute

Fork and PR please.

## Background: What is optional chaining?

Imagine you are accessing a property from a deeply nested JSON object (perhaps from a server response?)

```javascript
fetch("https://www.example.com/api/libraryDb")
    .then(res => res.json())
    .then(json => {        
        let book = json
            .libraries["UL London"].shelves["Science Fiction"]
            .authors["Herbert, Frank"].mostPopularBook.title;
        $("#book-of-the-month")
            .text("The book of the month is: " + book);
    });
```

But if `json`, or `json.libraries`, or `json.libraries["UL London"]`, or any other value in that chain is `null` or `undefined`, your callback will throw an exception. You have to write some verbose guard clauses against that:

```javascript
    let book = !!json && !!json.libraries
        && !!json.libraries["UL London"]
        && !!json.libraries["UL London"].shelves
        && !!json.libraries["UL London"].shelves["Science Fiction"]
        && !!json.libraries["UL London"].shelves["Science Fiction"].authors
        && !!json.libraries["UL London"].shelves["Science Fiction"].authors["Herbert, Frank"]
        && !!json.libraries["UL London"].shelves["Science Fiction"].authors["Herbert, Frank"].mostPopularBook
        && json.libraries["UL London"].shelves["Science Fiction"].authors["Herbert, Frank"].mostPopularBook.title
        || "unknown";
```

Eugh!

Some languages have optional chaining to indicate that you only want to access a property if it exists; if not, further drill-downs just give you a `null` value. This way you don't have to test every single step in the chain, and can just check whether you have a real value at the end.

This is also [proposed for JavaScript](https://github.com/tc39/proposal-optional-chaining):

```javascript
    let book = json?.libraries?["UL London"]?
        .shelves?["Science Fiction"]?
        .authors?["Herbert, Frank"]?
        .mostPopularBook?.title || "unknown"
```

That's much better. `q.js` aims to tide us over while we wait.

```javascript
    let book = json.q(q => 
        q.libraries["UL London"].shelves["Science Fiction"]
        .authors["Herbert, Frank"].mostPopularBook.title) 
    || "unknown";
```