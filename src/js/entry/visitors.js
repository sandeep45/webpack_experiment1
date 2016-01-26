// makes the html file a dependency and therefore copies it over to the dist folder
require("html/visitors.html");

var calc = require("js/helpers/calculator.js");

console.log("starting content.js");

var React = require("react");
var ReactDOM = require('react-dom');

require("jquery");
var path = require("path");

require("css/visitors.css");

require(["js/helpers/sayyo.js"], function(sayyo){
  sayyo();
});


VisitorsTable = require("js/components/visitors_table.js");

ReactDOM.render(
  // React.createElement(VisitorsTable, null),
  <VisitorsTable />,
  window.document.getElementById("visitors")
);

console.log("ending content.js");