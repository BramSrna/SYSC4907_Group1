const dataRegFuncs = require('./DataRegFuncs');

exports.cloudLoadAvailableStores = function(data, context, database) {
   // The "once" method reads a value from the database, returning a promise
   // Use "then" to access the promise
   var ref = database.ref('/stores');
   var retItems = ref.once('value').then((snapshot) => {
      var stores = [];
      var storeIds = [];
      var ssv = snapshot.val();
      if (ssv) {
         for (var tempAddress in ssv) {
            for (var tempStoreName in ssv[tempAddress]) {
               var tempStore = new dataRegFuncs.StoreObj(tempAddress, tempStoreName);

               var storeId = tempStore.getId();
               var dispName = tempStore.getDispName();

               stores.push(dispName);
               storeIds.push(storeId);
            }
         }
      }

      return {
         ids: storeIds,
         stores: stores
      };
   });

   return retItems;
}

exports.cloudLoadAvailableItems = function(data, context, database) {
   // The "once" method reads a value from the database, returning a promise
   // Use "then" to access the promise
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
               var tempItem = new dataRegFuncs.ItemObj(tempGenName, tempSpecName);

               var itemId = tempItem.getId();
               var itemName = tempItem.getDispName();

               dispNames.push(itemName);
               itemIds.push(itemId);
               genNames.push(tempGenName);
               specNames.push(tempSpecName);
            }
         }
      }

      return {
         ids: itemIds,
         items: dispNames,
         genNames: genNames,
         specNames: specNames
      };
   });

   return retItems;
} 