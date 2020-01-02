const dataRegFuncs = require('./DataRegFuncs');

function getStoreFromId(knownStores, storeId) {
   var info = dataRegFuncs.StoreObj.getInfoFromId(storeId);
   var address = info.address;
   var storeName = info.storeName;

   var store = knownStores[address][storeName];
   return(store);
}

function getStoreMap(database, storeId) {
    var info = dataRegFuncs.StoreObj.getInfoFromId(storeId);

    var address = info.address;
    var storeName = info.storeName;

    var storePath = (new dataRegFuncs.StoreObj(address, storeName)).getPath();

    var map = database.ref(storePath + "maps").once("value").then((snapshot) => {
        var ssv = snapshot.val();

        var mapCount = {};

        for (var tempMapId in ssv) {
            var tempMapObj = ssv[tempMapId];

            var weight = tempMapObj.weight;
            var tempMap = tempMapObj.map;

            for (var i = 0; i < tempMap.length; i++) {
                var dep = tempMap[i];
                if (!(dep in mapCount)) {
                    mapCount[dep] = 0;
                }

                mapCount[dep] = mapCount[dep] + i * weight;
            }
        }

        var sortMap = [];
        for (dep in mapCount) {
            sortMap.push([dep, mapCount[dep]]);
        }

        sortMap.sort((a, b) => {
            return a[1] - b[1];
        });

        var finalMap = [];
        for (i = 0; i < sortMap.length; i++){
            finalMap.push(sortMap[i][0]);
        }

        console.log(finalMap);

        return finalMap;
    });

    return map;
}

function getItemLocInStore(knownStores, storeId, itemId){
   var department = null;
   var aisleNum = null;
   var aisleTags = [];

   var itemList = getStoreFromId(knownStores, storeId).items;

   for (var tempItemId in itemList) {
      if (tempItemId === itemId) {
         var candItemInfo = itemList[tempItemId];
         var maxCount = -1;
         var info = null;

         for (var tempCandItemInfoId in candItemInfo) {
            var tempCandItemInfo = candItemInfo[tempCandItemInfoId];
            if (tempCandItemInfo.count > maxCount) {
               info = tempCandItemInfo;
               maxCount = tempCandItemInfo.count;
            }
         }

         department = info.department;
         aisleNum = info.aisleNum;
         for (var tag in info.tags){
               aisleTags.push(info.tags[tag]);
         }
      }
   }

   return {
      department: department,
      aisleNum: aisleNum,
      aisleTags: aisleTags
   };
}

function loadAllStoreInfo(database) {
   // The "once" method reads a value from the database, returning a promise
   // Use "then" to access the promise
   var ref = database.ref('/stores');
   var retItems = ref.once('value').then((snapshot) => {
      var ssv = snapshot.val();

      return {
         stores: ssv
      };
   });

   return retItems;

}

function calcStoreSimilarity(knownStores, storeId1, storeId2){
   var items1 = getStoreFromId(knownStores, storeId1).items;
   var items2 = getStoreFromId(knownStores, storeId2).items;

   var itemIntersect = [];
   var maxNumItems = 0;

   for (var itemId in items1){
      maxNumItems += 1;

      for (var itemId2 in items2){
         if (itemId === itemId2) {
            itemIntersect.push(itemId);
         }
      }
   }

   var similarity = 0;

   for (var i = 0; i < itemIntersect.length; i++) {
      itemId = itemIntersect[i];

      var loc1 = getItemLocInStore(knownStores, storeId1, itemid);
      var loc2 = getItemLocInStore(knownStores, storeId2, itemid);

      var depComp = loc1.department === loc1.department ? 1 : 0;
      var aisleComp = loc1.aisleNum === loc2.aisleNum ? 1 : 0;

      similarity += (0.8 * depComp) + (0.2 * aisleComp);
   }

   similarity = similarity / maxNumItems;

   return(similarity);

}

function predictItemLoc(database, storeId, itemId) {
    var temp = loadAllStoreInfo(database);
    var retItems = temp.then((value) => {
        var knownStores = value.stores;
        var loc = getItemLocInStore(knownStores, storeId, itemId);

        var department = null;
        var aisleNum = null;
        var aisleTags = [];

        if (loc.department !== null){
            department = loc.department;
            aisleNum = loc.aisleNum;
            aisleTags = loc.aisleTags;
        } else {
            var storesWithItem = [];

            for (var tempAddress in knownStores){
                for (var tempStoreName in knownStores[tempAddress]){
                var tempStoreId = (new dataRegFuncs.StoreObj(tempAddress, tempStoreName)).getId();

                var tempLoc = getItemLocInStore(knownStores, tempStoreId, itemId);

                if (tempLoc.department !== null) {
                    storesWithItem.push({
                        id: tempStoreId,
                        department: tempLoc.department,
                        aisleNum: tempLoc.aisleNum,
                        aisleTags: tempLoc.aisleTags
                    });
                }
                }
            }

            for (var i = 0; i < storesWithItem.length; i++) {
                var temp = calcStoreSimilarity(knownStores, storeId, storesWithItem[i].id);
                storesWithItem[i].score = temp;
            }

            storesWithItem.sort((a, b) => {
                var valueA, valueB;

                valueA = a.score;
                valueB = b.score;

                if (valueA < valueB) {
                    return -1;
                } else if (valueA > valueB) {
                    return 1;
                } else {
                    return 0;
                }
            })

            storesWithItem = storesWithItem.slice(0, 3);

            depCount = {};
            aisleCount = {};

            for (i = 0; i < storesWithItem.length; i++){
                var store = storesWithItem[i];
                var dep = store.department;
                var num = store.aisleNum;

                if (dep in depCount){
                    depCount[dep] += 1;
                } else {
                    depCount[dep] = 1;
                }

                if (num in aisleCount){
                    aisleCount[num] += 1;
                } else {
                    aisleCount[num] = 0;
                }
            }

            department = Object.keys(depCount);
            if (department.length > 0) {
                department = department.reduce((a, b) => depCount.a > depCount.b ? a : b);
            } else {
                department = null;
            }

            aisleNum = Object.keys(aisleCount)
            if (aisleNum.length > 0) {
                aisleNum = aisleNum.reduce((a, b) => aisleCount.a > aisleCount.b ? a : b);
            } else {
                aisleNum = null;
            }

        }

        return {
            department : department,
            aisleNum : aisleNum,
            aisleTags : aisleTags
        }
    });

    return retItems;
}

