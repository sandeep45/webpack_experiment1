## Common JS Module

This is the format used in Node.js. It was built for the server side when compared to it coutner part AMD which was build for the browser. With webpack, it doen't matter which one use, as it supports both.

It synchronously loads the module. Webpack also supports CommonJS and Async loding. Here is an example:

Calculator Module:

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
````

Then in Main.js we will be using the calculator module:

````
\\ main.js

c = require("./calcaultor.js")
alert(c.add(4,5));
alert(c.subtract(2,1));

````

We used `module.exports` to expose the module and then we used `require` to load in a file.

main.js will not work directly in the browser, as the browser doesn't support require and doesn't have module object. To make this work we will use webbpack and compile main.js in to another file which can be processed by the browser

````
weback ./main.js build.js
````


At build time the require call is intelligently replaced with code which loads calculator.js
It also takes care of multiple depencies, as in this example calculator could have required another module, lets say `Logger` in `logging.js`

Refernece:
- https://webpack.github.io/docs/commonjs.html

## require function

When requiring a module, the path to the file is passed in. The path is normally relative from the current file. So it starts with `./`. If this is missing and just the name is passed then its assumed to be a vendor module and checked in `node_modules`, `web_modules`  etc.

Reference:
- http://webpack.github.io/docs/resolving.html

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

Reference:
- https://github.com/webpack/docs/wiki/configuration

## Dependecy Management

Run any script specified in `package.json` under the `scripts` section.
Command: `npm run xyz`
Here `xyz` is the identifier setup for the script in package.json

NODE_ENV=production webpack -p --config webpack.production.config.js
webpack.production.config.js

Reference:
- http://tooling.github.io/book-of-modern-frontend-tooling/dependency-management/webpack/getting-started.html



## Setting up Hot Module Replacement
Adding the index.html to the entry point along with the file loaded will copy it over to `dist` and then we can start the `webpack-dev-server` with the `--hot` and `--inline` option. This will open up index.html and all changes will inserted hot via socket.io, without refreshing the page.

Reference:
- https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
- http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html

## To compile JSX in to html
Use the babel loader. It will turn your js file with JSX in to pure JS.

Reference:
- https://github.com/babel/babel-loader

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

Reference:
- https://davidwalsh.name/upgrade-nodejs

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

A light weight server: `serve`
https://www.npmjs.com/package/serve

````
npm install serve
````

Another choice is python's light weight server.

````
python -m SimpleHTTPServer
````

My choice is to use the `webpack-dev-server`

````
npm install webpack-dev-server --save-dev

````

To use it:

`webpack-dev-server`

## Generat entry HTML File

We want to build file in `dist` with a `hash` in it. So the file should look like

`app.md5checksumhere.js`

And in our html file we want:

````
<script src='app.hash.js'></script>
````

Everytime webpack compiles the hash is changed, the hash changes and then updating the HTML is a pain.
The hash is available in the stats.

````
~/code/webpack_experiment1 (master)$ webpack --progress --colors --watch --display-error-details --display-chunks --display-reasons --display-origins
Hash: 6084c56567cfe1654e6b
Version: webpack 1.12.11
Time: 1647ms
                                                Asset       Size  Chunks             Chunk Names
                          dashboard_and_visitors.html  397 bytes          [emitted]
                                       dashboard.html  291 bytes          [emitted]
                 fda0cbaaf966dc97025bfa9a30b2f156.jpg     683 kB          [emitted]
                                        visitors.html  289 bytes          [emitted]
             dashboard.6084c56567cfe1654e6b.bundle.js    6.06 kB       0  [emitted]  dashboard
                      1.6084c56567cfe1654e6b.chunk.js    1.71 kB       1  [emitted]
dashboard_and_visitors.6084c56567cfe1654e6b.bundle.js  168 bytes       2  [emitted]  dashboard_and_visitors
              visitors.6084c56567cfe1654e6b.bundle.js    13.5 kB       3  [emitted]  visitors
                                           commons.js     956 kB       4  [emitted]  commons
chunk    {0} dashboard.6084c56567cfe1654e6b.bundle.js (dashboard) 5.46 kB {4} [rendered]
    > dashboard [0]
     + 6 hidden modules
chunk    {1} 1.6084c56567cfe1654e6b.chunk.js 1.58 kB {0} {3} [rendered]
    > [0] 25:4-27:6
    > duplicate [0] 28:4-30:6
     + 1 hidden modules
chunk    {2} dashboard_and_visitors.6084c56567cfe1654e6b.bundle.js (dashboard_and_visitors) 73 bytes {4} [rendered]
    > dashboard_and_visitors [0]
     + 1 hidden modules
chunk    {3} visitors.6084c56567cfe1654e6b.bundle.js (visitors) 12.6 kB {4} [rendered]
    > visitors [0]
     + 6 hidden modules
chunk    {4} commons.js (commons) 911 kB [rendered]
     + 163 hidden modules
````

Lucky for us, there is a plugin for it:

