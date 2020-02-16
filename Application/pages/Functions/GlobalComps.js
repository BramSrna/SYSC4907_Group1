import * as firebase from "firebase";

/**
 * ItemObj
 * 
 * An item object used to format the various paths
 * and ids for items.
 */
class ItemObj {
    /**
     * constructor
     * 
     * Creates a new item object
     * 
     * @param {String} genericName The generic name of the object
     * @param {String} specificName The specific name of the object
     *                              default is null
     * 
     * @returns None
     */
    constructor(genericName, specificName = null) {
        this.genericName = genericName;
        this.specificName = specificName;
    }

    /**
     * getPath
     * 
     * Returns the expected path to the item.
     * Path is:
     *  /items/${genericName}/${specificName}/
     * 
     * @param   None
     * 
     * @returns The path to the item
     */
    getPath() {
        var itemPath = "/items/" + this.genericName + "/" + this.specificName + "/";
        return(itemPath);
    }

    /**
     * getId
     * 
     * Returns the expected id of the item.
     * The name is:
     *  ${genericName}&${specificName}
     * 
     * @param   None
     * 
     * @returns The id of the item
     */
    getId() {
        var itemId = this.genericName + "&" + this.specificName;
        return(itemId);
    }

    /**
     * getDispName
     * 
     * Returns the name of this item to display to the user.
     * The name is:
     *  ${genericName} (${specificName})
     * 
     * @param   None
     * 
     * @returns The display name of the item
     */
    getDispName() {
        // Initialize the name to the generic name
        var itemName = this.genericName;

        // If the specific name is not null, add it to the name
        if ((this.specificName !== "null") && (this.specificName !== null)) {
            itemName += " (" + this.specificName + ")";
        }
        return(itemName);

    }

    /**
     * getInfoFromId
     * 
     * Returns the item data corresponding to the
     * given id
     * 
     * @param {String} id The id of the item
     * 
     * @returns The data of the item
     */
    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            genericName: parts[0],
            specificName: parts[1]
        }
    }
}

/**
 * StoreObj
 * 
 * A store object used to format the various paths
 * and ids for stores.
 */
class StoreObj {
    /**
     * constructor
     * 
     * Creates a new store object
     * 
     * @param {String} address The address of the object
     * @param {String} storeName The store name of the object
     *                           default is null
     * 
     * @returns None
     */
    constructor(address, storeName) {
        this.address = address;
        this.storeName = storeName;
    }

    /**
     * getPath
     * 
     * Returns the expected path to the store.
     * Path is:
     *  /stores/${address}/${storeName}/
     * 
     * @param   None
     * 
     * @returns The path to the store
     */
    getPath() {
        var storePath = "/stores/" + this.address + "/" + this.storeName + "/";
        return(storePath);
    }

    /**
     * getId
     * 
     * Returns the expected id of the store.
     * The name is:
     *  ${address}&${storeName}
     * 
     * @param   None
     * 
     * @returns The id of the store
     */
    getId() {
        var storeId = this.address + "&" + this.storeName;
        return(storeId);
    }

    /**
     * getDispName
     * 
     * Returns the name of this store to display to the user.
     * The name is:
     *  ${storeName} - ${address}
     * 
     * @param   None
     * 
     * @returns The display name of the store
     */
    getDispName() {
        var storeName = this.storeName + " - " + this.address;
        return(storeName);

    }

    /**
     * getInfoFromId
     * 
     * Returns the store data corresponding to the
     * given id
     * 
     * @param {String} id The id of the store
     * 
     * @returns The data of the store
     */
    static getInfoFromId(id) {
        var parts = id.split("&");
        return {
            address: parts[0],
            storeName: parts[1]
        }
    }
}

/**
 * getItem
 * 
 * Retrives the item object from the given database
 * corresponding to the given generic name and specific name.
 * 
 * @param {String} genericName The generic name of the item
 * @param {String} specificName The specific name of the item
 *                              Default is null
 * 
 * @returns The item object corresponding to the given data
 *          Null if no item found
 */
const getItem = function(genericName, specificName = null){
    var itemInfo = firebase.database().ref("/items").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var item = null;

        // Parse the item table for the item
        for (var tempGenName in ssv) {
            if (tempGenName === genericName) {
                // Generic name subtable found
                var temp = ssv[tempGenName];
                for (var tempSpecName in temp) {
                    if (((tempSpecName === "null") && (specificName === null)) || (tempSpecName === specificName)) {
                        // Item found
                        item = ssv[tempGenName][tempSpecName];

                        // Get the final price of the item by
                        // parsing all of the known prices from teh descriptions
                        var minPrice = Number.MAX_SAFE_INTEGER;
                        var maxPrice = -1;
                        if (item !== null) {
                            var descs = item.descs;
                            for (var currDescId in descs) {
                                // Parse each description
                                var currDesc = descs[currDescId];
                                var prices = currDesc.prices;
                                if (prices){
                                    for (var i = 0; i < prices.length; i++) {
                                        // Update the price range with the new information
                                        var currPrice = prices[i];
                                        if (currPrice < minPrice) {
                                            minPrice = currPrice;
                                        }

                                        if (currPrice > maxPrice) {
                                            maxPrice = currPrice;
                                        }
                                    }
                                }
                            }
                        }

                        if (maxPrice != -1) {
                            // Add the final price range to the item
                            item.finalPrice = {
                                minPrice: minPrice,
                                maxPrice: maxPrice
                            }
                        } else {
                            item.finalPrice = {}
                        }
                        
                        break;
                    }
                }
                break;
            }
        }

        return {
            item: item
        }
    });

    return itemInfo;
}

/**
 * getStore
 * 
 * Retrives the store object from the given database
 * corresponding to the given store name and address.
 * 
 * @param {String} storeName The name of the store
 * @param {String} address The address of the store
 * 
 * @returns The store object, null if not found
 */
const getStore = function(storeName, address) {
    var storeInfo = firebase.database().ref("/stores").once("value").then((snapshot) => {
        var ssv = snapshot.val();
        var store = null;

        // Parse the store table
        for (var tempAddress in ssv) {
            if (tempAddress === address) {
                // Address subtable found
                var temp = ssv[tempAddress];

                for (var tempStoreName in temp) {
                    if (tempStoreName === storeName) {
                        // Store found
                        store = ssv[tempAddress][tempStoreName];
                        break;
                    }
                }
                break;
            }
        }

        return {
            store: store
        }
    });

    return storeInfo;
}

exports.ItemObj = ItemObj;
exports.StoreObj = StoreObj;
exports.getItem = getItem;
exports.getStore = getStore;