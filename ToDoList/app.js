const express           =       require("express");
const bodyParser        =       require("body-parser");
const mongoose          =       require("mongoose");

const Item              =       require("./app/Models/item");
const List              =       require("./app/Models/list");
const toDoListRoutes    =       require("./app/Routes");

const port = process.env.PORT || 3000;            
const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(toDoListRoutes.router);

app.listen(port, ()=>
{
    console.log("Server is running on port : ",port);
});