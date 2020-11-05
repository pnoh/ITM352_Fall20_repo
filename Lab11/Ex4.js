function isNonNegIntString(string_to_check, returnErrors=false) 
/* This function will chekc if the string to chekc is a non neg int.
Returns true if string to check is non negative. If return erros = true, 
it will return the array of reasons of why it is not a negative int
*/
{
errors = []; // assume no errors at first
if(Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer   

return returnErrors ? errors : (errors.length == 0); 
}

attributes = "Phil;19;10.5;" + (0.5 - 19);
pieces = attributes.split(";");


function callback(i,part) {
    console.log(`${pieces[i]} is non neg int 
    ${isNonNegInt(part, false).join("***")}`);
}

pieces.forEach(function (item,i){console.log( (typeof item == 'string' && item.length > 0)?true:false ) });

