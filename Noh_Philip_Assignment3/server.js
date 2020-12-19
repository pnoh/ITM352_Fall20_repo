// This code was largely based on the Lab13 code that was gone over by Dr.Port and Dr.Kazman to generate the server
//Also relied on assignment1 examples as well a little bit 

//the specific code below is refrenced from lab13 when Dr.Kazman went over info-servers for ex.4 

//Worked with Joshua on the new code for Assignment 2 as well as 3 now. 

var express = require('express');
var app = express();
var myParser = require("body-parser");
var products_data = require('./Public/product_data.js');
var nodemailer = require('querystring');
var fs = require('fs');
const queryString = require('query-string');
var qty = {};
var qs = require('querystring');
var qstr ={};

//Defines file in variable for later usage

var filename = 'user_data.json';
app.all('*', function(request, response, next) {
    if(typeof request.session.cart == 'undefined') {
        request.session.cart = {}; 
    } next();
});

app.get("/get_products_data", function (request, response){
    response.json(products_data);
});

// require it
var session = require('express-session')

// configure it
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}))

//Following two sections of code taken from Assignment 3 Code examples
app.get("/add_to_cart", function (request, response) {
    var products_key = request.query['products_key']; // get the product key sent from the form post
    var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
    request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
    response.redirect('./cart.html');
});

app.get("/get_cart", function (request, response) {
    response.json(request.session.cart);
});

//Checks for file
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(`user_data.json has ${stats['size']} characters`);
    var data = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
} else {
    console.log (`Error: ${Filename} does not exist.`);
}

app.use(express.static('./Public'));
app.use(myParser.urlencoded({ extended: true }));


//Login page stuff
app.get("/login.html", function(request, response){
    str=`
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="stylesheet.css">
</head>
<body>

    <script>
        //Code mainly taken from Assignment 3 code examples given by Dan Port
    </script>
    <h1>Noh Dough</h1>

    <h2>Login to proceed to checkout!</h2>

    <form name ="loginform" method ="POST">
        <input type="text" name ="username" size="40" placeholder ="Username"><br />
        <input type="password" name = "password" size = "40" placeholder = "Password"><br />
        <input type="submit" value = "login" id="./invoice.html">
    </form>
    
    <div>
        <form action="./registration.html">
            <input type = "submit" value ="register" id ="rpage" name="register">
        </form>
    </div>
</body>
</html>
    `;
    response.send(str);
});
//Sends data to invoice
app.post("/process_form", function(request, response, next){
   
   //Validates data
   var validqty = true; //Check for valid input. 
   var totlpurchases = false; 
   for (i = 0; i < products.length; i++) {
       aqty = request.body[`quantity${i}`];
       if(isNonNegIntString(aqty) == false){
           validqty &= false; //Invalid data 
   
       }
       if (aqty > 0){ //Checks for visible data
           totlpurchases = true;
       }
   }
   
       // Following code taken from Brittney's code shown in class
       purchase_qs = qs.stringify(request.body); 
       if (validqty == true && totlpurchases == true) { 
           response.redirect('./login_page.html?' + purchase_qs); 
       }
       else { 
           response.redirect("./products_display.html?"); 
       }
   });
   app.post("/login.html", function (request, response) {
    console.log(sticker_qty);
    the_username = request.body.username.toLowerCase(); //makes username case insensitive
    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
       if (users_reg_data[the_username].password == request.body.password) {
          theQuantQuerystring = qs.stringify(qty); 
          response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`); 
       }
       else {
          response.send('Invalid Login: Please hit the back button and try again 1'); 
  
       }
    } else {
       response.send('Invalid Login: Please hit the back button and try again 2');
    }
  });
  

  app.post("/registration.html", function (request, response) {
    //Taken from class examples and labs
    console.log(sticker_qty);
    username = request.body.username;//Finds user data
    errors = {}; //Checks to see if username already exists
    //Validation
    if (typeof users_reg_data[username] != 'undefined') {
       errors.username_error = "Username is Already in Use"; 
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) { 
       errors.username_error = "Only numbers/letters";
    }
    if ((username.length > 10) == true) {
       errors.username_error = "Please make your username shorter"; 
    }
    if ((username.length < 4) == true) {
       errors.username_error = "Please make your username longer"; 
    }
    //Fullname Validation 
    fullname = request.body.fullname;
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
       errors.fullname_error = "Only use letters and a space";
    }
    if ((fullname.length > 30) == true) {
       errors.fullname_error = "Please make your full name shorter. 30 characters max"; 
    }
    //Email Validation
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
       errors.email_error = "Please enter proper email";
    }
  
    console.log(errors, users_reg_data);
    if (Object.keys(errors).length == 0) {
       users_reg_data[username] = {};
       users_reg_data[username].username = request.body.username
       users_reg_data[username].password = request.body.password;
       users_reg_data[username].email = request.body.email;
       users_reg_data[username].fullname = request.body.fullname;
       
       fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes reg info
       theQuantQuerystring = qs.stringify(qty); 
       response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //If all things valid, redirect to the invoice page
    } else {
       qstring = qs.stringify(request.body) + "&" + qs.stringify(errors);
       response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
    }
  });

// From Dan Port's Jawbreaker Example
app.get("/checkout", function (request, response) {
    // Generate HTML invoice string
      var user_email = request.query.email; 
      var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
      var shopping_cart = request.session.cart;
      for(product_key in products_data) {
        for(i=0; i<products_data[product_key].length; i++) {
            if(typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if(qty > 0) {
              invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
            }
        }
    }
      invoice_str += '</table>';
      var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, 
        tls: {
          rejectUnauthorized: false
        }
      });
    

      var mailOptions = {
        from: 'fake@store.com',
        to: user_email,
        subject: 'Your phoney invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          invoice_str += '<br>There was an error and your invoice could not be emailed!';
        } else {
          invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(invoice_str);
      });
     
    });
    
app.use(express.static('./Public'));
app.listen(8080, () => console.log(`listening on port 8080`));