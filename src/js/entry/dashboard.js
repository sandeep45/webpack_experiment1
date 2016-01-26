// makes the html file a dependency and therefore copies it over to the dist folder
require("html/dashboard.html");

var calc = require("js/helpers/calculator.js");

console.log("Starting entry.js");

var React = require('react');
var ReactDOM = require('react-dom');
require("jquery");
require("css/style.css")


require(["js/helpers/sayyo.js"], function(sayyo){
  sayyo();
});

var Content = require("js/components/content.js");

ReactDOM.render(
  <Content />,
  window.document.getElementById("content")
);

var img = document.createElement('img');
img.src = require('images/sun_mexico.jpg');
$("body").append(img);

console.log("ending entry.js");