https://github.com/ampedandwired/html-webpack-plugin

Or we could render the HTML server side like

````
<script src="/app.<?= hash ?>.js"></script>
````

Reference:
- https://github.com/webpack/webpack/issues/86
- https://webpack.github.io/docs/long-term-caching.html
- https://www.npmjs.com/package/webpack-dev-server
- http://webpack.github.io/docs/webpack-dev-server.html


## List only top level npm packages installed

`npm list --depth=0`

## Building HTML files for Entry Points

To run the entry js file, we need an html file which includes the js entry file along with the common js file and any other supporting HTML structure. One way to do so is to build the html file in the `/src/html` directory and then have them copied over to the `dist` folder when webpack builds them. THis can be accomplished by making the html file a dependency  of the js file.

So lets say we have `src/js/visitors.js` as the entry js file and `src\html\visitors.html` as its html file.

Now in the js file we will add

````
require("html/visitors.html");
````

In webpack.config.js we will teach webpack how to require html files:  Now we build with webpack the html file will be copied over to the `dist` folder. This is done by adding the file loader loader. It just copies over any html file. I have it setup to not copy over the templates folder. This is optional, and you will see in the next option why i did so.

````
{
  test: /\.html$/,
  loader: "file?name=[name].[ext]",
  exclude: /templates/
}
````

The issue with this approach is that I am using `hash` in the file path and in the name of the file. The hash is unique to every build. So my html files, need to refer to this. Here is an example of how it would look like:

````
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>/dist/[hash]/</h1>
  <h1>
    Came from templates/index.html
  </h1>
  <script src="/dist/e4857e3abf31163de0f4/commons_e4857e3abf31163de0f4.js">
</body>
</html>
````

Here you can notice the hash in the script tag. Setting this up manually everytime I do a build is very tedious.

To solve this, we have two solutions:

1. Build the template server side, and have webpack tell us after every build what the `hash` value is.

When we do a webpack build, the output looks like this:

````
~/code/html-webpack-plugin/examples/html-loader (master)$ webpack --watch
Hash: e4857e3abf31163de0f4
Version: webpack 1.12.11
Time: 319ms
     Asset       Size  Chunks             Chunk Names
 bundle.js    1.49 kB       0  [emitted]  main
index.html  169 bytes          [emitted]
   [0] ./example.js 101 bytes {0} [built]
Child html-webpack-plugin for "index.html":
       [0] /Users/sandeeparneja/code/html-webpack-plugin/lib/loader.js!./index.html 312 bytes {0} [built]
        + 2 hidden modules
````

You can see on the first line, there is the hash we need. Webpack can be configure to spit out JSON which we can write to a file, and then update that to a database field, which is then used when server is building the html files.

To make this a bit more streamlined we can use the `assetsPluginInstance`

````
npm install assets-webpack-plugin --save-dev

\\webpack.config.js
var AssetsPlugin = require('assets-webpack-plugin');
plugins: [
  assetsPluginInstance,
]
````

This will now output a file named `webpack-assets.json`. It will have all the bundles and their paths with hashes in them, e.g.

````
{
  "dashboard": {
    "js": "/dist/e4857e3abf31163de0f4/dashboard_e4857e3abf31163de0f4.bundle.js"
  },
  "dashboard_and_visitors": {
    "js": "/dist/e4857e3abf31163de0f4/dashboard_and_visitors_e4857e3abf31163de0f4.bundle.js"
  },
  "visitors": {
    "js": "/dist/e4857e3abf31163de0f4/visitors_e4857e3abf31163de0f4.bundle.js"
  },
  "commons": {
    "js": "/dist/e4857e3abf31163de0f4/commons_e4857e3abf31163de0f4.js"
  }
}
````

I dont like this approach, because it couples my front end to the backend for building html files. It feels like spring 19 miles and hten walking the last mile. I feel like if we can have come this far, then lets build it all in webpack and now have to rely on the server to build our front end HTML files.

So as another soltion we will build the files in webpack. This can be achieved by using: `html-webpack-plugin`. It will build the html file by taking an html template file and inserting the script src in its body along with hash.

````
\\ webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin')
plugins: [
  new HtmlWebpackPlugin({
    title: "AG Index",
    filename: "index.html",
    template: "templates/index.html",
    chunks: ['commons', "visitors"], // only these chunks are put in to the HTML file
    inject: 'body',
    showErrors: true
  })
]
````

Now i have a templates folder with how i want my index.html to look like:

````
\\ src\templates\index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1><%= webpackConfig.output.publicPath %></h1>
  <h1>
    Came from templates/index.html
  </h1>
</body>
</html>
````

Now when I do `webpack`, I will get:

````
\\ dist\index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>/dist/e4857e3abf31163de0f4/</h1>
  <h1>
    Came from templates/index.html
  </h1>
  <script src="/dist/e4857e3abf31163de0f4/commons_e4857e3abf31163de0f4.js">
  </script><script src="/dist/e4857e3abf31163de0f4/visitors_e4857e3abf31163de0f4.bundle.js"></script>
