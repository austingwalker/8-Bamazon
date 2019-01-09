var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var newQuantity;

var connection = mysql.createConnection({
    host: "localhost",


    port: 8889,

    user: "root",


    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    productList();

});


function productList() {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        console.table(res);




        customerSelect(res);
    });
}

function customerSelect(itemsList) {

    inquirer.prompt([
        {
            name: "idSelect",
            type: "input",
            message: "What is the ID of the item you would like to purchase? [Quit with Q]",
            validate: function (value) {
                return !isNaN(value) || value.toLowerCase() === "q";
            }
        }

    ]).then(function (value) {

        checkIfShouldExit(value.idSelect);

        var idSelected = parseInt(value.idSelect);
        var item = checkItems(idSelected, itemsList)
        
        if(item){
            askForQuantity(item)
        }
        else {
            console.log("\nSorry we don't have that item!");
            productList();
        }
        


    });
};

function askForQuantity(item) {

    inquirer.prompt([
        {
            name: "quantitySelect",
            type: "input",
            message: "How many would you like? [Quit with Q]",
            validate: function (value) {
                return value > 0 || value.toLowerCase() === "q";
            }
        }
    ]).then(function (value) {

        checkIfShouldExit(value.quantitySelect);

        var quantity = parseInt(value.quantitySelect);

        if(quantity > item.stock_quantity){
            console.log("\nInsufficient quantity!");
            productList();
        }

        else {
            purchaseItem(item, quantity)
        }
    
        
    })
}

function purchaseItem(item, quantity){

    connection.query("UPDATE products SET stock_quantity =  stock_quantity - ? WHERE id = ?", [quantity, item.id], function (err, res) {
        if (err) throw err;

    
        console.log("Item Purchased!" + quantity + " " + item.product_name + "'s!");
        productList();

    })
}

function checkItems(idSelected, itemsList){
    for (var i = 0; i < itemsList.length; i++){
        if(itemsList[i].id === idSelected){
            return itemsList[i];
        }
    }
    return null;
}



function checkIfShouldExit(exit) {
    if (exit.toLowerCase() === "q") {
        
        console.log("Thanks for shopping!");
        process.exit(0);
    }
}