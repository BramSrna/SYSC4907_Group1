import React, { Component } from "react";
import {
   FlatList,
   StyleSheet,
   KeyboardAvoidingView,
   TouchableHighlight,
   View,
   Alert,
   BackHandler
} from "react-native";
import {
   Layout,
   Button,
   Input,
   Modal,
   TopNavigation,
   TopNavigationAction,
   Select,
   Text
} from 'react-native-ui-kitten';
import { Modal as RNModal } from "react-native";
import { MenuOutline, AddIcon, BellIcon } from "../assets/icons/icons.js";
import DoubleClick from "react-native-double-tap";
import lf from "./Functions/ListFunctions";
import ListItemContainer from '../components/ListItemContainer.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { organizationOptions } from "../OrgMethods";
import Autocomplete from 'react-native-autocomplete-input';
import { styles, enterStoreModalStyles } from './pageStyles/CurrentListPageStyle'

// The Arrays for populating that autocomplete fields
var availableStores = [];
var availableItems = [];

const PAGE_TITLE = "Current List";
const NEW_ITEM = "Register an item..."
const NEW_STORE = "Register a store..."
class CurrentList extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listName: "",
         listId: "",
         listItems: [],
         listItemIds: [],
         modalMode: 'item',

         firstLoadComplete: false,

         itemName: "",
         genName: "",
         specName: null,
         isDialogVisible: false,

         orgMethod: organizationOptions[0],
         currStore: "",
         currStoreId: "",
         storeModalVisible: false,

         currItemId: "",
         itemModalVisible: false,

         modalVisible: false,
         modalMode: 'item',
         message: '',
         userCount: 0,
         hr: false
      };
   }

   /**
    * componentWillUnmount
    * 
    * Function to call before the component is unmounted.
    * Removes the focus listener on this object.
    * 
    * @param   None
    * 
    * @returns None
    */
   componentWillUnmount() {
      firebase.database().ref('/lists/' + this.props.navigation.getParam("listID", "(Invalid List ID)")).off()
      this.focusListener.remove();
      this._isMounted = false;
   }

   /**
    * componentWillMount
    * 
    * Function called after component mounts.
    * Adds a focus listener to the component.
    * Populates the arrays for the autocomplete fields.
    * 
    * @param   None
    * 
    * @returns None
    */
   componentWillMount() {
      this._isMounted = true;

      // Set "that" for the notification manager
      nm.setThat(this)

      // Need this because componentWillMount only gets called once,
      // therefore add willFocus listener for when the user comes back
      this.focusListener = this.props.navigation.addListener(
         "willFocus",
         () => {
            this.SetNameAndCurrentItems();
         }
      );

      // Populate the Arrays for the autocomplete fields
      this.loadAvailableStores();
      this.loadAvailableItems();
   }

   /**
    * SetNameAndCurrentItems
    * 
    * Sets the name and id of this list and
    * loads the current contents of the list.
    * 
    * @param   None
    * 
    * @returns None
    */
   SetNameAndCurrentItems() {
      // Set the current name and list id
      this._isMounted && this.setState({
         listName: this.props.navigation.getParam("name", "(Invalid Name)"),
         listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
      });

      // Load the current contents of the list
      this.loadCurrList(this,
         this.props.navigation.getParam("listID", "(Invalid List ID)"));

   }

   /**
    * loadCurrList
    * 
    * Loads the current contents of the list and updates
    * the current state of the component. Loads the items
    * and their corresponding ids to save to the state.
    * 
    * @param {Component} that   The context that the function was called under
    * @param {String}    listId The id of this list
    */
   loadCurrList(that, listId) {
      // The "once" method reads a value from the database,
      // returning a promise. Use "then" to access the promise
      var ref = firebase.database().ref('/lists/' + listId);
      var retItems = ref.on('value', function (snapshot) {
         var items = [];
         var ids = [];

         var ssv = snapshot.val();
         var userCount = 0;
         var minPrice = 0;
         var maxPrice = 0;

         // Parse the item objects and their
         // corresponding ids
         if (ssv && ssv.items) {
            var listItems = ssv.items;
            for (var itemId in listItems) {
               var item = listItems[itemId];

               var priceRange = item.price;
               if (priceRange !== undefined) {
                  minPrice += priceRange.minPrice === undefined ? 0 : priceRange.minPrice;
                  maxPrice += priceRange.maxPrice === undefined ? 0 : priceRange.maxPrice;
               }

               items.push(item);
               ids.push(itemId);
            }
         }

         console.log("MIN: ", minPrice);
         console.log("MAX: ", maxPrice);

         // Get the user count of the list
         if (ssv && ('user_count' in ssv)) {
            userCount = ssv.user_count;
         }

         // Update the state of the context
         that.updateListState(items, ids, reorg = false, userCount = userCount);
      });
   }

   /**
    * updateListState
    * 
    * Updates this component's context with
    * the passed in information. Modifies the current list
    * of ids and list of items to match the new information,
    * removing and adding items as needed.
    * 
    * If reorg is set to true, the order of the lists is
    * rearranged to match the new order. If userCount is not
    * null, then userCount is set to the given value, otherwise
    * it is unchanged.
    * 
    * @param {Array}   newItems  The new array of Item objects
    * @param {Array}   newIds    The new array of ID objects
    * @param {Boolean} reorg     If true, then the local arrays are
    *                            rearranged to match the given order.
    *                            Default is false
    * @param {Integer} userCount If non-null, the userCount is set to this value
    *                            Default is null
    */
   updateListState(newItems, newIds, reorg = false, userCount = null) {
      // Get the current Arrays
      var localIds = this.state.listItemIds;
      var localItems = this.state.listItems;

      if (reorg) {
         // If reorg is true, then just rearrange the current arrays
         localIds = newIds;
         localItems = newItems;
      } else {
         // Get the list of items added and removed
         var itemsAdded = newIds.filter(x => !localIds.includes(x));
         var itemsRemoved = localIds.filter(x => !newIds.includes(x));

         if (itemsAdded.length > 0) {
            // New items were given
            // Add the missing items and their corresponding ids
            for (var i = 0; i < itemsAdded.length; i++) {
               var ind = newIds.indexOf(itemsAdded[i]);

               localIds.push(newIds[ind]);
               localItems.push(newItems[ind]);
            }
         } else if (itemsRemoved.length > 0) {
            // Items were removed
            // Remove the items and their corresponding ids
            for (var i = 0; i < itemsRemoved.length; i++) {
               var ind = localIds.indexOf(itemsRemoved[i]);

               if (ind > -1) {
                  localIds.splice(ind, 1);
                  localItems.splice(ind, 1);
               }
            }
         } else {
            // Effectively the same as reorg != false
            for (var i = 0; i < newIds.length; i++) {
               var id = newIds[i];
               var ind = localIds.indexOf(id);

               if (ind > -1) {
                  localItems[ind] = newItems[i];
               }
            }
         }
      }

      if (!this.state.firstLoadComplete) {
         var temp = this.reorganizeListAdded(localItems, localIds);

         localItems = temp.items;
         localIds = temp.ids;
      }

      // Set the new state values
      this._isMounted && this.setState({
         firstLoadComplete: true,
         listItems: localItems,
         listItemIds: localIds,
         userCount: userCount === null ? this.state.userCount : userCount
      });
   }

   /**
    * getDispName
    * 
    * Gets the name of the given object to
    * display to the user.
    * 
    * If there is no specific name, the name is the generic name
    * Otherwise, the name is the generic name with the specific name in brackets
    * 
    * @param {Object} item The object item to parse
    * 
    * @returns The name to display to the user
    */
   getDispName(item) {
      // Set the return string to just the generic name
      var retStr = item.genName;

      // If the specific name is given add it to the string
      if ((item.specName !== undefined) &&
          (item.specName !== null) &&
          (item.specName !== "null")) {
         retStr += " (" + item.specName + ")";
      }

      return (retStr);
   }

   /**
    * GenerateListItem
    * 
    * Generates the render data for the given item.
    * 
    * @param {Object}   item  The item object being displayed
    * @param {Integer}  index The index of the item in the Array
    * 
    * @returns None
    */
   GenerateListItem(item, index) {// Pass more paremeters here...
      if (item.purchased) {
         return (
            <ListItemContainer
               title={this.getDispName(item)}
               fromItemView={true}
               purchased={true}
               listID={this.state.listId}
               itemID={this.state.listItemIds[index]}
               onDelete={this.deleteItem}
            />
         );
      } else {
         return (
            <ListItemContainer
               title={this.getDispName(item)}
               fromItemView={true}
               listID={this.state.listId}
               itemID={this.state.listItemIds[index]}
               onDelete={this.deleteItem}
            />
         );
      }
   }

   /**
    * handleSwipeOpen
    * 
    * Handles an item being swipped left on to open
    * the swipe menu. Opens the menu and sets the active
    * row.
    * 
    * @param {String} rowId     The id of the row
    * @param {String} direction The direction that the user swipped
    * 
    * @returns None
    */
   handleSwipeOpen(rowId, direction) {
      // If the user swipped, set the active row
      if (typeof direction !== "undefined") {
         this._isMounted && this.setState({
            activeRow: rowId
         });
      }
   }

   /**
    * Handler for the user double-tapping on an items.
    * Toggles the purchased boolean on that item.
    * 
    * @param {Integer} indexPosition   The index of the item that the user pressed on
    * 
    * @returns None
    */
   HandleDoubleTapItem(indexPosition) {
      lf.UpdatePurchasedBoolOfAnItemInAList(this.state.listId,
         this.state.listItemIds[indexPosition])
   }

   /**
    * addItem
    * 
    * Adds the current item saved in the state
    * to the current list. Toggles the add item
    * modal visibility and clears the item name.
    * 
    * @param   None
    * 
    * @returns None
    */
   addItem = () => {
      // Add the item to the list
      lf.AddItemToList(this.state.listId,
         this.state.genName,
         1,
         "aSize mL",
         "aNote",
         specName = this.state.specName);
      this._isMounted && this.setState({
         itemModalVisible: false,
         itemName: ''
      });
   };

   cancelItemModal = () => {
      this._isMounted && this.setState({
         itemModalVisible: false,
         itemName: ''
      });
   }

   /**
    * notificationMessage
    * 
    * Sets the message to the given input.
    * 
    * @param {String}   message  The message to display to the user
    * 
    * @returns None
    */
   notificationMessage = (message) => {
      this._isMounted && this.setState({
         message: message
      });
   }

   /**
    * handleReorg
    * 
    * Handles a reorganization method being selected.
    * Sets the method to the selected option and calls
    * the corresponding function.
    * 
    * @param {Object} selection The selection method chosen
    * 
    * @returns None
    */
   handleReorg(selection) {
      // Get the value for the organization method
      selectionVal = selection.value;

      // Call the corresponding selection function
      switch (selectionVal) {
         case "ORDER_ADDED":
            this.reorganizeListAdded();
            break;
         case "ALPHABETICALLY":
            this.reorganizeListAlphabetically();
            break;
         case "BY_LOCATION":
            this.setModalDetails(true, this.reorganizeListLoc);
            break;
         case "FASTEST_PATH":
            this.setModalDetails(true, this.reorganizeListFastest);
            break;
         default:
            break;
      }

      // Set the state
      this._isMounted && this.setState({
         orgMethod: selection
      });
   }

   /**
    * reorganizeListAdded
    * 
    * Reorganizes the list to match the order that
    * the items were added to the list.
    * 
    * @param   None
    * 
    * @returns None
    */
   reorganizeListAdded(initItems = null, initIds = null) {
      var items = [];
      var ids = [];

      if (initItems === null) {
         // Get the items and ids
         items = this.state.listItems;
         ids = this.state.listItemIds;
      } else {
         // Get the items and ids
         items = initItems;
         ids = initIds;
      }

      // Put the items and their ids in a nested list
      var temp = [];
      for (var j = 0; j < items.length; j++) {
         temp.push({ "item": items[j], "id": ids[j] });
      }

      // Rearrage the nested list to put it in alphabetical order
      var that = this;
      temp.sort(function (a, b) {
         var itemA = new Date(a.item.dateAdded);
         var itemB = new Date(b.item.dateAdded);

         return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
      });

      // Retrieve the organized items and ids
      for (var k = 0; k < temp.length; k++) {
         items[k] = temp[k].item;
         ids[k] = temp[k].id;
      }

      if (initItems === null) {
         // Update the list state to the reorganized values
         this.updateListState(items, ids, reorg = true);
      }

      return {
         items: items,
         ids: ids
      }
   }

   /**
    * reorganizeListAlphabetically
    * 
    * Reorganizes the list to put the items in alphabetical
    * order based on the item's names.
    * 
    * @params  None
    * 
    * @returns None
    */
   reorganizeListAlphabetically() {
      // Get the items and ids
      var items = this.state.listItems;
      var ids = this.state.listItemIds;

      // Put the items and their ids in a nested list
      var temp = [];
      for (var j = 0; j < items.length; j++) {
         temp.push({ "item": items[j], "id": ids[j] });
      }

      // Rearrage the nested list to put it in alphabetical order
      var that = this;
      temp.sort(function (a, b) {
         var itemA = that.getDispName(a.item).toUpperCase();
         var itemB = that.getDispName(b.item).toUpperCase();
         return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
      });

      // Retrieve the organized items and ids
      for (var k = 0; k < temp.length; k++) {
         items[k] = temp[k].item;
         ids[k] = temp[k].id;
      }

      // Update the list state to the reorganized values
      this.updateListState(items, ids, reorg = true);
   }

   /**
    * reorganizeListLoc
    * 
    * Reorganize the list to group the items based on
    * their locations. Sorts the groups based on their departments
    * in alphabetical order. Only works if the current store is valid.
    * 
    * @param {Component} context The context that the method was called in
    * 
    * @returns None
    */
   reorganizeListLoc(context = this) {
      // Check the current store in the state
      if (context.checkIfCurrStoreValid()) {
         // Reorganize the list
         var tempList = lf.reorgListLoc(context.state.currStoreId,
            context.props.navigation.getParam("listID", "(Invalid List ID)"));
         tempList.then((value) => {
            // Update the local state of the list
            context.updateListState(value.items, value.ids, reorg = true);
         });

         return;
      } else {
         // If the current store is invalid, print an alert to the user
         Alert.alert("Sorry, we do not have information on that store!");
      }
   }

   /**
    * reorganizeListFastest
    * 
    * Reorganize the list to group the items based on
    * their locations. Sorts the groups to put them in the fastest
    * order based on the known map of the store.
    * 
    * @param {Component} context The context that called this method
    * 
    * @returns None
    */
   reorganizeListFastest(context = this) {
      // Check the current store in the state
      if (context.checkIfCurrStoreValid()) {
         // Reorganize the list
         var tempList = lf.reorgListFastest(context.state.currStoreId,
            context.props.navigation.getParam("listID", "(Invalid List ID)"));
         tempList.then((value) => {
            // Update the local state of the list
            context.updateListState(value.items, value.ids, reorg = true);
         });

         return;
      } else {
         // If the current store is invalid, print an alert to the user
         Alert.alert("Sorry, we do not have information on that store!");
      }
   }

   /**
    * checkIfCurrStoreValid
    * 
    * Checks if the current store in the state is known
    * in the database. Returns true if valid, and false otherwise.
    * 
    * @param   None
    * 
    * @returns None
    */
   checkIfCurrStoreValid() {
      // Check if the given id matches a known id
      for (var i = 0; i < availableStores.length; i++) {
         if (availableStores[i].id === context.state.currStoreId) {
            return (true);
         }
      }

      return (false);
   }

   /**
    * loadAvailableStores
    * 
    * Loads the known store names and their
    * corresponding ids from the database.
    * 
    * @param   None
    * 
    * @returns None
    */
   loadAvailableStores() {
      // Load the available stores and parses the data
      var tempList = lf.getAvailableStores();
      tempList.then((value) => {
         // Get the stores and ids
         var stores = value.stores;
         var ids = value.ids;

         // Save the names and ids to the state
         var temp = [];
         for (var i = 0; i < ids.length; i++) {
            temp.push({
               name: stores[i],
               id: ids[i]
            });
         }

         availableStores = temp;
      });
   }

   /**
    * loadAvailableItems
    * 
    * Loads the known item names and their
    * corresponding ids from the database.
    * 
    * @param   None
    * 
    * @returns None
    */
   loadAvailableItems() {
      // Load the available items and parses the data
      var tempList = lf.getAvailableItems();
      tempList.then((value) => {
         // Get the items, their ids, and data
         var items = value.items;
         var ids = value.ids;
         var genNames = value.genNames;
         var specNames = value.specNames;

         // Save the item information
         var temp = [];
         for (var i = 0; i < ids.length; i++) {
            temp.push({
               name: items[i],
               id: ids[i],
               genName: genNames[i],
               specName: specNames[i]
            });
         }

         availableItems = temp;
      });
   }

   /**
    * setModalDetails
    * 
    * Sets the store input modal details to the given information
    * 
    * @param {Boolean} visible Whether or not the modal is visible
    * @param {Function} closeFunc The function to call when the modal is closed
    * 
    * @returns None
    */
   setModalDetails(visible, closeFunc) {
      this._isMounted && this.setState({
         storeModalVisible: visible,
         closeFunc: closeFunc
      });
   }

   /**
    * updateCurrStore
    * 
    * Updates the current store name and id in
    * the state based on the given information.
    * 
    * @param {String} newStore The name of the store given by the user
    * 
    * @returns None
    */
   updateCurrStore(newStore, hideResults) {
      if (newStore.toString() == NEW_STORE) {
         this.setModalDetails(false, this.state.closeFunc)
         this.props.navigation.navigate("MapCreatorPage", {
            page: "CurrentListPage",
            listName: this.props.navigation.getParam("name", "(Invalid Name)"),
            listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
         })
      } else {
         var id = ""; // Empty id to handle unknown stores

         newStore = newStore.toString();

         // Find the name of the store in the list of available stores
         for (var i = 0; i < availableStores.length; i++) {
            var name = availableStores[i].name;
            if (name === newStore) {
               // Set the id of the store if known
               id = availableStores[i].id;
            }
         }

         // Update the state
         this._isMounted && this.setState({
            currStore: newStore,
            currStoreId: id,
            hr: hideResults
         });
      }
   }

   /**
    * updateCurrItem
    * 
    * Updates the current item name and id in
    * the state based on the given information.
    * 
    * @param {String} newStore The name of the store given by the user
    * 
    * @returns None
    */
   updateCurrItem(newItem, hideResults) {
      if (newItem.toString() == NEW_ITEM) {
         this.cancelItemModal()
         this.props.navigation.navigate("RegisterItemPage", {
            page: "CurrentListPage",
            listName: this.props.navigation.getParam("name", "(Invalid Name)"),
            listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
         })
      } else {
         var id = ""; // Assume an empty id
         var genName = newItem; // Assume the given name is the generic name
         var specName = null; // Assume no specific name has been given

         newItem = newItem.toString();

         // Check if the item is a known item
         for (var i = 0; i < availableItems.length; i++) {
            var name = availableItems[i].name;
            if (name === newItem) {
               // Set the data for the item if known
               id = availableItems[i].id;
               genName = availableItems[i].genName;
               specName = availableItems[i].specName;
               break;
            }
         }

         // Update the state
         this._isMounted && this.setState({
            itemName: newItem,
            genName: genName,
            specName: specName,
            currItemId: id,
            hr: hideResults
         });
      }
   }

   /**
    * sendNotification
    * 
    * Sends the current notification to all users that the
    * list has been shared with
    * 
    * @param   None
    * 
    * @returns None
    */
   sendNotification = () => {
      // Get the current message
      var message = this.state.message;

      // If no message has been entered, use a default message
      if (message == '') {
         message = 'Hey, just wanted you to check out the list!';
      }

      // Send the notification to all shared users
      lf.sendNotificationToSharedUsers(this.state.listId,
         this.state.listName,
         message);
      this._isMounted && this.setState({
         modalVisible: false,
         message: ''
      });
   }

   /**
    * deleteItem
    * 
    * Handles the delete option being selected
    * on an item. Deletes the item from the list.
    * 
    * @param {String} listID  The ID of the list to remove the item from
    * @param {String} itemID  The ID of the item to remove from the list
    */
   deleteItem = (listID, itemID) => {
      lf.DeleteItemInList(listID, itemID);
   }

   /**
    * renderModalElement
    * 
    * Renders the notificaiton modal so that the user
    * can enter a notificaiton message.
    * 
    * @param   None
    * 
    * @returns None
    */
   renderModalElement = () => {
      if (this.state.modalMode == 'notify') {
         return (
            <Layout
               level='3'
               style={styles.modalContainer}>
               <Text category='h6' >Enter Notification Message</Text>
               <Input
                  style={styles.input}
                  placeholder='Optional message...'
                  onChangeText={message => this.notificationMessage(message)}
                  autoFocus={this.state.modalVisible ? true : false}
               />
               <Layout style={styles.buttonContainer}>
                  <Button style={styles.modalButton} onPress={this.setModalVisible}>Cancel</Button>
                  <Button style={styles.modalButton} onPress={() => { this.sendNotification() }}>Send</Button>
               </Layout>
            </Layout>
         );
      }
   };


   find(query, type) {
      if (query === '') {
         return [];
      }

      var list = null;
      var items = [];
      if (type == 'items') {
         list = availableItems;
      } else if (type == 'stores') {
         list = availableStores;
      }

      for (var a = 0; a < list.length; a++) {
         items.push(list[a].name);
      }

      query = query.trim().toLowerCase();
      //const regex = new RegExp(`${query.trim()}`, 'i');
      //var items = items.filter(item => item.search(regex) >= 0);
      var items = items.filter(item => item.trim().toLowerCase().indexOf(query) != -1);
      if (type == 'items') {
         items.push(NEW_ITEM);
      } else if (type == 'stores') {
         items.push(NEW_STORE);
      }

      return items;
   }

   /**
    * renderEnterItemModal
    * 
    * Renders the enter item modal so that the user
    * can enter an item to add to the list.
    * 
    * NOTE: This uses the default React Native modal
    * because absolute positioning is needed for the
    * autocomplete box.
    * 
    * @param   None
    * 
    * @returns None
    */
   renderEnterItemModal() {
      // Load the items and current item for the Autocomplete box

      const currItemIn = this.state.itemName;
      const itemList = this.find(currItemIn, 'items');
      const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
      return (
         <View style={enterStoreModalStyles.modalContainer}>
            <View style={enterStoreModalStyles.modalSubContainer}>
               <Text style={enterStoreModalStyles.modalTitle}>
                  Add New Item
               </Text>
               <View style={enterStoreModalStyles.modalAutocompleteContainer}>
                  <Autocomplete
                     placeholder="Enter an item"
                     listStyle={enterStoreModalStyles.result}
                     data={itemList.length === 1 && comp(currItemIn, itemList[0]) ? [] : itemList}
                     defaultValue={currItemIn}
                     hideResults={this.state.hr}
                     onChangeText={text => this.updateCurrItem(text, false)}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, i }) => (
                        <TouchableHighlight
                           style={{ zIndex: 10 }}
                           onPress={() => this.updateCurrItem(item, true)}>
                           <Text>{item}</Text>
                        </TouchableHighlight>
                     )}
                  />
               </View>
               <Layout style={enterStoreModalStyles.modalDoneButton}>
                  <Button style={styles.modalButton} onPress={this.cancelItemModal}>Cancel</Button>
                  <Button style={styles.modalButton} onPress={this.addItem}>Add</Button>
               </Layout>
            </View>
         </View>
      );
   }

   /**
    * renderEnterStoreModal
    * 
    * Renders the enter store modal so that the user
    * can enter the store name for sorting the list
    * 
    * NOTE: This uses the default React Native modal
    * because absolute positioning is needed for the
    * autocomplete box.
    * 
    * @param   None
    * 
    * @returns None
    */
   renderEnterStoreModal() {
      // Load the stores and current store for the Autocomplete box
      const currStoreIn = this.state.currStore;
      const itemList = this.find(currStoreIn, 'stores');
      const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
      return (
         <View style={enterStoreModalStyles.modalContainer}>
            <View style={enterStoreModalStyles.modalSubContainer}>
               <Text style={enterStoreModalStyles.modalTitle}>
                  Store Name:
               </Text>
               <View style={enterStoreModalStyles.modalAutocompleteContainer}>
                  <Autocomplete
                     placeholder="Enter a store name"
                     listStyle={enterStoreModalStyles.result}
                     data={itemList.length === 1 && comp(currStoreIn, itemList[0]) ? [] : itemList}
                     defaultValue={currStoreIn}
                     hideResults={this.state.hr}
                     onChangeText={text => this.updateCurrStore(text, false)}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, i }) => (
                        <TouchableHighlight
                           style={{ zIndex: 10 }}
                           onPress={() => this.updateCurrStore(item, true)}>
                           <Text>{item}</Text>
                        </TouchableHighlight>
                     )}
                  />
               </View>

               <Layout style={enterStoreModalStyles.modalDoneButton}>
                  <Button style={styles.modalButton} onPress={() => { this.setModalDetails(false, this.state.closeFunc) }}>Cancel</Button>
                  <Button style={styles.modalButton} onPress={() => {
                     this.setModalDetails(false, this.state.closeFunc);
                     this.state.closeFunc(context = this);
                  }}>Submit</Button>
               </Layout>
            </View>
         </View>
      );
   }

   /**
    * setModalVisible
    * 
    * Toggles the visibility of the notification modal.
    * Also clears the message and itemName in the state.
    * 
    * @param {String} mode The mode for the modal
    *                      Default is "item"
    * 
    * @returns None
    */
   setModalVisible = (mode = 'item') => {
      const modalVisible = !this.state.modalVisible;
      if (modalVisible) {
         this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.modalVisible) {
               const modalVisible = false;
               this._isMounted && this.setState({ modalVisible });
            }
            this.backHandler.remove();
            return true;
         });
      }
      else {
         this.backHandler.remove();
      }
      this._isMounted && this.setState({
         modalMode: mode,
         modalVisible,
         itemName: '',
         message: ''
      });
   };

   render() {
      const AddAction = (props) => (
         <TopNavigationAction
            {...props} icon={AddIcon}
            onPress={() => {
               this._isMounted && this.setState({
                  itemModalVisible: true,
                  itemName: ""
               })
            }
            }
         />
      );

      const NotificationAction = (props) => (
         <TopNavigationAction
            {...props}
            icon={BellIcon}
            onPress={() => { this.setModalVisible('notify') }}
         />
      );

      const renderRightControls = () => [
         <NotificationAction />,
         <AddAction />,
      ];

      const renderRightControl = () => [
         <AddAction />,
      ];

      renderMenuAction = () => (
         <TopNavigationAction
            icon={MenuOutline}
            onPress={() => this.props.navigation.toggleDrawer()}
         />
      );

      return (
         <React.Fragment>
            <TopNavigation
               title={(this.state.listName != "") ? this.state.listName : PAGE_TITLE}
               alignment="center"
               leftControl={renderMenuAction()}
               rightControls={this.state.userCount > 1 ? renderRightControls() : renderRightControl()}
            />
            <Layout style={styles.ListContainer}>
               <RNModal
                  transparent={true}
                  visible={this.state.storeModalVisible}
               >
                  {this.renderEnterStoreModal()}
               </RNModal>
               <RNModal
                  transparent={true}
                  visible={this.state.itemModalVisible}
               >
                  {this.renderEnterItemModal()}
               </RNModal>
               <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                  <Modal style={styles.modal}
                     allowBackdrop={true}
                     backdropStyle={{ backgroundColor: 'black', opacity: 0.75 }}
                     onBackdropPress={this.setModalVisible}
                     visible={this.state.modalVisible}>
                     {this.renderModalElement()}
                  </Modal>
               </KeyboardAvoidingView>
               {
                  // TODO add a dashboard with quick details such as total count, shared with and price etc..
                  // this.state.listItems.length
               }
               <Layout style={styles.selectContainer}>
                  <Select style={styles.selectBox}
                     label={this.state.currStore === "" ? "Sort" : "Sort: (" + this.state.currStore + ")"}
                     data={organizationOptions}
                     placeholder='Select an organization method'
                     selectedOption={this.state.orgMethod}
                     onSelect={(selection) => this.handleReorg(selection)}
                  />
               </Layout>
               <FlatList
                  contentContainerStyle={{ paddingBottom: 16 }}// This paddingBottom is to make the last item in the flatlist to be visible.
                  style={styles.flatList}
                  data={this.state.listItems}
                  width="100%"
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                     <DoubleClick
                        doubleTap={() => { this.HandleDoubleTapItem(index) }} delay={500} >
                        {this.GenerateListItem(item, index)}
                     </DoubleClick>
                  )}
               />
            </Layout>
            <NotificationPopup ref={ref => this.popup = ref} />
         </React.Fragment>
      );
   }
}

export default CurrentList;