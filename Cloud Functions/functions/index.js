'use strict';
const reorgFuncs = require('./src/ReorgFuncs');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const database = admin.database();

// https://firebase.google.com/docs/functions/write-firebase-functions

//This function updates the created_count based on the number of items in a users created list
exports.updateCreatedListCount = functions.database.ref('/users/{uid}/lists/created').onWrite((change, context) => {
    return change.after.ref.parent.child('created_count').set(change.after.numChildren());
});

//This function updates the shared_count based on the number of items in a users shared list
exports.updateSharedListCount = functions.database.ref('/users/{uid}/lists/shared').onWrite((change, context) => {
    return change.after.ref.parent.child('shared_count').set(change.after.numChildren());
});

exports.updateClusterCount = functions.database.ref('/stores/{addr}/{name}/maps').onWrite((change, context) => {
    var retVal = database.ref("/globals/storeMapVals").once("value").then((snapshot) => {
        var ssv = snapshot.val();

        var prevUpdate;
        var currCount;

        if (ssv !== null) {
            prevUpdate = ssv.prevClusterUpdate;
            currCount = ssv.currCount;
    
            currCount += 1;
        } else {
            prevUpdate = 0;
            currCount = 1;
        }
    
        var update = false;
        if (currCount > prevUpdate * (1 + 0.1)) {
            reorgFuncs.cloudDetermineClusters(database);
            prevUpdate = currCount;
            update = true;
        }

        database.ref("/globals/storeMapVals").update({
            currCount: currCount,
            prevClusterUpdate: prevUpdate
        });

        return update;
    });

    return retVal;
});

// NOTE: The following are wrappers for functions found in other
// files. They have to be here to be compiled.

/**
 * cloudReorgListLoc
 * 
 * Reorganize the given list based on
 * the locations of the items in the store.
 * Predicts locations as needed.
 * the groupings of items are then sorted based
 * on the alphabetical order of the department titles.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new order of the items and ids
 */
exports.cloudReorgListLoc = functions.https.onCall((data, context) => {
   return reorgFuncs.cloudReorgListLoc(data, context, database);
});

/**
 * cloudReorgListFastest
 * 
 * Reorganize the given list based on
 * the fastest path through the store.
 * Predicts locations as needed.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new order of the items and ids
 */
exports.cloudReorgListFastest = functions.https.onCall((data, context) => {
   return reorgFuncs.cloudReorgListFastest(data, context, database);
});

/**
 * getOptimizedMap
 * 
 * Loads the map used by the optimizer and
 * returns that map.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns The map used by the optimizer
 */
exports.getOptimizedMap = functions.https.onCall((data, context) => {
    return reorgFuncs.getOptimizerMap(data, context, database);
});

/**
 * getMostPopularMap
 * 
 * Loads the map with the highest weight
 * and returns that value.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns The map with the highest weight
 */
exports.getMostPopularMap = functions.https.onCall((data, context) => {
    return reorgFuncs.getMostPopularMap(data, context, database);
});

/**
 * cloudModStoreWeights
 * 
 * Updates the weights of each map for the given store
 * based on how similar the map is to the given map.
 * Difference metric is based on the departments unique
 * to the current map and given map. The metric is also
 * based on the order of the common departments.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns None 
 */
exports.cloudModStoreWeights = functions.https.onCall((data, context) => {
    return reorgFuncs.cloudModStoreWeights(data, context, database);
});

/**
 * cloudDetermineClusters
 * 
 * Checks all store maps for clusters. Clusters are based in
 * the similarity of each store's map. Global constants are
 * used to determine the number of clusters to make.
 * 
 * @param {Database} database The database containing all of the information
 * @param {String} storeId The id of the store
 * @param {String} itemId The id of the item
 * 
 * @returns None 
 */
exports.cloudDetermineClusters = functions.https.onCall((data, context) => {
    return reorgFuncs.cloudDetermineClusters(data, context, database);
});