/*
The dictionary of available departments used
for adding items to stores and creating maps.
The keys in the dictionary are the names of
the departments.
The items in the dictionary are as follows:
    text: The value of the department to be displayed in dropdown boxes
    label: The name of the department to be displayed to users
    value: The corresponding value saved to the database

TODO: Might be able to remove labels
*/
const departmentList = [
    {text: "Bakery", label: "Bakery", value: "Bakery"},
    {text: "Baking Ingredients", label: "Baking Ingredients", value: "Baking Ingredients"},
    {text: "Beef And Poultry", label: "Beef And Poultry", value: "Beef And Poultry"},
    {text: "Beer And Wine", label: "Beer And Wine", value: "Beer And Wine"},
    {text: "Breakfast Foods", label: "Breakfast Foods", value: "Breakfast Foods"},
    {text: "Bulk Foods", label: "Bulk Foods", value: "Bulk Foods"},
    {text: "Canned Foods", label: "Canned Foods", value: "Canned Foods"},
    {text: "Cleaning Supplies", label: "Cleaning Supplies", value: "Cleaning Supplies"},
    {text: "Coffee And Tea", label: "Coffee And Tea", value: "Coffee And Tea"},
    {text: "Condiments", label: "Condiments", value: "Condiments"},
    {text: "Cooking Essentials", label: "Cooking Essentials", value: "Cooking Essentials"},
    {text: "Dairy", label: "Dairy", value: "Dairy"},
    {text: "Deli", label: "Deli", value: "Deli"},
    {text: "Desserts", label: "Desserts", value: "Desserts"},
    {text: "Drinks", label: "Drinks", value: "Drinks"},
    {text: "Frozen Foods", label: "Frozen Foods", value: "Frozen Foods"},
    {text: "Health Foods", label: "Health Foods", value: "Health Foods"},
    {text: "Kitchen Of The World", label: "Kitchen Of The World", value: "Kitchen Of The World"},
    {text: "Meal Replacements", label: "Meal Replacements", value: "Meal Replacements"},
    {text: "Meals To Go", label: "Meals To Go", value: "Meals To Go"},
    {text: "Paper Products", label: "Paper Products", value: "Paper Products"},
    {text: "Pet Supplies", label: "Pet Supplies", value: "Pet Supplies"},
    {text: "Pharmacy", label: "Pharmacy", value: "Pharmacy"},
    {text: "Produce", label: "Produce", value: "Produce"},
    {text: "Seafood", label: "Seafood", value: "Seafood"},
    {text: "Snack Foods", label: "Snack Foods", value: "Snack Foods"},
    {text: "Soup", label: "Soup", value: "Soup"},
    {text: "Sports", label: "Sports", value: "Sports"},
    {text: "Whole Body", label: "Whole Body", value: "Whole Body"},
];

export const departments = departmentList;