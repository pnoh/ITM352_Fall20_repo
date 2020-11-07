// Creaying the array of products and took this from SmartPhoneProducts3//
// all images from google//

products = [
    {
        "name": "Sourdough Loaf",
        "price": 6.00,
        "image": 'sour_dough.jpg'
    },
    {
        "name": "Hokkaido Milk Bread Loaf",
        "price": 6.00,
        "image": 'milk_bread.jpg'
    },
    {
        "name": "Muffaletta Sourdough Loaf",
        "price": 8.00,
        "image": 'muffaletta_sourdough.png'
    },
    {
        "name": "Sundried Tomato and Parmesan Sourdough Loaf",
        "price": 8.00,
        "image": 'Sundried.jpg'
    },
    {
        "name": "Chocolate Babka Loaf",
        "price": 6.00,
        "image": 'ChocoBabka.jpg'
    }
];

if(typeof module != 'undefined') { //if the type of the module is defined
    module.exports.products = products; //export the product_data
  }