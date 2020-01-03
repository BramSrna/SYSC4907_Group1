const dataRegFuncs = require('./DataRegFuncs');

function createListPath(listId) {
    var listPath = "/lists/" + listId;
    return(listPath);
}

function createUserPath(userId) {
    var userPath = "/users/" + userId;
    return(userPath);
}

exports.cloudAddItemToList = function(data, context, database) {
    var listId = data.listId;
    var genName = data.genName;
    var specName = data.specName;
    var itemPurchased = data.purchased;
    var itemQuantity = data.quantity;
    var itemSize = data.size;
    var itemNotes = data.notes;

    var retVal = dataRegFuncs.getItem(database, genName, specificName = specName).then((itemInfo) => {
        var item = itemInfo.item;

        if (item === null) {
            var temp = dataRegFuncs.registerItem(database, genName, specificName = specName);
        }

        return Promise.all([temp]);
    }).then(result => {
        var listPath = createListPath(listId);
        var itemId = (new dataRegFuncs.ItemObj(genName, specificName = specName)).getId();
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

exports.cloudDeleteItemInList = function(data, context, database) {
    var listId = data.listId;
    var itemId = data.itemId;

    var listPath = createListPath(listId);

    var ref = database.ref(listPath + "/items/" + itemId);
    ref.remove();
}

exports.cloudUpdatePurchasedBoolOfAnItemInAList = function(data, context, database) {
    var listId = data.listId;
    var itemId = data.itemId;

    var listPath = createListPath(listId);

    var ref = database.ref(listPath + "/items/" + itemId);
    var retVal = ref.once("value").then((snapshot) => {
        var currentBool = snapshot.val().purchased;

        var newRef = database.ref(listPath + "/items/" + itemId);
        newRef.update({
            purchased: !currentBool,
        });

        return !currentBool;
    });

    return retVal;
}

exports.cloudGetItemsInAList = function(data, context, database) {
    var listId = data.listId;

    var listPath = createListPath(listId);

    var ref = database.ref(listPath);
    var retItems = ref.once('value').then((snapshot) => {
        var items = [];
        var ids = [];

        var ssv = snapshot.val();
        var userCount = 0;

        if (ssv && ssv.items) {
            var listItems = ssv.items;
            for (var itemId in listItems) {
                items.push(listItems[itemId]);
                ids.push(itemId);
           }
        }

        if (ssv.user_count) {
           userCount = ssv.user_count;
        }

        return {
            items: items,
            ids: ids,
            userCount: userCount
        };
    });

    return retItems;
}

exports.cloudDeleteList = function(data, context, database) {
    var uid = data.uid;
    var listId = data.listId;

    var userPath = createUserPath(uid);
    var ref = database.ref(userPath + "/lists");
    var retVal = ref.once("value").then((snapshot) => {
        var cList = null;
        var sList = null;

        if (snapshot.val()) {
            var createdLists = [];
            var sharedLists = [];

            var temp = snapshot.val().created;
            for (var id in temp) {
                createdLists.push(id);
            }

            temp = snapshot.val().shared;
            for (id in temp) {
                sharedLists.push(id);
            }

            if (createdLists.includes(listId)) {
                var i = createdLists.findIndex(x => x === listId);
                cList = createdLists[i];
                var rmvRef = database.ref(userPath + "/lists/created/" + cList);
                rmvRef.remove();
            }

            if (sharedLists.includes(listId)){
                i = sharedLists.findIndex(x => x === listId);
                sList = createdLists[i];
                rmvRef = database.ref(userPath + "/lists/shared/" + sList);
                rmvRef.remove();
            }
        }

        return Promise.all([cList, sList]);
    }).then(result => {
        var cList = String(result[0]);
        var sList = String(result[1]);

        var cListRetVal = null;
        var sListRetVal = null;

        if (cList !== null) {
            cListRetVal = database.ref("/lists/" + cList).once("value");
        }

        if (sList !== null) {
            sListRetVal = database.ref("/lists/" + sList).once("value");
        }

        return Promise.all([cList, cListRetVal, sList, sListRetVal]);
    }).then(result => {
        var cList = result[0];
        var cListRetVal = result[1];
        var sList = result[2];
        var sListRetVal = result[3];

        if (cListRetVal !== null) {
            cListRetVal = cListRetVal.val();
            if (cListRetVal) {
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

        if (sListRetVal !== null) {
            sListRetVal = sListRetVal.val();
            if (sListRetVal) {
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

exports.cloudCreateNewList = function(data, context, database) {
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

exports.cloudGetListsKeyAndName = function(data, context, database) {
    var uid = data.uid;

    var userPath = createUserPath(uid);

    var ref = database.ref(userPath + "/lists")
    var retVal = ref.once("value").then((snapshot) => {        
        var ssv = snapshot.val();
        var childVals = [];
        var listIds = [];

        if (ssv) {
            for (var created in ssv.created) {
                listIds.push(created);
            }

            for (var shared in ssv.shared) {
                listIds.push(shared);
            }          

            for (var idKey in listIds) {
                var currentListId = listIds[idKey];

                var childRef = database.ref("/lists/" + currentListId).once("value");

                childVals.push(childRef);
            }
        }
        return Promise.all(childVals);
       }).then(result => {
          var listIdLength = result.length;

          var apiData = [];
          var listTitles = [];

          for (var i = 0; i < result.length; i++){
              var ssv = result[i];

              if (ssv) {
                  apiData.push({
                      key: ssv.key,
                      name: ssv.val().name
                  });

                  listTitles.push(ssv.val().name);

                  if ((i - 1) === listIdLength) {
                      break;
                  }
              } else {
                  console.log("ERROR: List does not exist.");    
                  break;
              }
          }

          listTitles.sort((a, b) => a.localeCompare(b))

          return {
             apiData: apiData,
             listTitles: listTitles,
          };
        }); 

    return retVal;
} 