</body>
</html>
````

## Webpack Dev Server & HtmlWebpackPlugin

as long as you have a newer* version of webpack dev server and html webpack plugin it will work. I have:

````
{
  "webpack-dev-server": "^1.14.1",
  "html-webpack-plugin": "^2.7.2"
}
````

With an older version of not locally installed webpack-dev-server I kept getting this error on start: `Error: Parameter 'dependency' must be a Dependency`

Standalone example to show it: https://gist.github.com/ampedandwired/becbbcf91d7a353d6690

Here you can see that the HtmlWebpackPlugin plugin added the entry files in the body tag. Also I was able to access information in webpack.config.js for other customsization of the index file.

Note: I noticed an issue with the hash in the public_path. It had the `[hash]` variable rather than the value of the hash. To resovle it i manuualy made the fix mentioned in this commit: https://github.com/ampedandwired/html-webpack-plugin/commit/41a255a2f1a0be054b03ceb9231f538ffbf350af

At the time of this writing, i did not find it in master, but I am sure it will get there soon.

Reference:
- https://github.com/sporto/assets-webpack-plugin
- https://www.npmjs.com/package/html-webpack-plugin

Another way to do so will be to build the html file,

## Hash in Output URL and webpack-dev-server HOT

If you are want webpack-dev-server to return content as it changes HOT without refreshing the page, the you can start it like:

`webpack-dev-server --debug --inline --hot --progress --colors --display-reasons`

This will also work with with html-webpack-plugin and show files being built by the plugin.

The issue is if you have `hash` in the name of the file. This is for long term caching and done like this:

````
output: {
    path: path.join(__dirname, "dist", "[hash]"), //path to where webpack will build your stuff
    filename: "[name]_[hash].bundle.js",
    chunkFilename: "[id]_[hash].chunk.js",
    publicPath: "/dist/[hash]/" //specifies the public URL address of the output files when referenced in a browser
  }
````

This will add a unique hash to each file, but this also broke the hot loding of webpack-dev-server. Now everyime you make a change to a file, you will see webpack dev server, compile them and put them in memory ready for emitting and pushing the package down, but the hash has changed. Here is the output you will see on making a change:

````
webpack: bundle is now INVALID.
Hash: b909c6adb36016fa602e
Version: webpack 1.12.12
Time: 296ms
                                   Asset       Size  Chunks             Chunk Names
dashboard_b909c6adb36016fa602e.bundle.js    5.91 kB       0  [emitted]  dashboard
         1_b909c6adb36016fa602e.chunk.js    1.59 kB       1  [emitted]
 visitors_b909c6adb36016fa602e.bundle.js    13.4 kB       2  [emitted]  visitors
         commons_b909c6adb36016fa602e.js    1.22 MB       3  [emitted]  commons
    0.0ff8b954830aad4690e6.hot-update.js    1.91 kB       0  [emitted]  dashboard
    0ff8b954830aad4690e6.hot-update.json   36 bytes          [emitted]
                              index.html  579 bytes          [emitted]
chunk    {0} dashboard_b909c6adb36016fa602e.bundle.js, 0.0ff8b954830aad4690e6.hot-update.js (dashboard) 5.51 kB {3} [rendered]
  [255] ./src/js/components/content.js 1.89 kB {0} [built]
     + 6 hidden modules
chunk    {1} 1_b909c6adb36016fa602e.chunk.js 1.58 kB {0} {2}
     + 1 hidden modules
chunk    {2} visitors_b909c6adb36016fa602e.bundle.js (visitors) 12.7 kB {3}
     + 7 hidden modules
chunk    {3} commons_b909c6adb36016fa602e.js (commons) 1.14 MB [rendered]
     + 250 hidden modules
Child html-webpack-plugin for "index.html":
    chunk    {0} index.html 412 kB
         + 3 hidden modules
webpack: bundle is now VALID.
````

Line 2 shows that the hash has changed and now there is no `index.html` in the `dist` folder.

Now i could run `webpack --watch` and `webpack-dev-server --hot --inline`. This will write the `hash` folder on every change and webpack-dev-server would work, but it breaks the hot loading part as the url has now changed so I will have to refresh the page.

To solve this issue I have two config files: `webpack.config.js` for dev and `webpack.production.config.js` for prod.

In my dev I dont use hash and in prod I use hashes. When compiling for prod i pass the config file as an option: `webpack --config webpack-production.config.js --progress`

## More References:
- https://egghead.io/lessons/javascript-intro-to-webpack
- https://github.com/petehunt/webpack-howto
- https://www.youtube.com/watch?v=VkTCL6Nqm6Y&feature=youtu.be
- http://webpack.github.io/docs/list-of-tutorials.html
- http://alexhusakov.com/posts/Set-up-Webpack
- https://christianalfoni.github.io/react-webpack-cookbook/
- https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460
- http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
- http://survivejs.com/webpack_react/webpack_compared/