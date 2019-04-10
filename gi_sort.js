"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 12
   Case Problem 4

   Author: Ethan Gruenemeier
   Date:  4.8.19
   
   Filename: gi_sort.js
   
   Global Variables:
   tableData
      An 2-dimensional array of the data found in the body of the web table
      
   dataCategories
      An array of the column titles found the head of the web table
      
   sortIndex
      The index number of the column by which the web table should be
      sorted where 0 = 1st column, 1 = 2nd column, etc.
      
   sortDirection
      A value indicating direction of the sorting where a value of 1 sorts 
      the data in ascending order and a value of -1 sorts the data in descending order
	
   
   
   Functions List:   
   defineDataArray()
      Extracts values from the body of the web table and stores them in the
      tableData array
      
   writeTableData()
      Writes the sorted data into the table rows and cells       
      
   defineColumns()
      Extracts values form the column heads of the web table and stores 
      them in the dataCategories array; also sets up the onclick event
      handlers for the column heads so that the table can be sorted by
      clicking a table heading cell.
           
   columnSort(e)
      Event handler function that sorts the table data when a column
      heading is clicked  
   
   dataSort2D(a, b)
      Compare function used to sort numeric and alphabetical data from
      a 2-dimensional array 
    

*/
// the gloabl arrays and variables used throughout the program
var tableData = [];
var dataCategories = [];
var sortIndex = 0;
var sortDirection = 1;
//Loads the three functions on load.
window.addEventListener("load", function () {
      defineDataArray();
      writeTableData();
      defineColumns();
});



function defineDataArray() {
      //creates a like array with the table rows
      var tableRows = document.querySelectorAll("table.sortable tbody tr");
      for (var i = 0; i < tableRows.length; i++) {
            //this gets the text content of the table cells and puts them in to a new array that is created and then switches it into a global variable
            var rowCells = tableRows[i].children;
            var rowValues = new Array(rowCells.length);
            for (var j = 0; j < rowCells.length; j++) {
                  rowValues[j] = rowCells[j].textContent;
            }
            tableData[i] = rowValues;
      }
      //this sorts the gloal array with the textcontent of the cells
      tableData.sort(dataSort2D);
}


function writeTableData() {
      //this creates all a new table body with the sorted text content of the global var
      var newTableBody = document.createElement("tbody");
      for (var i = 0; i < tableData.length; i++) {
            var tableRow = document.createElement("tr");
            for (var j = 0; j < tableData[i].length; j++) {
                  var tableCell = document.createElement("td");
                  tableCell.textContent = tableData[i][j];
                  tableRow.appendChild(tableCell);
            }
            newTableBody.appendChild(tableRow);
      }
      //this replaces the old table
      var sortTable = document.querySelector("table.sortable");
      var oldTableBody = sortTable.lastElementChild;
      sortTable.replaceChild(newTableBody, oldTableBody);
}

function defineColumns() {
      // Create a style element
      var styleSheet = document.createElement("style");
      // Add that element to the head.
      document.head.appendChild(styleSheet);

      // Insert the following rule into the stylesheet:
      styleSheet.sheet.insertRule(
            "table.sortable thead tr th { \
                  cursor: pointer;\
            }", 0);

      // Insert the following rule into the stylesheet:
      styleSheet.sheet.insertRule(
            "table.sortable thead tr th::after { \
                  content: '\\00a0';\
                  font-family: monospace;\
                  margin-left: 5px;\
            }", 1);

      // Insert the following rule into the stylesheet:
      styleSheet.sheet.insertRule(
            "table.sortable thead tr th:nth-of-type(1)::after {\
                  content: '\\25b2';\
            }", 2);

      // Get all of the table headers
      var thHeadings = document.querySelectorAll("table.sortable thead th");
      // Loop through the headers
      for (var i = 0; i < thHeadings.length; i++) {
            // Add the heading text content to the dataCategories array.
            dataCategories.push(thHeadings[i].textContent);
            // Add the onclick handler to the header that calls the columnSort function.
            thHeadings[i].onclick = columnSort;
      }
}

/**
 * Sorts the columns when it is clicked.
 */
function columnSort(e) {
      // Gets the text content from the targeted element.
      var columnText = e.target.textContent;
      // Gets the index of the column from the dataCategories array.
      var columnIndex = dataCategories.indexOf(columnText);

      // If the columnIndex is the same as the sortIndex, change the sortDirection.
      if (columnIndex === sortIndex) {
            sortDirection *= -1;
      } else {
            //else, set the sortIndex equal to the value of the column index
            sortIndex = columnIndex;
      }

      // Get the column number.
      var columnNumber = columnIndex + 1;

      // Get the style sheet for the columns.
      var columnStyles = document.styleSheets[document.styleSheets.length - 1];

      // Delete the third style rule.
      columnStyles.deleteRule(2);

      // If the sortDirection is up then add the up arrow ^
      if (sortDirection === 1) {
            columnStyles.insertRule(
                  "table.sortable thead tr th:nth-of-type(" + columnNumber + ")::after { \
                        content: '\\25b2';\
                  }", 2);
      } else {
            // Else add the down arrow v
            columnStyles.insertRule(
                  "table.sortable thead tr th:nth-of-type(" + columnNumber + ")::after { \
                        content: '\\25bc';\
                  }", 2);
      }
      // Sort the table data using the dataSort2D function.
      tableData.sort(dataSort2D);
      // Write the table data.
      writeTableData();
}



function dataSort2D(a, b) {
      if (isNaN(parseFloat(a[sortIndex])) === false) {
            return (a[sortIndex] - b[sortIndex]) * sortDirection;
      } else {
            var astring = a[sortIndex].toLowerCase();
            var bstring = b[sortIndex].toLowerCase();

            if (bstring > astring) return -sortDirection;
            if (bstring < astring) return sortDirection;
            return 0;
      }
}