var fs = require('fs');

const gulpclass = './node_modules/@yggdrasil/devs/gulpclass.js';

try {
  if (fs.statSync(gulpclass)) {
    console.log('Using @yggdrasil gulpclass.');
    eval(fs.readFileSync(gulpclass).toString());
  }
} catch (error) {
  console.log(error);
}