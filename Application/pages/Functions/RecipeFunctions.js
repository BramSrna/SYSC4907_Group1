import * as firebase from "firebase";
import {
   resolve
} from "url";

const NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB = "30";
const API_KEY = "f5c21b2e7dc148caa483192e83219c74"; // 50/1.01 calls/day allowed
const NUMBER_OF_RECIPES_TO_SHOW_USERS = 20;

class RecipeFunctions {
   constructor() {}

   GetUrlAndIngredientsFromName(recipeName, that) {
      var recipeId = recipeName;
      recipeId = recipeId.replace(/\./g, " ");
      recipeId = recipeId.replace(/\$/g, " ");
      recipeId = recipeId.replace(/\#/g, " ");
      recipeId = recipeId.replace(/\[/g, " ");
      recipeId = recipeId.replace(/\]/g, " ");
      firebase
         .database()
         .ref("/recipes/" + recipeId)
         .once("value", function (snapshot) {
            if (snapshot.val()) {
               console.log("HERE----------")
               that.that.props.navigation.navigate("RecipeDetailsPage", {
                  url: snapshot.val().spoonacularSourceUrl,
                  ingredients: snapshot.val().extendedIngredients,
                  name: recipeName
               })
            }
         })
   }

   UpdateFavouriteRecipe(that, recipeName) {
      var recipeId = recipeName;
      recipeId = recipeId.replace(/\./g, " ");
      recipeId = recipeId.replace(/\$/g, " ");
      recipeId = recipeId.replace(/\#/g, " ");
      recipeId = recipeId.replace(/\[/g, " ");
      recipeId = recipeId.replace(/\]/g, " ");
      firebase
         .database()
         .ref("/favRecipes/" + firebase.auth().currentUser.uid + "/" + recipeId)
         .once("value", function (snapshot) {
            if (snapshot.val()) {
               that.setState({
                  favourite: true
               })
            } else {
               that.setState({
                  favourite: false
               })
            }
         })
   }

   GetRandomRecipesFromDatabase(that) {
      firebase.database().ref("/dailyRecipes/").once("value", function (snapshot) {
         var recipes = [];
         if (snapshot.val()) {
            var total = 0;
            for (var recipe in snapshot.val()) {
               recipes.push(snapshot.val()[recipe]);
               total++;
               if (total >= NUMBER_OF_RECIPES_TO_SHOW_USERS) {
                  break;
               }
            }
            that.setState({
               recipes: recipes
            });
            // return recipes;
         } else {
            console.log("Error: Could not get any recipes")
         }
      })
   }

   AddFavouriteRecipe(recipeName, callback) {
      var recipeId = recipeName;
      var currentUserId = firebase.auth().currentUser.uid;
      recipeId = recipeId.replace(/\./g, " ");
      recipeId = recipeId.replace(/\$/g, " ");
      recipeId = recipeId.replace(/\#/g, " ");
      recipeId = recipeId.replace(/\[/g, " ");
      recipeId = recipeId.replace(/\]/g, " ");
      firebase
         .database()
         .ref("/favRecipes/" + currentUserId + "/" + recipeId)
         .once("value", function (snapshot) {
            if (!snapshot.val()) {
               firebase.database().ref("/favRecipes/" + currentUserId + "/" + recipeId).set(recipeName).then((val) => {
                  callback(true)
               })
            } else {
               firebase
                  .database()
                  .ref("/favRecipes/" + currentUserId + "/" + recipeId).remove().then((val) => {
                     callback(false);
                  })
            }
         });
   }

   GetFavouriteRecipes(that) {
      firebase.database().ref("/favRecipes/" + firebase.auth().currentUser.uid).on("value", function (snapshot) {
         if (snapshot.val()) {
            that.state.recipes = [];
            for (var recipe in snapshot.val()) {
               firebase.database().ref("/recipes/" + recipe).once("value", function (returnRecipe) {
                  var recipes = that.state.recipes;
                  recipes.push(returnRecipe.val());
                  that.setState({
                     recipes: recipes
                  });
               })
            }
         }
      })
   }

   RemoveListeners() {
      firebase.database().ref("/favRecipes/" + firebase.auth().currentUser.uid).off()

   }

   async updateRandomRecipesForDay() {
      try {

         const resp = await firebase.functions().httpsCallable('updateRandomRecipesForDay')({
            numRecipesToGet: NUMBER_OF_RECIPES_TO_SHOW_USERS
         }).then((val) => {
            console.log(val.data.string)
         });
      } catch (e) {
         console.error("Error calling cloud function: " + e);
      }
   }

   // Call this method once a day
   async AddRecipesToDatabase() {
      firebase.database().ref('/globals/latestRecipeUpdate').once("value", (snapshot) => {
         if (snapshot.val()) {
            var currentDate = new Date().toUTCString();
            var currentDateSplit = currentDate.split(" ");
            var dateStr = snapshot.val().split(" ");
            if (dateStr[0] == currentDateSplit[0] && dateStr[1] == currentDateSplit[1] && dateStr[2] == currentDateSplit[2] && dateStr[3] == currentDateSplit[3]) {
               console.log("Recipes were already added to the database today.")
            } else {
               firebase.database().ref('/globals/latestRecipeUpdate').set(currentDate).then((snapshot) => {
                  let url = "https://api.spoonacular.com/recipes/random?number=" + NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB + "&apiKey=" + API_KEY;
                  fetch(url, {
                     method: "GET",
                  }).then((response) => {
                     if (response.status === 200) {
                        response.json().then((json) => {
                           // console.log(json.recipes)
                           for (var a = 0; a < json.recipes.length; a++) {
                              var data = json.recipes[a];
                              var title = data.title;
                              title = title.replace(/\./g, " ");
                              title = title.replace(/\$/g, " ");
                              title = title.replace(/\#/g, " ");
                              title = title.replace(/\[/g, " ");
                              title = title.replace(/\]/g, " ");
                              firebase.database().ref('/recipes/' + title).set(data).then((snapshot) => {
                                 // console.log(snapshot);
                              });
                           }
                        });
                        console.log("Recipes were added to the database.")
                     } else {
                        console.log("API did not respond well.")
                     }
                  }, ((error) => {
                     console.log(error.message)
                  }))
               });

               this.updateRandomRecipesForDay()

            }

         } else {
            console.log("Could not get date from database.")
         }
      })
   }
}

const rf = new RecipeFunctions();
export default rf;