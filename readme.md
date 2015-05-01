Build Fu
========

A small library providing helpers for building projects from code based tools like gulp.

## Installation

  npm install build-fu --save-dev

## Example

```javascript
    var bf = new BuildFu();
    return bf.cleanTarget('./out')
        .fork()
        .compile('./src', './out')
        .compile('./test/src', './test/out')
        .join()
        .copy('./src', './out', { extensions: ['js', 'json']});
        .then(function() { 
            console.log('Finished compiling');
        });
```

## Tests

  npm test