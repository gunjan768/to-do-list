const express    		 	=  			require('express');
const itemModel            	=       	require("../Models/item");
const listModel            	=       	require("../Models/list");
const lodash            	=       	require("lodash");

const router = express.Router();

const List = listModel.List;
const Item = itemModel.Item;
const defaultItems = itemModel.defaultItems;

router.get("/", (req, res)=> 
{
    Item.find({}, (err, foundItems)=>
    {
        if( !foundItems.length ) 
        {
            Item.insertMany(defaultItems, (err)=>
            {
                if(err) 
                console.log(err);
                else 
                console.log("Successfully savevd default items to DB.");
            });
              
            res.redirect("/");
        } 
        
        else 
        { 
            // console.log(foundItems);

            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

router.get("/:customListName", (req, res)=>
{
    const customListName = lodash.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList)=>
    {
        if( !err )
        {
            if( !foundList )
            {
                //Create a new list
                const list = new List(
                {
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } 
            else 
            {
                // console.log(foundList);
                
                //Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});

router.post("/", (req, res)=>
{
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item(
    {
        name: itemName
    });

    if(listName === "Today")
    {
        item.save();

        res.redirect("/");
    } 
    else 
    {
        List.findOne({name: listName}, (err, foundList)=>
        {
            foundList.items.push(item);
            foundList.save();
            
            res.redirect("/" + listName); 
        });
    }
});

router.post("/delete", (req, res)=>
{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if( listName === "Today" ) 
    {
        Item.findByIdAndRemove(checkedItemId, (err)=>
        {
            if( err )
            {
                console.log("Item failed to be deletion");
                res.redirect("/");
            } 
            else
            {
                console.log("Successfully deleted checked item.");
                res.redirect("/");
            }
        });
    } 
    else 
    {
        // $pull is an operator. It will delete the that id which is mentioned as 'checkItemId' which is
        // inside the array 'items' which is again inside the List whose name is 'listName'
        
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>
        {
            if( !err )
            {
                res.redirect("/" + listName);
            }
        });
    }
});

module.exports = 
{
	router
}