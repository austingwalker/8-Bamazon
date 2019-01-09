var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");



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

    whatWouldYouLikeToDo();

});



function whatWouldYouLikeToDo(){

    inquirer.prompt([{
        name: "question",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products For Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
            ]
    }]).then(function(answer){

        switch(answer.question){
            case "View Products For Sale":
            productList();
            break;

            case "View Low Inventory":
            viewLowInventory();
            break;

            case "Add to Inventory":
            addToInventory();
            break;

            case "Add New Product":
            addNewProduct();
            break;

            case "Quit":
            quit();
            break;
        }

    });
}

function productList() {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        console.table(res);

        whatWouldYouLikeToDo()

    });
}

function viewLowInventory(){


    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++){
            if (res[i].stock_quantity < 10){
                console.table(res[i]);
                console.log("----------")

            }

           

        }

        whatWouldYouLikeToDo();

    })
}

function addToInventory(){

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        console.table(res);



    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "What is the id of the item you would like to add to?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to add??"
}

]).then(function(response){

    var ID = response.item_id;
    var quantity = parseInt(response.quantity)

    connection.query("UPDATE products SET stock_quantity =  stock_quantity + ? WHERE id = ?", [quantity, ID], function (err, res) {
        if (err) throw err;

    
        console.log("Item Purchased!" + quantity + " " + res.product_name + "'s!");
        productList();

    })


})

});

}

function addNewProduct(){

    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "What is the name of the product you would like to add?"
    },
    {
        name: "department",
        type: "list",
        message: "What department does the item belong in?",
        choices: [
            "Home Goods",
            "Food",
            "Personal",
            "Clothing",
            "Office Supplies",
            "Other"
        ]
    },
    {
            name: "cost",
            type: "input",
            message: "How much does it cost?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"
    }

]).then(function(response){

    var item = response.name;
    var department = response.department;
    var cost = parseInt(response.cost);
    var quantity = parseInt(response.quantity);

    console.log(item);
    console.log(department);
    console.log(cost);
    console.log(quantity);

    connection.query("INSERT INTO products SET ?", [{product_name: item, department_name: department, price: cost, stock_quantity: quantity}], function(err, res){

        if (err) throw err;

        console.log(item + " added to inventory!");
    })

    whatWouldYouLikeToDo();


})
}

function quit(){
    console.log("Thanks for managing!")
    connection.end();
}