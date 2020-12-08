// This code was largely based on the Lab13 code that was gone over by Dr.Port and Dr.Kazman to generate the server
//Also relied on assignment1 examples as well a little bit 

//the specific code below is refrenced from lab13 when Dr.Kazman went over info-servers for ex.4 
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./Public/product_data.js');
var products = data.products;
var fs = require('fs');
const queryString = require('query-string');

app.use(express.static('./Public'));
app.use(myParser.urlencoded({ extended: true }));

app.post("/process_quantity_form", function (request, response) {
    let POST = request.body;
    
    if (typeof POST['submitPurchase'] != 'undefined') {
                var hasvalidquantities=true; // assuming that the variable will be true// 
                var hasquantities=false
                for (i = 0; i < products.length; i++) {
                    
                                qty=POST[`quantity${i}`];
                                hasquantities=hasquantities || qty>0; // If its value is larger than 0 then it is good//
                                hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
                } 
                // if all quantities are valid, generate the invoice// 
                const stringified = queryString.stringify(POST);
                if (hasvalidquantities && hasquantities) {
                    response.redirect("./invoice.html?"+stringified); // using the invoice.html and all the data that is input//
                }  
                else {response.send('Enter a valid quantity!')} 
            }
        });

function isNonNegInt(stringToCheck, returnErrors = false) {
    errors = []; // assume no errors at first
    if(stringToCheck ==""){stringToCheck = 0;}
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
//this is the correct code formatting for the code to be properly sent to the server. ( before it had a hanging ' }); ' )