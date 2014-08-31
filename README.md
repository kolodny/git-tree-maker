Git Tree Maker
===

### Usage:

```js
var gitTreeMaker = require('git-tree-maker');
var co = require('co');
co(function *(){
  var dir = '/tmp/gittreepreview';
  var tree = {
    c1: {
      c2: {
        c5: {
          c6: {}
        },
        "c3.server": {
          c4: {
            c10: {}
          }
        },
        "c8.client": {
          c9: {}
        }
      },
      c3: {}
    }
  }
  yield gitTreeMaker(dir, tree);
})();
```
/tmp/gittreepreview will now contain something like this ![tree](http://i.imgur.com/uEe2ojl.png):
same as http://git-scm.com/book/ch3-6.html#More-Interesting-Rebases


### command line usage

Coming soon!