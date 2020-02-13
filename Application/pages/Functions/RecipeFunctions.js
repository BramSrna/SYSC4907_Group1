import * as firebase from "firebase";

const NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB = "2";
const API_KEY = "f5c21b2e7dc148caa483192e83219c74"; // 50/1.01 calls/day allowed

class RecipeFunctions {
   constructor() {}

   AddRecipesToDatabase() {
      let url = "https://api.spoonacular.com/recipes/random?number=" + NUMBER_OF_RECIPES_TO_GET_FROM_API_TO_STORE_IN_DB + "&apiKey=" + API_KEY;
      fetch(url, {
         method: "GET",
      }).then(function (response) {
         if (response.status === 200) {
            response.json().then(function (json) {
               console.log(json.recipes)
               for (var a = 0; a < json.recipes.length; a++) {
                  var data = json.recipes[a];
                  firebase.database().ref('/recipes/' + data.title).set(data).then(function (snapshot) {
                     // console.log(snapshot);
                  });
               }
            });

         } else {
            console.log("API did not respond well.")
         }
      }, function (error) {
         console.log(error.message)
      })
   }
}

const rf = new RecipeFunctions();
export default rf;