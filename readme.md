## Common JS Module

Synchronous
Made for NODE
Webpack suports it, and also supports its syntax for Async loading

````
\\ calculator.js

var calculator = {
  add: function(a,b){
    return a+b;
  },
  subtract: function(a,b){
    return a-b;
  }
};
module.exports = calculator;

\\ main.js

c = require("./calcaultor.js")
alert(c.add(4,5));
alert(c.subtract(2,1));

````

Webpack compiles main.js: `weback main.js build.js`
At build time the require call is replaced with code which loads calculator.js
It also takes care of multiple depencies, as in this example calculator could have required another module, lets say `Logger` in `logging.js`

Refernece: https://webpack.github.io/docs/commonjs.html

## require function

When requiring a module, the path to the file is passed in. The path is normally relative from the current file. So it starts with `./`. If this is missing and just the name is passed then its assumed to be a vendor module and checked in `node_modules`, `web_modules`  etc.

Reference: http://webpack.github.io/docs/resolving.html

## webkack option - resolve.root

Setting up a root directory makes specifying the path in requiring much more manageable.

In the webpack.config.js I have added:

````
resolve:{
  root: [
    path.resolve(__dirname, './src'),
  ]
}
````

Now when I need to specify I can assume the base folder is `src` and then I can specify from there.
Here e.g.

````
require("css\style.css");
````

Now i can do this from any file in any subdirectory and it will get the file from:

````
  __dirname + src\css\style.css`
````

## Build JS files via webpack
`webpack --progress --colors --watch --display-error-details`

## Webpack Bundles

A bundle is a group of modules, compiled in to one file, which is downloaded together and therefore optimized. It does not include code not needed by these modules or shared by other modules.

## Webpack Configuration

https://github.com/webpack/docs/wiki/configuration

## Dependecy Management

http://tooling.github.io/book-of-modern-frontend-tooling/dependency-management/webpack/getting-started.html

Run any script specified in `package.json` under the `scripts` section.
Command: `npm run xyz`
Here `xyz` is the identifier setup for the script in package.json

NODE_ENV=production webpack -p --config webpack.production.config.js
webpack.production.config.js

## Setting up Hot Module Replacement
Adding the index.html to the entry point along with the file loaded will copy it over to `dist` and then we can start the `webpack-dev-server` with the `--hot` and `--inline` option. This will open up index.html and all changes will inserted hot via socket.io, without refreshing the page.

https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html

## To compile JSX in to html
Use the babel loader. It will turn your js file with JSX in to pure JS.

https://github.com/babel/babel-loader

## publicPath

This is path which webpack will use when building full urls.

In Dev i have this as `/dist/` as my images are right where the other assets are.
In Prod i could have this as `http://cdn.yoyo.com` as that's where I want it to load assets from

Here is an example where qebpack will build the full url:

````
  var img = document.createElement('img');
  img.src = require('../../images/sun_mexico.jpg');
  $("body").append(img);
````

Note here that the image is prettty big and `webpack.config.js` is setup to give full url when image is big.

````
{
  test: /\.(png|jpg)$/,
  loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
}
````

## Loaders
A list of commonly used loaders with examples:

http://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/

I found myself using `css_loader, babel_loader, file_loader, react-hot, url_loader and expose_loader` right form the begininig.

## You need node, and best is to upgrade it

````
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

````

https://davidwalsh.name/upgrade-nodejs

### Npm options

I used npm to install things like webpack, babel, jquery etc. The syntax is:

`npm install package_name`

To make the package globalally available in all project use option `--global`. or to install it locally leave out this option and then the package is installed locally under `./node_modules/`

To add the package as a dependecy use the `--save` option. This will add the package as a dependency in package.json file.

To add the package as a development dependecy use the `--save-dev` option. This will add the package as a dev-dependency in package.json file.

This enables that when someone runs `npm install` they will get all the dependencies

## modules

Webpack builds all depencies in to 1 output file. It will require all modules needed and place them inline. To build a module just do

`module.exports = Xyz;`

And then to load it do

`var Xyz = require("../components/xyz.js");`

