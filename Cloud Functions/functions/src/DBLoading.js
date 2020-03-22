const StoreObj = require('./StoreObj');

var dbCache = {
    storesMaps: {},
    stores: null,
    storeSimilarities: null,
    lists: {}
}

exports.loadStoresMaps = async function(database, storeId) {
    // Get the store's info from the id
    var info = StoreObj.StoreObj.getInfoFromId(storeId);
    var address = info.address;
    var storeName = info.storeName;

    // Get the path to the store
    var storePath = (new StoreObj.StoreObj(address, storeName)).getPath();

    if (!(storePath in dbCache.storesMaps)) {
        // Get the current state of the store's maps
        var dbMap = await database.ref(storePath + "maps").once("value").then((snapshot) => {
            var val = snapshot.val();            
            dbCache.storesMaps[storePath] = val;
            return val;
        });
        return dbMap;
    } else {
        return dbCache.storesMaps[storePath];
    }
}

exports.loadAllStores = async function(database) {
    if (dbCache.stores === null) {
        // Load the stores table
        var dbStores = await database.ref('/stores').once('value').then((snapshot) => {
            var val = snapshot.val()
            dbCache.stores = val;
            return val;
        });
        return dbStores;
    } else {
        return dbCache.stores;
    }
}

exports.loadStoreSimilarities = async function(database) {
    if (dbCache.storeSimilarities === null) {
        // Load the stores table
        var dbStoreSimilarities = await database.ref("storeSimilarities").once("value").then((snapshot) => {
            var val = snapshot.val();
            dbCache.storeSimilarities = val;
            return val;
        });
        return dbStoreSimilarities;
    } else {
        return dbCache.storeSimilarities;
    }
}

exports.loadList = async function(database, listId) {
    if (!(listId in dbCache.lists)) {
        var dbList = await database.ref('/lists/' + listId).once('value').then((snapshot) => {
            var val = snapshot.val();
            dbCache.lists[listId] = val;
            return val;
        });
        return dbList;
    } else {
        return dbCache.lists[listId];
    }
}