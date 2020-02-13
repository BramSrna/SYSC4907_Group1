import * as firebase from "firebase";

const NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB = "30";
const API_KEY = "f5c21b2e7dc148caa483192e83219c74"; // 50/1.01 calls/day allowed

class RecipeFunctions {
   constructor() {}

   // Call this method once a day
   AddRecipesToDatabase() {
      firebase.database().ref('/globals/latestRecipeUpdate').once("value", function (snapshot) {
         if (snapshot.val()) {
            var currentDate = new Date().toUTCString();
            var currentDateSplit = currentDate.split(" ");
            var dateStr = snapshot.val().split(" ");
            if (dateStr[0] == currentDateSplit[0] && dateStr[1] == currentDateSplit[1] && dateStr[2] == currentDateSplit[2] && dateStr[3] == currentDateSplit[3]) {
               console.log("Recipes were already update for today.")
            } else {
               firebase.database().ref('/globals/latestRecipeUpdate').set(currentDate).then(function (snapshot) {
                  let url = "https://api.spoonacular.com/recipes/random?number=" + NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB + "&apiKey=" + API_KEY;
                  fetch(url, {
                     method: "GET",
                  }).then(function (response) {
                     if (response.status === 200) {
                        response.json().then(function (json) {
                           // console.log(json.recipes)
                           for (var a = 0; a < json.recipes.length; a++) {
                              var data = json.recipes[a];
                              var title = data.title;
                              title = title.replace(/\./g, " ");
                              title = title.replace(/\$/g, " ");
                              title = title.replace(/\#/g, " ");
                              title = title.replace(/\[/g, " ");
                              title = title.replace(/\]/g, " ");
                              firebase.database().ref('/recipes/' + title).set(data).then(function (snapshot) {
                                 // console.log(snapshot);
                                 console.log("Recipes just updated!")
                              });
                           }
                        });

                     } else {
                        console.log("API did not respond well.")
                     }
                  }, function (error) {
                     console.log(error.message)
                  })
               });
            }

         } else {
            console.log("Could not get date from database.")
         }
      })
   }
}

const rf = new RecipeFunctions();
export default rf;