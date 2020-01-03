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

exports.registerItem = functions.https.onCall((data, context) => {
   return dataRegFuncs.registerItemWrapper(data, context, database);
});

exports.registerStore = functions.https.onCall((data, context) => {
   return dataRegFuncs.registerStoreWrapper(data, context, database);
});

exports.addItemLoc = functions.https.onCall((data, context) => {
   return dataRegFuncs.addItemLoc(data, context, database);
});

exports.cloudLoadAvailableStores = functions.https.onCall((data, context) => {
   return globalFuncs.cloudLoadAvailableStores(data, context, database);
});

exports.cloudLoadAvailableItems = functions.https.onCall((data, context) => {
   return globalFuncs.cloudLoadAvailableItems(data, context, database);
});

exports.cloudAddItemToList = functions.https.onCall((data, context) => {
   return listFuncs.cloudAddItemToList(data, context, database);
});

exports.cloudDeleteItemInList = functions.https.onCall((data, context) => {
   return listFuncs.cloudDeleteItemInList(data, context, database);
});

exports.cloudUpdatePurchasedBoolOfAnItemInAList = functions.https.onCall((data, context) => {
   return listFuncs.cloudUpdatePurchasedBoolOfAnItemInAList(data, context, database);
});

exports.cloudGetItemsInAList = functions.https.onCall((data, context) => {
   return listFuncs.cloudGetItemsInAList(data, context, database);
});

exports.cloudDeleteList = functions.https.onCall((data, context) => {
   return listFuncs.cloudDeleteList(data, context, database);
});

exports.cloudCreateNewList = functions.https.onCall((data, context) => {
   return listFuncs.cloudCreateNewList(data, context, database);
});

exports.cloudGetListsKeyAndName = functions.https.onCall((data, context) => {
   return listFuncs.cloudGetListsKeyAndName(data, context, database);
});

exports.cloudReorgListLoc = functions.https.onCall((data, context) => {
   return reorgFuncs.cloudReorgListLoc(data, context, database);
});

exports.cloudReorgListFastest = functions.https.onCall((data, context) => {
   return reorgFuncs.cloudReorgListFastest(data, context, database);
});