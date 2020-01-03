import * as firebase from "firebase";

/**
 * registerItem
 * 
 * Registers the given item information to the database.
 * 
 * @param {String} genericName   The generic name of the item
 * @param {String} specificName The specific name of the item
 *                              Default is null
 * @param {Integer} size The size of the item in the given unit of measurement
 *                       Default is null
 * @param {String} sizeUnit The unit of measurement corresponding to the given size
 *                          Default is null
 * @param {Integer} price The price of the item
 *                        Default is null
 * 
 * @returns None
 */
export async function registerItem(genericName, specificName = null, size = null, sizeUnit = null, price = null) {
    try {
       // Call the register item function
       const { data } = await firebase.functions().httpsCallable('registerItem')({
          genericName: genericName,
          specificName: specificName,
          size: size,
          sizeUnit: sizeUnit,
          price: price
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}

/**
 * registerStore
 * 
 * Registers the given store information to the database.
 * 
 * @param {String} storeName The name of the store
 * @param {String} address The address of the store
 * @param {Array} map The map of the store
 * @param {String} franchiseName The franchise name of the store
 *                               Default is  null
 * 
 * @returns None
 */
export async function registerStore(storeName, address, map, franchiseName = null) {
    try {
      // Call the register store function
       const { data } = await firebase.functions().httpsCallable('registerStore')({
            storeName: storeName,
            address: address,
            map: map,
            franchiseName: franchiseName,
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}

/**
 * addItemLoc
 * 
 * Registers the given location to the database,
 * 
 * @param {String} genericName The generic name of the item
 * @param {String} specificName The specific name of the item
 * @param {String} storeName The name of the store
 * @param {String} address The address of the store
 * @param {Integer} aisleNum The aisle number of the item
 * @param {String} itemDepartment The department name of the item
 * 
 * @returns None
 */
export async function addItemLoc(genericName, specificName, storeName, address, aisleNum, itemDepartment) {
    try {
      // Call the add item location function
       const { data } = await firebase.functions().httpsCallable('addItemLoc')({
            genericName: genericName,
            specificName: specificName,
            storeName: storeName,
            address: address,
            aisleNum: aisleNum,
            itemDepartment: itemDepartment
       });

       return data;
    } catch (e) {
       console.error(e);

       return(null);
    }
}
