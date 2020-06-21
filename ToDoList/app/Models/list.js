var mongoose    		=   	require("mongoose");
const itemModel      	=   	require("./item");

const itemsSchema = itemModel.itemsSchema;

const listSchema = 
{
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

module.exports = 
{
	List
}