'use strict';
const reorgFuncs = require('./src/ReorgFuncs');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const database = admin.database();

// https://firebase.google.com/docs/functions/write-firebase-functions

//This function updates the created_count based on the number of items in a users created list
exports.updatecreatedlistcount = functions.database.ref('/users/{uid}/lists/created').onWrite((change, context) => {
    return change.after.ref.parent.child('created_count').set(change.after.numChildren());
});

//This function updates the shared_count based on the number of items in a users shared list
exports.updatesharedlistcount = functions.database.ref('/users/{uid}/lists/shared').onWrite((change, context) => {
    return change.after.ref.parent.child('shared_count').set(change.after.numChildren());
});

exports.updaterecipecount = functions.database.ref('/recipes/{name}').onWrite((change, context) => {
    return change.after.ref.parent.once('value').then((val) => {
        var count = val.numChildren();
        return change.after.ref.parent.update({
            recipe_count: count
        })
    })
});

// NOTE: The following are wrappers for functions found in other
// files. They have to be here to be compiled.

// HASEEB: Update daily recipes for day
exports.updateRandomRecipesForDay = functions.https.onCall((data, context) => {

})

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