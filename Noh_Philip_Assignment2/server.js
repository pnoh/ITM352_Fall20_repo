// This code was largely based on the Lab13 code that was gone over by Dr.Port and Dr.Kazman to generate the server
//Also relied on assignment1 examples as well a little bit 

//the specific code below is refrenced from lab13 when Dr.Kazman went over info-servers for ex.4 

//Worked with Joshua on the new code for Assignment 2. We looked at lab14 and Assignment2 for reference
var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require('fs');
var data = require('./Public/product_data.js');
var products = data.products;
var qs = require('querystring');
var user_data_file = 'user_data.json';

app.all('*', function(request, response, next){
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({extended: true}));

//check if the file exits before reading 
if (fs.existsSync(user_data_file)) {
    stats = fs.statSync(user_data_file);
    console.log(`user_data.json has ${stats['size']} characters`);
    var data = fs.readFileSync(user_data_file, 'utf-8');
    var users_reg_data = JSON.parse(data);

} else {
    console.log(`ERR: ${user_data_file} does not exits!!!`);
}

// This processes the user's login
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.body);
    the_username = req.body.username.toLowerCase(); //putting the users, username as all lowercase
    if (typeof users_reg_data[the_username] != 'undefined') { //ask the object if it has matching username or leaving it as undefined
        if (req.body.password == users_reg_data[req.body.username].password) {
            res.redirect('/invoice.html?' + qs.stringify(req.query) + qs.stringify(req.body.username));
            
        } else { //if password incorrect it outputs invalid password 
            LogError.push = ('Invalid Password');
            console.log(LogError);
            req.query.username= the_username;
            req.query.name= users_reg_data[the_username].name;
            req.query.LogError=LogError.join(';');
        }
        } else { //if username is incorrect push to the user invalid username 
            LogError.push = ('Invalid Username');
            console.log(LogError);
            req.query.username= the_username;
            req.query.LogError=LogError.join(';');
        }
    res.redirect('./login.html?' + qs.stringify(req.query));
});

//creates an account on the server side 
app.post("/process_registration", function (req, res) {
    qstr = req.body;
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) { //forces the use of only letters for Full Naame
    }
    else {
      errors.push('Use Only Letters for Full Name');
    }
    // validating that it is a Full Name
    if (req.body.name == "") {
      errors.push('Invalid Full Name');
    }
    // length of full name is between 0 and 25 
  if ((req.body.fullname.length > 25 && req.body.fullname.length <0)) {
    errors.push('Full Name Too Long');
  }
  //checks the new username in all lowercase against the record of usernames
    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { //if username is not undefined gives an error that the username is taken
      errors.push('Username taken');
    }
    //requires that the username only be letters and numbers 
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Letters And Numbers Only for Username');
    }
  
    //requires the password to be at least 6 characters long
    if (req.body.password.length < 6) {
      errors.push('Password Too Short');
    }
    //confirms that the passwords inputted match up 
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match');
    }
    //if there are no errors this saves the user's information into the user_data.json
    if (errors.length == 0) {
      POST = req.body;
      console.log('no errors');
      var username = POST['username'];
      users_reg_data[username] = {}; 
      users_reg_data[username].name = username;
      users_reg_data[username].password= POST['password'];
      users_reg_data[username].email = POST['email'];
      data = JSON.stringify(users_reg_data); 
      fs.writeFileSync(user_data_file, data, "utf-8");
      res.redirect('./invoice.html?' + qs.stringify(req.query));
    }
    //If the login has erros it redirects to the register page 
    if (errors.length > 0) {
        console.log(errors);
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';');
        res.redirect('register.html?' + qs.stringify(req.query));
    }
});

app.post("/process_form", function(request, response, next){

//Validate purchase data. Check each quantity is non negative integer or blank. Check at least one quantity is greater than 0. 
var validqty = true; //Is the quantity valid? 
var totalpurchases = false; //Are they all blank or 0? 
for (i = 0; i < products.length; i++) {
    aqty = request.body[`quantity${i}`];

    if(isNonNegIntString(aqty) == false){
        validqty &= false; 
    }
    if (aqty > 0){ //Means that they are blank or = 0
        totalpurchases = true;
    }
}

    purchase_qs = qs.stringify(request.body);
   //If the data is valid, send to the invoice

    if (validqty == true && totalpurchases == true) { 
        response.redirect('./login.html?' + purchase_qs); 
    }
    //If data not valid reload products page. 
    else { 
        response.redirect("./products_display.html?"); 
    }
 
});

function isNonNegIntString(string_to_check, returnErrors = false) { 
    errors = []; // assume no errors at first
    if(string_to_check == ''){
        string_to_check = 0;
    }
    if (Number(string_to_check) != string_to_check) { errors.push('Not a number!'); } // Check if string is a number value
    else {
        if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    }

    return returnErrors ? errors : ((errors.length > 0) ? false : true);
}

app.use(express.static('./Public'));
app.listen(8080, () => console.log(`listening on port 8080`));