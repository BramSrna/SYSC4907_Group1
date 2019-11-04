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
    {label: "Bakery", value: "BAKERY"},
    {label: "Beer", value: "BEER"},
    {label: "Bulk", value: "BULK"},
    {label: "Cheese", value: "CHEESE"},
    {label: "Coffee And Tea", value: "COFFEE_AND_TEA"},
    {label: "Flowers And Floral Arrangements", value: "FLOWERS_AND_FLORAL_ARRANGEMENTS"},
    {label: "Grocery", value: "GROCERY"},
    {label: "Meat And Poultry", value: "MEAT_AND_POULTRY"},
    {label: "Prepared Foods", value: "PREPARED_FOODS"},
    {label: "Produce", value: "PRODUCE"},
    {label: "Pets", value: "PETS"},
    {label: "Seafood", value: "SEAFOOD"},
    {label: "Wine", value: "WINE"},
    {label: "Whole Body", value: "WHOLE_BODY"},
];

export const departments = departmentList;