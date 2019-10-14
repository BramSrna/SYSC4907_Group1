/*
The dictionary of available departments used
for adding items to stores and creating maps.
The keys in the dictionary are the names of
the departments.
The items in the dictionary are as follows:
    displayName: The name of the department to be displayed to users
    colour: The colour of the department
*/
const departmentList = {
    "BAKERY": {displayName: "Bakery",
                colour: "yellow"},
    "BEER": {displayName: "Beer",
                colour: "orange"},
    "BULK": {displayName: "Bulk",
                colour: "red"},
    "CHEESE": {displayName: "Cheese",
                colour: "magenta"},
    "COFFEE_AND_TEA": {displayName: "Coffee And Tea",
                        colour: "purple"},
    "FLOWERS_AND_FLORAL_ARRANGEMENTS": {displayName: "Flowers And Floral Arrangements",
                                        colour: "blue"},
    "GROCERY": {displayName: "Grocery",
                colour: "cyan"},
    "MEAT_AND_POULTRY": {displayName: "Meat And Poultry",
                            colour: "lightgreen"},
    "PREPARED_FOODS": {displayName: "Prepared Foods",
                        colour: "darkgreen"},
    "PRODUCE": {displayName: "Produce",
                colour: "brown"},
    "PETS": {displayName: "Pets",
                colour: "tan"},
    "SEAFOOD": {displayName: "Seafood",
                colour: "lightgrey"},
    "WINE": {displayName: "Wine",
                colour: "darkgrey"},
    "WHOLE_BODY": {displayName: "Whole Body",
                    colour: "black"},
};

export const departments = departmentList;  