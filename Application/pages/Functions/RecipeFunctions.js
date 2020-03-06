import * as firebase from "firebase";

const NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB = "30";
const API_KEY = "f5c21b2e7dc148caa483192e83219c74"; // 50/1.01 calls/day allowed
const NUMBER_OF_RECIPES_TO_SHOW_USERS = 20;

class RecipeFunctions {
   constructor() {}

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

   AddFavouriteRecipe(recipeName) {
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
               firebase.database().ref("/favRecipes/" + currentUserId + "/" + recipeId).set(recipeName).then(function (snapshot) {
                  // console.log(snapshot);
               });
            }
         });
   }

   GetFavouriteRecipes(that) {
      var recipes = [];
      async function getRecipe(id) {
         firebase.database().ref("/recipes/" + id).once("value", function (snapshot) {
            recipes.push(snapshot.val());
         });
      }

      async function processRecipes(recipes) {
         recipes.forEach(async (id) => {
            await getRecipe(id)
         })
         that.setState({
            recipes: recipes
         })
      }

      firebase.database().ref("/favRecipes/" + firebase.auth().currentUser.uid).once("value", function (snapshot) {
         var recipeIds = [];
         if (snapshot.val()) {
            for (var recipe in snapshot.val()) {
               recipeIds.push(recipe);
            }
            processRecipes(recipeIds);
         } else {
            console.log("Error: Could not get any recipes")
         }
      })
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