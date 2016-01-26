var path = require("path");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  // devtool: "eval-source-map",
  context: path.join(__dirname, "src"), //The base directory (absolute path!) for resolving the entry option.
  entry: {
    dashboard: "js/entry/dashboard.js",
    visitors: "js/entry/visitors.js",
    dashboard_and_visitors: "html/dashboard_and_visitors.html"
  },
  output: {
    path: path.join(__dirname, "dist"), //path to where webpack will build your stuff
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js",
    publicPath: "/dist/" //specifies the public URL address of the output files when referenced in a browser
  },
  plugins: [
    new CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
      minChunks: 2
    }),
    // new CommonsChunkPlugin("entry-commons.js")
  ],
  module: {
    loaders: [
      {
        test: /.css$/,
        loader: "style!css"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react']
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ["react-hot", "babel?presets=react"]
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      },
      {
        test: require.resolve("jquery"),
        loader: 'expose?$'
      }
    ]
  },
  resolve: {
    /* Calling require('modulename') without prepending ./ to the module name will attempt
    to load the module from one of the third party module folders, node_modules or web_modules. */
    modulesDirectories: ['node_modules', 'bower_components', 'web_modules'],
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json', '.coffee'],
    root: [
      path.resolve(__dirname, './src'),
    ]
  }

}