exports.cloudReorgListLoc = function(data, context, database) {
    var listId = data.listId;
    var storeId = data.storeId;

    // The "once" method reads a value from the database, returning a promise
    // Use "then" to access the promise
    var ref = database.ref('/lists/' + listId);
    var retItems = ref.once('value').then((snapshot) => {
        var items = [];
        var ids = [];
        var ssv = snapshot.val();
        if (ssv && ssv.items) {
           for (var item in ssv.items) {
              items.push(ssv.items[item]);
              ids.push(item);
           }
        }

        return {
          items: items,
          ids: ids
        };
    }).then(result => {
        var items = result.items;
        var ids = result.ids;

        var locs = [];
        for (var i = 0; i < ids.length; i++) {
            loc = predictItemLoc(database, storeId, ids[i]); 
            locs.push(loc);  
        }

        return Promise.all([Promise.all(locs), Promise.all(ids), Promise.all(items)]);
    }).then(result => {
        var predictedLocs = result[0];
        var ids = result[1];
        var items = result[2];

        var locs = [];

        for (var i = 0; i < predictedLocs.length; i++) {
            var loc = predictedLocs[i];

            locs.push({
                item: items[i],
                id: ids[i],
                department: loc.department,
                aisleNum: loc.aisleNum,
                aisleTags: loc.aisleTags
            })
        }

        locs.sort((a, b) => {
            var depA, depB;
            var aisleA, aisleB;

            depA = a.department;
            depB = b.department;

            aisleA = a.aisleNum;
            aisleB = b.aisleNum;

            if (depA < depB) {
                    return -1;
            } else if (depA > depB) {
                    return 1;
            } else {
                if (aisleA < aisleB) {
                    return - 1;
                } else if (aisleA > aisleB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        items = [];
        ids = [];

        for (i = 0; i < locs.length; i++) {
            items.push(locs[i].item);
            ids.push(locs[i].id);
        }

        return {
            items: items,
            ids: ids,
        };
    });

    return retItems;
}

exports.cloudReorgListFastest = function(data, context, database) {
    var storeId = data.storeId;
    var listId = data.listId;

    // The "once" method reads a value from the database, returning a promise
    // Use "then" to access the promise
    var ref = database.ref('/lists/' + listId);
    var retItems = ref.once('value').then((snapshot) => {
        var items = [];
        var ids = [];
        var ssv = snapshot.val();
        if (ssv && ssv.items) {
           for (var item in ssv.items) {
              items.push(ssv.items[item]);
              ids.push(item);
           }
        }

        return {
          items: items,
          ids: ids
        };
    }).then(result => {
        var items = result.items;
        var ids = result.ids;

        var locs = [];
        for (var i = 0; i < ids.length; i++) {
            loc = predictItemLoc(database, storeId, ids[i]); 
            locs.push(loc);  
        }

        var map = getStoreMap(database, storeId);

        return Promise.all([
            Promise.all(locs),
            Promise.all(ids),
            Promise.all(items),
            map
        ]);
    }).then(result => {
        var predictedLocs = result[0];
        var ids = result[1];
        var items = result[2];
        var map = result[3];

        var locs = [];

        for (var i = 0; i < predictedLocs.length; i++) {
            var loc = predictedLocs[i];

            locs.push({
                item: items[i],
                id: ids[i],
                department: loc.department,
                aisleNum: loc.aisleNum,
                aisleTags: loc.aisleTags
            })
        }

        locs.sort((a, b) => {
            var nameA, nameB;
            var depA, depB;
            var aisleA, aisleB;
            var depIndA, depIndB;

            nameA = a.item.name;
            nameB = b.item.name;

            depA = a.department;
            depB = b.department;

            aisleA = a.aisleNum;
            aisleB = b.aisleNum;

            depIndA = Object.keys(map).find(key => map[key] === depA);
            depIndB = Object.keys(map).find(key => map[key] === depB);

            if (depIndA === undefined) {
               depIndA = -1;
            }

            if (depIndB === undefined) {
                depIndB = -1;
             }

            if (depIndA < depIndB) {
                return -1;
            } else if (depIndA > depIndB) {
                return 1;
            } else {
                if (depIndA === -1) {
                    if (depA < depB) {
                        return -1;
                    } else if (depA > depB) {
                        return 1;
                    }
                }
                if (aisleA < aisleB) {
                    return - 1;
                } else if (aisleA > aisleB) {
                    return 1;
                } else {
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });

        items = [];
        ids = [];

        for (i = 0; i < locs.length; i++) {
            items.push(locs[i].item);
            ids.push(locs[i].id);
        }

        return {
            items: items,
            ids: ids,
        };
    });

    return retItems;
} 