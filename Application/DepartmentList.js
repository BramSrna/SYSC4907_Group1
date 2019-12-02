/*
The dictionary of available departments used
for adding items to stores and creating maps.
The keys in the dictionary are the names of
the departments.
The items in the dictionary are as follows:
    label: The name of the department to be displayed to users
    value: The corresponding value saved to the database
*/
const departmentList = [
    {text:"Bakery", label: "Bakery", value: "BAKERY"},
    {text:"Beer", label: "Beer", value: "BEER"},
    {text:"Bulk", label: "Bulk", value: "BULK"},
    {text:"Cheese", label: "Cheese", value: "CHEESE"},
    {text:"Coffee And Tea", label: "Coffee And Tea", value: "COFFEE_AND_TEA"},
    {text:"Flowers And Floral Arrangements", label: "Flowers And Floral Arrangements", value: "FLOWERS_AND_FLORAL_ARRANGEMENTS"},
    {text:"Grocery", label: "Grocery", value: "GROCERY"},
    {text:"Meat And Poultry", label: "Meat And Poultry", value: "MEAT_AND_POULTRY"},
    {text:"Prepared Foods", label: "Prepared Foods", value: "PREPARED_FOODS"},
    {text:"Produce", label: "Produce", value: "PRODUCE"},
    {text:"Pets", label: "Pets", value: "PETS"},
    {text:"Seafood", label: "Seafood", value: "SEAFOOD"},
    {text:"Wine", label: "Wine", value: "WINE"},
    {text:"Whole Body", label: "Whole Body", value: "WHOLE_BODY"},
];

export const departments = departmentList;