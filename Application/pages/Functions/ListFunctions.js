import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses
 * to manipulate the database.
 */
class ListFunctions {
   constructor() { }

   /**
    * sendNotification
    * 
    * Sends the fiven notification to the user given by
    * the token
    * 
    * @param   {String} token The user to send the message to
    * @param   {String} title The title of the notification
    * @param   {String} body  The contents of the notification
    * @param   {Object} data  The extra data to send with the notification
    */
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

   /**
    * sendNotificationToSharedUsers
    * 
    * Sends the given notification to all users that
    * the given list has been shared with.
    * 
    * @param {String} listID  The ID of the corresponding list
    * @param {String} listName   The name of the list
    * @param {String} message    the message to send
    * 
    * @returns None
    */
   sendNotificationToSharedUsers(listID, listName, message) {
      var uids = [];
      var tokens = [];
      var that = this;
      firebase.database().ref("/users/").once("value", function (snapshot) {
         // Get the id of all users to send the notification to
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
         // Get the tokens of all users to receive the notification
         firebase.database().ref("/userInfo/").once("value", function (snapshot) {
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
         // Send the notification to all users
         that.tokensToNotifications(uids, tokens, listID, listName, message)
      )
   }

   /**
    * AddItemToList
    * 
    * Add the given item to the given list
    * 
    * @param {String} listId: id of the list we are adding items to
    * @param {String} genName: name of the item
    * @param {Integer} quantity: quantity of the item
    * @param {Integer} size: size of the item
    * @param {String} notes: additional notes regarding the item
    * @param {String}   specName: The specific name of the item
    * 
    * @returns None
    */
   async AddItemToList(listId, genName, quantity, size, notes, specName = false, purchased = false) {
      try {
         // Call the add item function
         const { data } = await firebase.functions().httpsCallable('cloudAddItemToList')({
            listId: listId,
            genName: genName,
            specName: specName,
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
    * DeleteItemInList
    * 
    * Delete the given item from the given list
    * 
    * @param {String} listId: id of the list the item is in
    * @param {String} itemId: id of the item to remove
    * 
    * @returns None
    */
   async DeleteItemInList(listId, itemId) {
      try {
         // Call the delete item function
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
    * UpdatePurchasedBoolOfAnItemInAList
    * 
    * Toggles the purchased boolean of the given item in the
    * given list
    * 
    * @param {String} listId: id of the list the item is in
    * @param {String} itemId: id of the item in the list
    * 
    * @returns None
    */
   async UpdatePurchasedBoolOfAnItemInAList(listId, itemId) {
      try {
         // Call the toggle purchased function
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
    * DeleteList
    * 
    * Delete the given list from the user created/shared section.
    * If nobody else has the list then the list will be removed
    * from the list table.
    * 
    * @param {String} listId: id of the list being removed
    * 
    * @returns An object containg 
    */
   async DeleteList(listId) {
      // Get the user id of the current user
      var uid = firebase.auth().currentUser.uid;

      try {
         // Call the function to delete the list
         const { data } = await firebase.functions().httpsCallable('cloudDeleteList')({
            listId: listId,
            uid: uid,
         });

         return;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * CreateNewList
    * 
    * Creates a new list and adds it to the user's list
    * of lists.
    * 
    * @param {String} listName: name of the list to create
    * 
    * @returns An object containing the contents of the list
    *          and the id of the list
    */
   async CreateNewList(listName) {
      // Get the user id of the current user
      var uid = firebase.auth().currentUser.uid;

      try {
         // Call the function to create the list
         const { data } = await firebase.functions().httpsCallable('cloudCreateNewList')({
            uid: uid,
            listName: listName,
            items: {},
            userCount: 1
         });

         // Get the returned data
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
    * GetListsKeyAndName
    * 
    * Get the list keys and names belonging to the user
    * to populate the YourLists.js page
    * 
    * @param {Component} that: context for caller
    * 
    * @returns None
    */
   async GetListsKeyAndName() {
      // Get the user id of the current user
      var uid = firebase.auth().currentUser.uid;

      try {
         // Call the function to get the lists keys and names
         const { data } = await firebase.functions().httpsCallable('cloudGetListsKeyAndName')({
            uid: uid,
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * getAvailableStores
    * 
    * Loads the available stores from the database.
    * The available stores are all known stores.
    * 
    * @param   None
    * 
    * @returns The available stores
    */
   async getAvailableStores() {
      try {
         // Call the function to load all available stores
         const { data } = await firebase.functions().httpsCallable('cloudLoadAvailableStores')({
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * getAvailableItems
    * 
    * Loads the available items from the database.
    * The available items are all known items.
    * 
    * @param   None
    * 
    * @returns The available items
    */
   async getAvailableItems() {
      try {
         // Call the function to load all available items
         const { data } = await firebase.functions().httpsCallable('cloudLoadAvailableItems')({
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * reorgListAdded
    * 
    * Returns the given list in the order that the items
    * were added to the list.
    * 
    * @param {String} listId: id of the list to reorganize
    * 
    * @returns The sorted list
    */
   async reorgListAdded(listId) {
      try {
         // Call the function to get the sorted list
         const { data } = await firebase.functions().httpsCallable('cloudGetItemsInAList')({
            listId: listId,
         });

         return data;
      } catch (e) {
         console.error(e);

         return(null);
      }
   }

   /**
    * reorgListLoc
    * 
    * Returns the given list grouped based on the locations
    * of the items in the given store.
    * 
    * @param {String} storeId The ID of the store the user is in
    * @param {String} listId  The ID of the list to rearrange
    * 
    * @returns The sorted list
    */
   async reorgListLoc(storeId, listId) {
      try {
         // Call the function to get the sorted list
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

   /**
    * reorgListFastest
    * 
    * Returns the given list sorted in the order that
    * the items would appear in the store.
    * 
    * @param {String} storeId The ID of the store the user is in
    * @param {String} listId The ID of the list to rearrange
    */
   async reorgListFastest(storeId, listId) {
      try {
         // Call the function to get the sorted list
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

   /**
    * tokensToNotifications
    * 
    * Finds the users to send the notification to and
    * formulates the notification message to send.
    * 
    * @param {String} uids The uids of the users
    * @param {Array} tokens The Array of tokens
    * @param {String} listID The ID of the list
    * @param {String} listName The name of the message the notification is related to
    * @param {String} message The message text to send
    */
   tokensToNotifications(uids, tokens, listID, listName, message) {
      var that = this;
      firebase.database().ref("/contacts/").once("value", function (snapshot) {
         for (var pos in tokens) {
            if (snapshot.val()) {
               if (snapshot.val()[uids[pos]]) {
                  var name = firebase.auth().currentUser.email;
                  for (contact in snapshot.val()[uids[pos]]) {
                     if (snapshot.val()[uids[pos]][contact].email == firebase.auth().currentUser.email) {
                        name = snapshot.val()[uids[pos]][contact].name
                        break;
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
      });
   }

   /**
    * GetTheme
    * 
    * Get the current theme of the user
    * 
    * @param {Component} that: context for caller
    * 
    * @returns None
    */
   GetTheme(that) {
      var uid = firebase.auth().currentUser.uid;
      if (uid) {
         firebase.database().ref("/users/" + uid + "/preferences/theme").on("value", function (snapshot) {
            var ssv = snapshot.val();
            that.setState({
               theme: ssv == 'light' ? 'light' : 'dark',
            });
         });
      }
   }

   /**
    * ToggleTheme
    * 
    * Toggle the current theme of the user
    * 
    * @param {Component} that: context for caller
    * 
    * @returns None
    */
   ToggleTheme() {
      var uid = firebase.auth().currentUser.uid;
      var ssv;
      if (uid) {
         firebase.database().ref("/users/" + uid + "/preferences/theme").once("value", function (snapshot) {
            ssv = snapshot.val();
         });
         return firebase.database().ref("/users/" + uid + "/preferences/theme").set(ssv == 'light' ? 'dark' : 'light');
      } else null;
   }
}

const lf = new ListFunctions();
export default lf;