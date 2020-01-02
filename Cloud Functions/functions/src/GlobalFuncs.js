const dataRegFuncs = require('./dataRegFuncs');

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