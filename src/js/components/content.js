console.log("starting content.js");

React = require("react");
var calc = require("js/helpers/calculator.js");

var Content = React.createClass({
  render: function(){
    return (
      <div>
        This is some Content 1234567890
      </div>
    )
  }
});

module.exports = Content;
console.log("ending content.js");