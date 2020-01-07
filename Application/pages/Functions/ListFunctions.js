import * as firebase from "firebase";

const globalComps = require('./GlobalComps');
const dbInterface = require('./DBInterface');
const autocomplete = require('./AutocompleteFuncs');

/**
 * createListPath
 * 
 * Creates the expected path to the given list
 * in the database.
 * 
 * Path is:
 *  /lists/${listId}
 * 
 * @param {String} listId The id of the list
 */
function createListPath(listId) {
   var listPath = "/lists/" + listId;
   return(listPath);
}

/**
* createUserPath
* 
* Creates the expected path to the given user
* in the database
* 
* Path is:
*  /users/${userId}
* 
* @param {String} userId The id of the user
*/
function createUserPath(userId) {
   var userPath = "/users/" + userId;
   return(userPath);
}

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
    * Adds the given item to the given list.
    * If the item has not previously been registered,
    * it is registered to the database.
    * 
    * @param {String} listId: id of the list we are adding items to
    * @param {String} genName: name of the item
    * @param {Integer} quantity: quantity of the item
    * @param {Integer} size: size of the item
    * @param {String} notes: additional notes regarding the item
    * @param {String}   specName: The specific name of the item
    * 
    * @returns The id of the item
    */
   AddItemToList(listId, genName, quantity, size, notes, specName = false, purchased = false) {
      // Retrieve the item from the database
      var retVal = globalComps.getItem(genName, specificName = specName).then((itemInfo) => {
          var item = itemInfo.item;
  
          if (item === null) {
              // If the item has not been registered, then register it
              var temp = dbInterface.registerItem(genName, specificName = specName);
          }
  
          return Promise.all([temp]);
      }).then(result => {
          var listPath = createListPath(listId);
          // Get the id of the item
          var itemId = (new globalComps.ItemObj(genName, specificName = specName)).getId();
  
          // Add the item to the list
          firebase.database().ref(listPath + "/items/" + itemId).update({
              genName: genName,
              specName: specName,
              purchased: purchased,
              quantity: quantity,
              size: size,
              notes: notes
          });
  
          return itemId;
      });
  
      return retVal;
   }

   /**
    * DeleteItemInList
    * 
    * Delete the given item from the given list.
    * 
    * @param {String} listId: id of the list the item is in
    * @param {String} itemId: id of the item to remove
    * 
    * @returns None
    */
   DeleteItemInList(listId, itemId) {  
      // Get the path to the list
      var listPath = createListPath(listId);
  
      // Remove the item
      var ref = firebase.database().ref(listPath + "/items/" + itemId);
      ref.remove();
   }

   /**
    * UpdatePurchasedBoolOfAnItemInAList
    * 
    * Toggles the purchased boolean of the given item
    * in the given list.
    * 
    * @param {String} listId: id of the list the item is in
    * @param {String} itemId: id of the item in the list
    * 
    * @returns The new purchased state
    */
   UpdatePurchasedBoolOfAnItemInAList(listId, itemId) {  
      // Get the path to the list
      var listPath = createListPath(listId);
  
      // Get the current state of the item
      var ref = firebase.database().ref(listPath + "/items/" + itemId);
      var retVal = ref.once("value").then((snapshot) => {
          var currentBool = snapshot.val().purchased;
  
          // Update the item with the new purchased state
          var newRef = firebase.database().ref(listPath + "/items/" + itemId);
          newRef.update({
              purchased: !currentBool,
          });
  
          return !currentBool;
      });
  
      return retVal;
   }

   /**
    * DeleteList
    * 
    * Removes the given list from the given users array
    * of lists that they have access to. If that user was
    * the only user that had access to the list, then the
    * list is also deleted from the database. If there are
    * other users with access to the list, then the user count
    * on the list is decremeneted.
    * 
    * @param {String} listId: id of the list being removed
    * 
    * @returns None
    */
   DeleteList(listId) {
      var uid = firebase.auth().currentUser.uid;

      // Get the path to the user
      var userPath = createUserPath(uid);
      var ref = firebase.database().ref(userPath + "/lists");
      var retVal = ref.once("value").then((snapshot) => {
          var cList = null;
          var sList = null;
  
          // Get the current state of the user's lists
          if (snapshot.val()) {
              var createdLists = [];
              var sharedLists = [];
  
              // Get all of the user's created lists
              var temp = snapshot.val().created;
              for (var id in temp) {
                  createdLists.push(id);
              }
  
              // Get all of the user's shared lists
              temp = snapshot.val().shared;
              for (id in temp) {
                  sharedLists.push(id);
              }
  
              // If the user's created lists contains the target list,
              // then remove the list from the user's created lists
              if (createdLists.includes(listId)) {
                  var i = createdLists.findIndex(x => x === listId);
  
                  // Save the id of the list
                  cList = createdLists[i];
  
                  var rmvRef = firebase.database().ref(userPath + "/lists/created/" + cList);
                  rmvRef.remove();
              }
  
              // Do the same as above for the user's shared lists
              if (sharedLists.includes(listId)){
                  i = sharedLists.findIndex(x => x === listId);
  
                  // Save the id of the list
                  sList = createdLists[i];
  
                  rmvRef = firebase.database().ref(userPath + "/lists/shared/" + sList);
                  rmvRef.remove();
              }
          }
  
          // Return the created and shared list ids
          return Promise.all([cList, sList]);
      }).then(result => {
          var cList = String(result[0]);
          var sList = String(result[1]);
  
          var cListRetVal = null;
          var sListRetVal = null;
  
          // Get the created list from the lists table
          if (cList !== null) {
              cListRetVal = firebase.database().ref("/lists/" + cList).once("value");
          }
  
          // Get the shared list from the lists table
          if (sList !== null) {
              sListRetVal = firebase.database().ref("/lists/" + sList).once("value");
          }
  
          // Return the retrieved lists and their ids
          return Promise.all([cList, cListRetVal, sList, sListRetVal]);
      }).then(result => {
          var cList = result[0];
          var cListRetVal = result[1];
          var sList = result[2];
          var sListRetVal = result[3];
  
          // If the created list was found, then
          // handle its changes
          if (cListRetVal !== null) {
              cListRetVal = cListRetVal.val();
              if (cListRetVal) {
                  // If the user was the only one with access to
                  // the list, then delete it, otherwise,
                  // just decrement the user count
                  if (cListRetVal.user_count === 1) {
                      var childRmvRef = firebase.database().ref("/lists/" + cList);
                      childRmvRef.remove();
                  } else {
                      var newCount = cList.user_count - 1;
                      childRmvRef = firebase.database().ref("/lists/" + cList);
                      childRmvRef.update({
                          user_count: newCount
                      });
                  }
              }
          }
  
          // If the shared list was found, then
          // handle its changes
          if (sListRetVal !== null) {
              sListRetVal = sListRetVal.val();
              if (sListRetVal) {
                  // If the user was the only one with access to
                  // the list, then delete it, otherwise,
                  // just decrement the user count
                  if (sListRetVal.user_count === 1) {
                      childRmvRef = firebase.database().ref("/lists/" + sList);
                      childRmvRef.remove();
                  } else {
                      newCount = sList.user_count - 1;
                      childRmvRef = firebase.database().ref("/lists/" + sList);
                      childRmvRef.update({
                          user_count: newCount
                      });
                  }
              }
          }
  
          return true;
      });
  
      return retVal;
   }

   /**
    * CreateNewList
    * 
    * Creates a new list and adds it to the given
    * user's array of lists.
    * 
    * @param {String} listName: name of the list to create
    * 
    * @returns None
    */
   CreateNewList(listName, items = {}, userCount = 1) {
      var uid = firebase.auth().currentUser.uid;

      // Add the list to the lists table
      var ref = firebase.database().ref("/lists");
      var push = ref.push({
          name: listName,
          items: items,
          user_count: userCount,
      });
  
      // Add the list to the user table
      var key = push.key;
      var userPath = createUserPath(uid);
      ref = firebase.database().ref(userPath + "/lists/created/" + key)
      var retVal = ref.set(0).then((snapshot) => {
          return 0;
      }).catch(error => {
          console.log("Failed to create list: " + error);
      });
  
      return retVal;
   }

   /**
    * GetListsKeyAndName
    * 
    * Returns the keys and names of all of the
    * lists that the given user has access to.
    * 
    * @param {Component} that: context for caller
    * 
    * @returns An object containing the api data
    *          and names of all the lists the user has access to
    */
   GetListsKeyAndName() {
      var uid = firebase.auth().currentUser.uid;

      // Get the user path in the database
      var userPath = createUserPath(uid);
  
      var ref = firebase.database().ref(userPath + "/lists")
      var retVal = ref.once("value").then((snapshot) => {        
          var ssv = snapshot.val();
          var childVals = [];
          var listIds = [];
  
          // Parse the users current state to get their lists
          if (ssv) {
              // Get the user's created lists
              for (var created in ssv.created) {
                  listIds.push(created);
              }
  
              // Get the user's shared lists
              for (var shared in ssv.shared) {
                  listIds.push(shared);
              }          
  
              // Get the states if the lists the user has access to
              for (var idKey in listIds) {
                  var currentListId = listIds[idKey];
  
                  var childRef = firebase.database().ref("/lists/" + currentListId).once("value");
  
                  childVals.push(childRef);
              }
          }
  
          // Return the states of the lists
          return Promise.all(childVals);
         }).then(result => {
            var listIdLength = result.length;
  
            var apiData = [];
            var listTitles = [];
  
            // Parse all of the list states
            for (var i = 0; i < result.length; i++){
                var ssv = result[i];
  
                if (ssv) {
                    // Get the list's api data
                    apiData.push({
                        key: ssv.key,
                        name: ssv.val().name
                    });
  
                    // Get the list's title
                    listTitles.push(ssv.val().name);
  
                    if ((i - 1) === listIdLength) {
                        break;
                    }
                } else {
                    console.log("ERROR: List does not exist.");    
                    break;
                }
            }
  
            // Sort the list titles
            listTitles.sort((a, b) => a.localeCompare(b))
  
            // Return the data
            return {
               apiData: apiData,
               listTitles: listTitles,
            };
          }); 
  
      return retVal;
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
   getAvailableStores() {
      // Call the function to load all available stores
      var data = autocomplete.cloudLoadAvailableStores();
      return data;
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
   getAvailableItems() {
      // Call the function to load all available items
      var data = autocomplete.cloudLoadAvailableItems();
      return data;
   }

   /**
    * reorgListAdded
    * 
    * Returns the list of items, list of ids,
    * and the userCount of the given list.
    * 
    * @param {String} listId: id of the list to reorganize
    * 
    * @returns An object containing the list of items in the list,
    *          the ids of the items in the list, and the user cound
    *          of the list
    */
   reorgListAdded(listId) {  
      // Get the path to the list
      var listPath = createListPath(listId);
  
      var ref = firebase.database().ref(listPath);
      var retItems = ref.once('value').then((snapshot) => {
          var items = [];
          var ids = [];
  
          var ssv = snapshot.val();
          var userCount = 0;
  
          // Parse the list, getting all of the items and ids
          if (ssv && ssv.items) {
              var listItems = ssv.items;
              for (var itemId in listItems) {
                  items.push(listItems[itemId]);
                  ids.push(itemId);
             }
          }
  
          // Get the user count if it has been set
          if (ssv.user_count) {
             userCount = ssv.user_count;
          }
  
          // return the data
          return {
              items: items,
              ids: ids,
              userCount: userCount
          };
      });
  
      return retItems;
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