To load it asynchronously do

````
require(["../components/xyz.js"], function(){
  // do here after async load
})
````

The above will cause an additional ajax request to be made, to load the module.

#Multiple entry points
seperate entry points for different pages, keeping the entire JS footprint small, e.g. Feeds, Foooters etc.
Share the common code

## When multiple entries have common code sharing/caching

Common code in multiple entry point modules can be moved out to a common model. In webpack.config.js add

````
module.exports = {
  entry: {
    dashboard: "js/entry/dashboard.js",
    visitors: "js/entry/visitors.js",
  },
  output: {
    path: path.join(__dirname, "dist"), //path to where webpack will build your stuff
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/dist/" //specifies the public URL address of the output files when referenced in a browser
  },
  plugins: [
    new CommonsChunkPlugin({
      name: "entry-commons",
      filename: "entry-commons.js",
      chunks: ["dashboard", "visitors"]
    })
  ]
}
````

Here we added the `chunkFileName` option and the `plugins` option. In the plugins option we have specified that all comming stuff in the chunks dashboard and visitors, to be put in entry-commons.js

If we dont specify the chunks option, then it will look for common stuff among all files. I didn;t find that option very useful becuase i had one html file, with which it could not find anything common and there the common file had nothing which could be shared along. The short hand for this config is:

````
plugins: [
    new CommonsChunkPlugin("commons.js")
  ]
````

We can also specify `minChunks` option to 2 and then if two or more files have a chunk then it will be moved to a seperate common file

````
plugins: [
  new CommonsChunkPlugin({
    name: "commons",
    filename: "commons.js",
    minChunks: 2
  })
]
````

Now in our html files where we are loading `dashboard` or `visitors`, we will add the `entry-commons.js` file above it.

````
  <script type="text/javascript" src="commons.js"></script>
  <script type="text/javascript" src="visitors.js"></script>
````

We could also load some stuff dynamically, and then that peice will move to chunk loaded on demand.

We load a module dynamically like this:

````
require(["js/helpers/sayyo.js"], function(sayyo){
  sayyo();
});
````

Now when being built, this will build a file like `1.chunk.js`.

And then when this entry file is loaded in the browser it will make an ajax call for it.


Reference:
- https://webpack.github.io/docs/code-splitting.html
- https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
- https://github.com/webpack/docs/wiki/list-of-plugins#commonschunkplugin
- https://webpack.github.io/docs/code-splitting.html

## HTML files for each entry point

Build html file for each entry point and have them in the source. They should load the js module file from the `dist` folder as that is where webpack will putting the bundles. E.g.

````
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard.html</title>
</head>

<body>
  <h1>Dashboard.html<h1>

  <div id="content">
  </div>

  <script type="text/javascript" src="/dist/commons.js"></script>
  <script type="text/javascript" src="/dist/dashboard.bundle.js"></script>
</body>
</html>
````

To copy over the html file from `dist` to `src` we need to add it as a dependency in the entry js.
So in `dashbaord.js` add

````
require("html/dashboard.html");
````

And in webpack.config.js we need to teach it to copy over html files required.

````
module: {[
{
  test: /\.html$/,
  loader: "file?name=[name].[ext]"
}
]}
````

Reference:
- https://github.com/webpack/webpack/issues/536

## Debugging & Learning Webpack

always have `--display-error-details` option, so you know whats going on.
Also consider adding these options `--display-chunks` and `--display-reasons`

Final is:

````
webpack --progress --colors --watch --display-error-details --display-chunks --display-reasons
````

## Lightweight Dev Server

````
npm install webpack-dev-server -g
````

To use it:

`webpack-dev-server`

Reference:
- https://www.npmjs.com/package/webpack-dev-server
- http://webpack.github.io/docs/webpack-dev-server.html


## More Reference:
- https://egghead.io/lessons/javascript-intro-to-webpack
- https://github.com/petehunt/webpack-howto
- https://www.youtube.com/watch?v=VkTCL6Nqm6Y&feature=youtu.be
- http://webpack.github.io/docs/list-of-tutorials.html


