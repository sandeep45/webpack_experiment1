var React = require("react");
var ReactDOM = require('react-dom');


var VisitorsTable = React.createClass({
  render: function(){
    return (
      <table>
        <caption>
          Visitors
        </caption>
        <thead>
          <tr>
            <th> Id </th>
            <th> Name </th>
            <th> Email </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 1 </td>
            <td> Sandeep </td>
            <td> sandeep45@gmail.com </td>
          </tr>
          <tr>
            <td> 2 </td>
            <td> Arneja </td>
            <td> sandeep@gmail.com </td>
          </tr>
          <tr>
            <td> 3 </td>
            <td> SA </td>
            <td> sandeep45@gmail.com </td>
          </tr>
          <tr>
            <td> 4 </td>
            <td> JK </td>
            <td> sandeep45@gmail.com </td>
          </tr>
          <tr>
            <td> 51 </td>
            <td> jasmine </td>
            <td> sandeep45@gmail.com </td>
          </tr>
        </tbody>
      </table>
    )
  }
});

module.exports = VisitorsTable;