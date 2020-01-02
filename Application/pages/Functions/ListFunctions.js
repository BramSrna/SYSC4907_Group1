import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ListFunctions {
   constructor() { }

   sendNotification = (token, title, body, data) => {
      let response = fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data
         })
      });
   }

   sendNotificationToSharedUsers(listID, listName, message) {
      var uids = [];
      var tokens = [];
      var that = this
      firebase
         .database()
         .ref("/users/")
         .once("value", function (snapshot) {

            if (snapshot.val()) {
               for (var user in snapshot.val()) {
                  if (user != firebase.auth().currentUser.uid) {
                     if (snapshot.val()[user].lists.shared) {
                        var lists = snapshot.val()[user].lists.shared
                        for (var shared in lists) {
                           if (shared == listID) {
                              uids.push(user);

                           }
                        }
                     }
                     if (snapshot.val()[user].lists.created) {

                        var otherLists = snapshot.val()[user].lists.created
                        for (var created in otherLists) {
                           if (created == listID) {
                              uids.push(user);

                           }
                        }
                     }


                  }

               }

            } else {
               console.log("Something went wrong!")
            }
         }).then(
            firebase
               .database()
               .ref("/userInfo/")
               .once("value", function (snapshot) {
                  if (snapshot.val()) {
                     for (user in snapshot.val()) {
                        if (uids.includes(snapshot.val()[user].uid)) {
                           if (snapshot.val()[user].notificationToken) {
                              tokens.push(snapshot.val()[user].notificationToken)
                           } else {
                              console.log("User did not give notification access " + snapshot.val()[user])
                           }
                        } else {
                           // console.log("User did not log in correctly")
                        }
                     }
                  } else {
                     console.log("Users not configured properly!")
                  }
               })
         ).finally(
            that.tokensToNotifications(uids, tokens, listID, listName, message)
         )
   }

   /**
    * This function is used to add items to a list.
    * @param {*} listId: id of the list we are adding items to
    * @param {*} name: name of the item
    * @param {*} quantity: quantity of the item
    * @param {*} size: size of the item
    * @param {*} notes: additional notes regarding the item
    */
   async AddItemToList(listId, name, quantity, size, notes, purchased = false) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudAddItemToList')({
            listId: listId,
            name: name,
            purchased: purchased,
            quantity: quantity,
            size: size,
            notes: notes,
         });

         return true;
      } catch (e) {
         console.error(e);

         return false;
      }
   }

   /**
    * This function is used to remove an item from a list
    * @param {*} listId: id of the list the item is in
    * @param {*} itemId: id of the item of the list
    */
   async DeleteItemInList(listId, itemId) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudDeleteItemInList')({
            listId: listId,
            itemId: itemId,
         });

         return true;
      } catch (e) {
         console.error(e);

         return false;
      }
   }

   /**
    * This function is used to change the purchased boolean in the database
    * @param {*} listId: id of the list the item is in
    * @param {*} itemId: id of the item in the list
    */
   async UpdatePurchasedBoolOfAnItemInAList(listId, itemId) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudUpdatePurchasedBoolOfAnItemInAList')({
            listId: listId,
            itemId: itemId,
         });

         return true;
      } catch (e) {
         console.error(e);

         return false;
      }
   }

   /**
    * Delete the list from the user created/shared section. If nobody selse has the list then the list will be removed from the list table.
    * @param {*} listId: id of the list being removed
    */
   export DeleteList(listId) {
      var uid = firebase.auth().currentUser.uid;

      try {
         const { data } = await firebase.functions().httpsCallable('cloudDeleteList')({
            listId: listId,
            uid: uid,
         });

         var items = data.items;
         var ids = data.ids;

         return {
            items: items,
            ids: ids
         };
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * Create a new list
    * @param {*} listName: name of the list
    */
   export CreateNewList(listName) {
      var uid = firebase.auth().currentUser.uid;

      try {
         const { data } = await firebase.functions().httpsCallable('cloudCreateNewList')({
            uid: uid,
            listName: listName,
            items: {},
            userCount: 1
         });

         var items = data.items;
         var ids = data.ids;

         return {
            items: items,
            ids: ids
         };
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * Get the list keys and names to populate the YourLists.js page
    * @param {*} that: this for caller
    */
   export GetListsKeyAndName() {
      var uid = firebase.auth().currentUser.uid;

      try {
         const { data } = await firebase.functions().httpsCallable('cloudGetListsKeyAndName')({
            uid: uid,
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   export getAvailableStores() {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudLoadAvailableStores')({
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * Get all the items in the current list
    * @param {*} listId: id of the list we are currently viewing
    */
   export reorgListAdded(listId) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudGetItemsInAList')({
            listId: listId,
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   export reorgListLoc(storeId, listId) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudReorgListLoc')({
            storeId: storeId,
            listId: listId
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   export reorgListFastest(storeId, listId) {
      try {
         const { data } = await firebase.functions().httpsCallable('cloudReorgListFastest')({
            storeId: storeId,
            listId: listId
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   };

   tokensToNotifications(uids, tokens, listID, listName, message) {
      var that = this;
      firebase
         .database()
         .ref("/contacts/")
         .once("value", function (snapshot) {
            for (var pos in tokens) {
               if (snapshot.val()) {
                  if (snapshot.val()[uids[pos]]) {
                     var name = firebase.auth().currentUser.email;
                     for (contact in snapshot.val()[uids[pos]]) {
                        if (snapshot.val()[uids[pos]][contact].email == firebase.auth().currentUser.email) {
                           name = snapshot.val()[uids[pos]][contact].name
                           break
                        }
                     }
                     var title = name + ' to ' + listName;
                     that.sendNotification(tokens[pos], title, message, {
                        "page": "CurrentListPage",
                        "name": listName,
                        "listID": listID,
                        "message": message,
                        "title": title

                     });
                  } else {
                     console.log("There are no contacts for that person")
                  }
               } else {
                  console.log("tokensToNotifications messed up")
               }
            }
         })

   }

   /**
    * Get the current theme of the user
    * @param {*} that: this for caller
    */
   GetTheme(that) {
      var uid = firebase.auth().currentUser.uid;
      if (uid) {
         firebase
            .database()
            .ref("/users/" + uid + "/preferences/theme")
            .on("value", function (snapshot) {
               var ssv = snapshot.val();
               that.setState({
                  theme: ssv == 'light' ? 'light' : 'dark',
               });
            });
      }
   }

   /**
    * Toggle the current theme of the user
    * @param {*} that: this for caller
    */
   ToggleTheme() {
      var uid = firebase.auth().currentUser.uid;
      var ssv;
      if (uid) {
         firebase
            .database()
            .ref("/users/" + uid + "/preferences/theme")
            .once("value", function (snapshot) {
               ssv = snapshot.val();
            });
         return firebase.database().ref("/users/" + uid + "/preferences/theme").set(ssv == 'light' ? 'dark' : 'light');
      } else null;
   }
}

const lf = new ListFunctions();
export default lf;