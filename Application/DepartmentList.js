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
    {text: "Bakery", label: "Bakery", value: "BAKERY"},
    {text: "Baking Ingredients", label: "Baking Ingredients", value: "BAKING_INGREDIENTS"},
    {text: "Beef And Poultry", label: "Beef And Poultry", value: "BEEF_AND_POULTRY"},
    {text: "Beer And Wine", label: "Beer And Wine", value: "BEER_AND_WINE"},
    {text: "Breakfast Foods", label: "Breakfast Foods", value: "BREAKFAST_FOODS"},
    {text: "Bulk Foods", label: "Bulk Foods", value: "BULK_FOODS"},
    {text: "Canned Foods", label: "Canned Foods", value: "CANNED_FOODS"},
    {text: "Cleaning Supplies", label: "Cleaning Supplies", value: "CLEANING_SUPPLIES"},
    {text: "Coffee And Tea", label: "Coffee And Tea", value: "COFFEE_AND_TEA"},
    {text: "Condiments", label: "Condiments", value: "CONDIMENTS"},
    {text: "Cooking Essentials", label: "Cooking Essentials", value: "COOKING_ESSENTIALS"},
    {text: "Dairy", label: "Dairy", value: "DAIRY"},
    {text: "Deli", label: "Deli", value: "DELI"},
    {text: "Desserts", label: "Desserts", value: "DESSERTS"},
    {text: "Drinks", label: "Drinks", value: "DRINKS"},
    {text: "Frozen Foods", label: "Frozen Foods", value: "FROZEN_FOODS"},
    {text: "Health Foods", label: "Health Foods", value: "HEALTH_FOODS"},
    {text: "Kitchen Of The World", label: "Kitchen Of The World", value: "KITCHEN_OF_THE_WORLD"},
    {text: "Meal Replacements", label: "Meal Replacements", value: "MEAL_REPLACEMENTS"},
    {text: "Meals To Go", label: "Meals To Go", value: "MEALS_TO_GO"},
    {text: "Paper Products", label: "Paper Products", value: "PAPER_PRODUCTS"},
    {text: "Pet Supplies", label: "Pet Supplies", value: "PET_SUPPLIES"},
    {text: "Pharmacy", label: "Pharmacy", value: "PHARMACY"},
    {text: "Produce", label: "Produce", value: "PRODUCE"},
    {text: "Seafood", label: "Seafood", value: "SEAFOOD"},
    {text: "Snack Foods", label: "Snack Foods", value: "SNACK_FOODS"},
    {text: "Soup", label: "Soup", value: "SOUP"},
    {text: "Sports", label: "Sports", value: "SPORTS"},
    {text: "Whole Body", label: "Whole Body", value: "WHOLE_BODY"},
];

export const departments = departmentList;