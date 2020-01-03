'use strict';
const dataRegFuncs = require('./src/DataRegFuncs');
const globalFuncs = require('./src/GlobalFuncs');
const listFuncs = require('./src/ListFuncs');
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

// NOTE: The following are wrappers for functions found in other
// files. They have to be here to be compiled.

/**
 * registerItemWrapper
 * 
 * Wrapper for the registerItem method. Parses
 * the data object and calls registerItem.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.registerItem = functions.https.onCall((data, context) => {
   return dataRegFuncs.registerItemWrapper(data, context, database);
});

/**
 * registerStoreWrapper
 * 
 * Wrapper for the registerStore method. Parses
 * the data object and calls registerStore.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.registerStore = functions.https.onCall((data, context) => {
   return dataRegFuncs.registerStoreWrapper(data, context, database);
});

/**
 * addItemLoc
 * 
 * Saves the given location to the database. Creates
 * the item and store for the location if they have
 * not already been created. Adds the location if
 * if has not already been created.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.addItemLoc = functions.https.onCall((data, context) => {
   return dataRegFuncs.addItemLoc(data, context, database);
});

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
exports.cloudLoadAvailableStores = functions.https.onCall((data, context) => {
   return globalFuncs.cloudLoadAvailableStores(data, context, database);
});

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
exports.cloudLoadAvailableItems = functions.https.onCall((data, context) => {
   return globalFuncs.cloudLoadAvailableItems(data, context, database);
});

/**
 * cloudAddItemToList
 * 
 * Adds the given item to the given list.
 * If the item has not previously been registered,
 * it is registered to the database.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The id of the item
 */
exports.cloudAddItemToList = functions.https.onCall((data, context) => {
   return listFuncs.cloudAddItemToList(data, context, database);
});

/**
 * cloudDeleteItemInList
 * 
 * Delete the given item from the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 * 
 * 
 */
exports.cloudDeleteItemInList = functions.https.onCall((data, context) => {
   return listFuncs.cloudDeleteItemInList(data, context, database);
});

/**
 * cloudUpdatePurchasedBoolOfAnItemInAList
 * 
 * Toggles the purchased boolean of the given item
 * in the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns The new purchased state
 */
exports.cloudUpdatePurchasedBoolOfAnItemInAList = functions.https.onCall((data, context) => {
   return listFuncs.cloudUpdatePurchasedBoolOfAnItemInAList(data, context, database);
});

/**
 * cloudGetItemsInAList
 * 
 * Returns the list of items, list of ids,
 * and the userCount of the given list.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns An object containing the list of items in the list,
 *          the ids of the items in the list, and the user cound
 *          of the list
 */
exports.cloudGetItemsInAList = functions.https.onCall((data, context) => {
   return listFuncs.cloudGetItemsInAList(data, context, database);
});

/**
 * cloudDeleteList
 * 
 * Removes the given list from the given users array
 * of lists that they have access to. If that user was
 * the only user that had access to the list, then the
 * list is also deleted from the database. If there are
 * other users with access to the list, then the user count
 * on the list is decremeneted.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.cloudDeleteList = functions.https.onCall((data, context) => {
   return listFuncs.cloudDeleteList(data, context, database);
});

/**
 * cloudCreateNewList
 * 
 * Creates a new list and adds it to the given
 * user's array of lists.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns None
 */
exports.cloudCreateNewList = functions.https.onCall((data, context) => {
   return listFuncs.cloudCreateNewList(data, context, database);
});

/**
 * cloudGetListsKeyAndName
 * 
 * Returns the keys and names of all of the
 * lists that the given user has access to.
 * 
 * @param {Object}  data    The object containing the inputted data
 * @param {Component} context   The context of the caller
 * @param {Database}    database    The database to save the data to
 * 
 * @returns An object containing the api data
 *          and names of all the lists the user has access to
 */
exports.cloudGetListsKeyAndName = functions.https.onCall((data, context) => {
   return listFuncs.cloudGetListsKeyAndName(data, context, database);
});

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