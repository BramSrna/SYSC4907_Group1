const dataRegFuncs = require('./DataRegFuncs');

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
 * cloudAddItemToList
 * 
 * Adds the given item to the given list.
 * If the item has not previously been registered,
 * it is registered to the database.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The id of the item
 */
exports.cloudAddItemToList = function(data, context, database) {
    // Parse the data object
    var listId = data.listId;
    var genName = data.genName;
    var specName = data.specName;
    var itemPurchased = data.purchased;
    var itemQuantity = data.quantity;
    var itemSize = data.size;
    var itemNotes = data.notes;

    // Retrieve the item from the database
    var retVal = dataRegFuncs.getItem(database, genName, specificName = specName).then((itemInfo) => {
        var item = itemInfo.item;

        if (item === null) {
            // If the item has not been registered, then register it
            var temp = dataRegFuncs.registerItem(database, genName, specificName = specName);
        }

        return Promise.all([temp]);
    }).then(result => {
        var listPath = createListPath(listId);
        // Get the id of the item
        var itemId = (new dataRegFuncs.ItemObj(genName, specificName = specName)).getId();

        // Add the item to the list
        database.ref(listPath + "/items/" + itemId).update({
            genName: genName,
            specName: specName,
            purchased: itemPurchased,
            quantity: itemQuantity,
            size: itemSize,
            notes: itemNotes
        });

        return itemId;
    });

    return retVal;
}

/**
 * cloudDeleteItemInList
 * 
 * Delete the given item from the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 * 
 * 
 */
exports.cloudDeleteItemInList = function(data, context, database) {
    // Parse the data object
    var listId = data.listId;
    var itemId = data.itemId;

    // Get the path to the list
    var listPath = createListPath(listId);

    // Remove the item
    var ref = database.ref(listPath + "/items/" + itemId);
    ref.remove();
}

/**
 * cloudUpdatePurchasedBoolOfAnItemInAList
 * 
 * Toggles the purchased boolean of the given item
 * in the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new purchased state
 */
exports.cloudUpdatePurchasedBoolOfAnItemInAList = function(data, context, database) {
    // Parse the data object
    var listId = data.listId;
    var itemId = data.itemId;

    // Get the path to the list
    var listPath = createListPath(listId);

    // Get the current state of the item
    var ref = database.ref(listPath + "/items/" + itemId);
    var retVal = ref.once("value").then((snapshot) => {
        var currentBool = snapshot.val().purchased;

        // Update the item with the new purchased state
        var newRef = database.ref(listPath + "/items/" + itemId);
        newRef.update({
            purchased: !currentBool,
        });

        return !currentBool;
    });

    return retVal;
}

/**
 * cloudGetItemsInAList
 * 
 * Returns the list of items, list of ids,
 * and the userCount of the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns An object containing the list of items in the list,
 *          the ids of the items in the list, and the user cound
 *          of the list
 */
exports.cloudGetItemsInAList = function(data, context, database) {
    // Parse the data object
    var listId = data.listId;

    // Get the path to the list
    var listPath = createListPath(listId);

    var ref = database.ref(listPath);
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
 * cloudDeleteList
 * 
 * Removes the given list from the given users array
 * of lists that they have access to. If that user was
 * the only user that had access to the list, then the
 * list is also deleted from the database. If there are
 * other users with access to the list, then the user count
 * on the list is decremeneted.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.cloudDeleteList = function(data, context, database) {
    // Parse the data object
    var uid = data.uid;
    var listId = data.listId;

    // Get the path to the user
    var userPath = createUserPath(uid);
    var ref = database.ref(userPath + "/lists");
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

                var rmvRef = database.ref(userPath + "/lists/created/" + cList);
                rmvRef.remove();
            }

            // Do the same as above for the user's shared lists
            if (sharedLists.includes(listId)){
                i = sharedLists.findIndex(x => x === listId);

                // Save the id of the list
                sList = createdLists[i];

                rmvRef = database.ref(userPath + "/lists/shared/" + sList);
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
            cListRetVal = database.ref("/lists/" + cList).once("value");
        }

        // Get the shared list from the lists table
        if (sList !== null) {
            sListRetVal = database.ref("/lists/" + sList).once("value");
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
                    var childRmvRef = database.ref("/lists/" + cList);
                    childRmvRef.remove();
                } else {
                    var newCount = cList.user_count - 1;
                    childRmvRef = database.ref("/lists/" + cList);
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
                    childRmvRef = database.ref("/lists/" + sList);
                    childRmvRef.remove();
                } else {
                    newCount = sList.user_count - 1;
                    childRmvRef = database.ref("/lists/" + sList);
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
 * cloudCreateNewList
 * 
 * Creates a new list and adds it to the given
 * user's array of lists.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.cloudCreateNewList = function(data, context, database) {
    // Parse the data object
    var uid = data.uid;
    var listName = data.listName;
    var items = data.items;
    var userCount = data.userCount;

    // Add the list to the lists table
    var ref = database.ref("/lists");
    var push = ref.push({
        name: listName,
        items: items,
        user_count: userCount,
    });

    // Add the list to the user table
    var key = push.key;
    var userPath = createUserPath(uid);
    ref = database.ref(userPath + "/lists/created/" + key)
    var retVal = ref.set(0).then((snapshot) => {
        return 0;
    }).catch(error => {
        console.log("Failed to create list: " + error);
    });

    return retVal;
}

/**
 * cloudGetListsKeyAndName
 * 
 * Returns the keys and names of all of the
 * lists that the given user has access to.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns An object containing the api data
 *          and names of all the lists the user has access to
 */
exports.cloudGetListsKeyAndName = function(data, context, database) {
    // Parse the data object
    var uid = data.uid;

    // Get the user path in the database
    var userPath = createUserPath(uid);

    var ref = database.ref(userPath + "/lists")
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

                var childRef = database.ref("/lists/" + currentListId).once("value");

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