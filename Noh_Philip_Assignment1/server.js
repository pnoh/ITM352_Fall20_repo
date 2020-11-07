// This code was largely based on the Lab13 code that was gone over by Dr.Port and Dr.Kazman to generate the server
//Also relied on assignment1 examples as well a little bit 

var express = require('express');
var app = express(); //express is the framework through Node for the server 
var myParser = require("body-parser"); //body parser extracts the body of the request 
var data = require('./Public/product_data.js'); //This connects the products array through the proper directory 
var products = data.products; //assigns the array to data.products
var fs = require('fs');
const queryString = require('query-string'); //The query string allows us to access stored data and print the code

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

//the app.post connects the form code from the display and invoice to request the server to POST 
app.post("/process_quantity_form", function (request, response) {
    let POST = request.body;
    
    if (typeof POST['submitPurchase'] != 'undefined') {
                var hasvalidquantities=true; // assuming that the variable will be true// 
                var hasquantities=false
                for (i = 0; i < products.length; i++) {
                    
                                qty=POST[`quantity${i}`];
                                hasquantities=hasquantities || qty>0; // Says the quantity should be above 0
                                hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // Says the quantity should be above 0 and non negative. Things are valid
                // If everything is confirmed to be valid, it opens up the invoice
                const stringified = queryString.stringify(POST);
                if (hasvalidquantities && hasquantities) {
                    response.redirect("./invoice.html?"+stringified); // This uses invoice.html
                }  
                else {response.send('Enter a valid quantity!')} //if there are still errors or invalid things, this is printed 
    }
}

function isNonNegInt(stringToCheck, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(stringToCheck) != stringToCheck) errors.push('Not a number!'); // Check if string is a number value
    if (stringToCheck < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(stringToCheck) != stringToCheck) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.listen(8080, () => console.log(`listening on port 8080`));
})