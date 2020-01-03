const dataRegFuncs = require('./DataRegFuncs');

/**
 * cloudLoadAvailableStores
 * 
 * Loads all available stores. Available stores
 * are all known stores. Saves each stores ids and
 * their display names.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The ids and names of each store
 */
exports.cloudLoadAvailableStores = function(data, context, database) {
   // Parse the stores table
   var ref = database.ref('/stores');
   var retItems = ref.once('value').then((snapshot) => {
      var stores = [];
      var storeIds = [];

      var ssv = snapshot.val();
      if (ssv) {
         for (var tempAddress in ssv) {
            for (var tempStoreName in ssv[tempAddress]) {
               // Create a Store object corresponding to the current address and name
               var tempStore = new dataRegFuncs.StoreObj(tempAddress, tempStoreName);

               // Get the store ID and display name
               var storeId = tempStore.getId();
               var dispName = tempStore.getDispName();

               // Save the name and id
               stores.push(dispName);
               storeIds.push(storeId);
            }
         }
      }

      // Return the parsed data
      return {
         ids: storeIds,
         stores: stores
      };
   });

   return retItems;
}

/**
 * cloudLoadAvailableItems
 * 
 * Loads all available items. Available items
 * are all known items. Saves each items ids, their display names,
 * generic names, and specific name.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The ids and names of each item
 */
exports.cloudLoadAvailableItems = function(data, context, database) {
   // Parse the items table
   var ref = database.ref('/items');
   var retItems = ref.once('value').then((snapshot) => {
      var dispNames = [];
      var itemIds = [];
      var genNames = [];
      var specNames = [];

      var ssv = snapshot.val();

      if (ssv) {
         for (var tempGenName in ssv) {
            var subItems = ssv[tempGenName];
            for (var tempSpecName in subItems) {
               // Create a Store object corresponding to the current generic and specific names
               var tempItem = new dataRegFuncs.ItemObj(tempGenName, tempSpecName);

               // Get the item ID and display name
               var itemId = tempItem.getId();
               var itemName = tempItem.getDispName();

               // Save the names and id
               dispNames.push(itemName);
               itemIds.push(itemId);
               genNames.push(tempGenName);
               specNames.push(tempSpecName);
            }
         }
      }

      // Return the parsed data
      return {
         ids: itemIds,
         items: dispNames,
         genNames: genNames,
         specNames: specNames
      };
   });

   return retItems;
} 