import React, { Component } from "react";
import { FlatList, StyleSheet, KeyboardAvoidingView, BackHandler } from "react-native";
         Image,
         FlatList,
import { MenuOutline, AddIcon, BellIcon } from "../assets/icons/icons.js";
         KeyboardAvoidingView,
         TouchableOpacity } from "react-native";
import { Modal as RNModal} from "react-native";
import { Layout,
         Button,
         Input,
         Modal,
         TopNavigation,
         TopNavigationAction,
         Select,
         Text } from 'react-native-ui-kitten';
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

class CurrentList extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listName: "",
         listId: "",
         listItems: [],
         listItemIds: [],

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
      this.focusListener.remove();
   }

   /**
    * GoBackToYourLists
    * 
    * Returns to the user's lists page.
    * 
    * @param   None
    * 
    * @returns None
    */
   /**
    * componentDidMount
    * 
    * Function called after component mounts.
    * Adds a focus listener to the component.
    * Populates the arrays for the autocomplete fields.
    * 
    * @param   None
    * 
    * @returns None
    */
   componentDidMount() {
      // Set "that" for the notification manager
      nm.setThat(this)

      // Need this because componentDidMount only gets called once,
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
      this.setState({
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
      var retItems = ref.on('value', function(snapshot) {
         var items = [];
         var ids = [];
 
         var ssv = snapshot.val();
         var userCount = 0;
 
         // Parse the item objects and their
         // corresponding ids
         if (ssv && ssv.items) {
             var listItems = ssv.items;
             for (var itemId in listItems) {
                 items.push(listItems[itemId]);
                 ids.push(itemId);
            }
         }
 
         // Get the user count of the list
         if (ssv.user_count) {
            userCount = ssv.user_count;
         }

         // Update the state of the context
         that.updateListState(items, ids, userCount = userCount);
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

      // Set the new state values
      this.setState({
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
      if ((item.spec !== undefined) &&
          (item.specName !== null) &&
          (item.specName !== "null")) {
         retStr += " (" + item.specName + ")";
      }

      return(retStr);
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
         return <ListItemContainer title={item.name} fromItemView={true} purchased={true} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
            <ListItemContainer
               title={this.getDispName(item)}
               fromItemView={true}
               purchased={true}
               description={'Shared With: XXXXXXXXX\nLast-Modified: Wed, 21 Oct 2015 07:28:00 ET'}
               listID={this.state.listId}
               itemID={this.state.listItemIds[index]}
               onDelete={this.deleteItem}
            />
         );
      } else {
         return <ListItemContainer title={item.name} fromItemView={true} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
            <ListItemContainer
               title={this.getDispName(item)}
               fromItemView={true}
               description={'Shared With: XXXXXXXXX\nLast-Modified: Wed, 21 Oct 2015 07:28:00 ET'}
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
         this.setState({
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

      // Clear the needed state variables
      this.setState({
         itemModalVisible: false,
         itemName: ''
      });
   };

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
      this.setState({
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
   handleReorg(selection){
      // Get the value for the organization method
      selectionVal = selection.value;
      
      // Call the corresponding selection function
      switch(selectionVal){
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
      this.setState({
         orgMethod : selection
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
   reorganizeListAdded() {
      // Get the reorganized list and rearrange the local list
      var tempList = lf.reorgListAdded(this.props.navigation.getParam("listID", "(Invalid List ID)"));
      tempList.then((value) => {
         // Update the list state to the new order
         this.updateListState(value.items,
                              value.ids,
                              userCount = value.userCount,
                              reorg = true);
      })
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
      for (var j = 0; j < items.length; j++){
         temp.push({"item" : items[j], "id" : ids[j]});
      }

      // Rearrage the nested list to put it in alphabetical order
      var that = this;
      temp.sort(function(a, b) {
         console.log(this);
         var itemA = that.getDispName(a.item).toUpperCase();
         var itemB = that.getDispName(b.item).toUpperCase();
         return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
      });

      // Retrieve the organized items and ids
      for (var k = 0; k < temp.length; k++){
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
   reorganizeListLoc(context=this) {
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
   reorganizeListFastest(context=this) {
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
            return(true);
         }
      }

      return(false);
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
         var temp  = [];
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
         var temp  = [];
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
    * loadStores
    * 
    * Filters the list of available stores based
    * on what the user has input so far. Returns an
    * empty list if nothing has been entered, otherwise
    * returns a list of the items that match the users input.
    * 
    * @param   None
    * 
    * @returns None
    */
   loadStores() {
      // Get the current store
      var currStore = this.state.currStore;
      var startList = [];

      // Copy the available stores to the initial list
      for (var i = 0; i < availableStores.length; i++) {
         startList.push(availableStores[i].name);
      }

      // Filter the list
      if (currStore.length <= 0) {
         // If nothing has been entered, return an empty list
         startList = [];
      } else {
         // Get the items that start with what the user has entered so far
         startList = startList.filter(name => 
            name.toLowerCase().startsWith(currStore.toLowerCase())
         );

         // If the first item in the filtered list matches the inputted value,
         // return an empty list as the value has been found
         if (startList.length > 0) {
            if (currStore.toLowerCase().trim() === startList[0].toLowerCase().trim()) {
               startList = [];
            }
         }
      }

      // Return the filtered list
      return(startList);
   }

   /**
    * loadItems
    * 
    * Filters the list of available items based
    * on what the user has input so far. Returns an
    * empty list if nothing has been entered, otherwise
    * returns a list of the items that match the users input.
    * 
    * @param   None
    * 
    * @returns None
    */
   loadItems() {
      // Get the current item
      var itemName = this.state.itemName;
      var startList = [];

      // Copy the available stores to the initial list
      for (var i = 0; i < availableItems.length; i++) {
         startList.push(availableItems[i].name);
      }

      // Filter the list
      if (itemName.length <= 0) {
         // If nothing has been entered, return an empty list
         startList = [];
      } else {
         // Get the items that start with what the user has entered so far
         startList = startList.filter(name => 
            name.toLowerCase().startsWith(itemName.toLowerCase())
         );

         // If the first item in the filtered list matches the inputted value,
         // return an empty list as the value has been found
         if (startList.length > 0) {
            if (itemName.toLowerCase().trim() === startList[0].toLowerCase().trim()) {
               startList = [];
            }
         }
      }

      // Return the filtered list
      return(startList);
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
      this.setState({
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
   updateCurrStore(newStore) {
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
      this.setState({
         currStore: newStore,
         currStoreId: id
      });
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
   updateCurrItem(newItem) {
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
         }
      }

      // Update the state
      this.setState({
         itemName: newItem,
         genName: genName,
         specName: specName,
         currItemId: id
      });
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

      // Set the state to the new value
      this.setState({
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
   // This handles Modal visibility even with Android back button press
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
      const itemList = this.loadItems();
      const currItemIn = this.state.itemName;

      return (
         <View style={enterStoreModalStyles.modalContainer}>
            <View style={enterStoreModalStyles.modalSubContainer}>                        
               <Text style={enterStoreModalStyles.modalTitle}>
                  Add New Item
               </Text>
               <View style={enterStoreModalStyles.modalAutocompleteContainer}>
                  <Autocomplete
                     data={itemList}
                     defaultValue={currItemIn}
                     hideResults={false}
                     onChangeText={text => this.updateCurrItem(text)}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, i }) => (
                        <TouchableHighlight
                           style={{zIndex: 10}}
                           onPress={() => this.updateCurrItem(item)}>
                           <Text>{item}</Text>
                        </TouchableHighlight>
                     )}
                  />
               </View>

               <TouchableHighlight
                  style={enterStoreModalStyles.modalDoneButton}
                  onPress={this.addItem}>
                  <Text style={enterStoreModalStyles.modalButtonText}>Add</Text>
               </TouchableHighlight>
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
      const storeList = this.loadStores();
      const currStoreIn = this.state.currStore;

      return (
         <View style={enterStoreModalStyles.modalContainer}>
            <View style={enterStoreModalStyles.modalSubContainer}>                        
               <Text style={enterStoreModalStyles.modalTitle}>
                  Store Name:
               </Text>
               <View style={enterStoreModalStyles.modalAutocompleteContainer}>
                  <Autocomplete
                     data={storeList}
                     defaultValue={currStoreIn}
                     hideResults={false}
                     onChangeText={text => this.updateCurrStore(text)}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({ item, i }) => (
                        <TouchableHighlight
                           style={{zIndex: 10}}
                           onPress={() => this.updateCurrStore(item)}>
                           <Text>{item}</Text>
                        </TouchableHighlight>
                     )}
                  />
               </View>

               <TouchableHighlight
                  style={enterStoreModalStyles.modalDoneButton}
                  onPress={() => {
                     this.setModalDetails(!this.state.storeModalVisible, this.state.closeFunc);
                     this.state.closeFunc(context=this);
                  }}>
                  <Text style={enterStoreModalStyles.modalButtonText}>Submit</Text>
               </TouchableHighlight>
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
               this.setState({ modalVisible });
            }
            this.backHandler.remove();
            return true;
         });
      }
      else {
         this.backHandler.remove();
      }
      this.setState({ modalMode: mode, modalVisible, itemName: '', message: '' });
   };

   render() {
      const AddAction = (props) => (
         <TopNavigationAction
            {...props}
            icon={AddIcon}
            onPress={() => {
               this.setState({
                  itemModalVisible: true,
                  itemName: ''
               })}
            }
         />
      );

      const NotificationAction = (props) => (
         <TopNavigationAction {...props} icon={BellIcon} onPress={() => { this.setModalVisible('notify') }} />
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

            <TouchableOpacity
               onPress={() => this.setModalVisible('notify')}
            >
               <Image source={require("../assets/notify.png")} />
            </TouchableOpacity>);
      return (
         <React.Fragment>
            <TopNavigation
               title={(this.state.listName != "") ? this.state.listName : PAGE_TITLE}
               alignment="center"
               leftControl={renderMenuAction()}
               rightControls={this.state.userCount > 1 ? renderRightControls(): renderRightControl()}
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
               <Select style={styles.selectBox}
                 label={this.state.currStore === "" ? "Sort" : "Sort: (" + this.state.currStore + ")"}
                 data={organizationOptions}
                 placeholder='Select an organization method'
                 selectedOption={this.state.orgMethod}
                 onSelect={(selection) => this.handleReorg(selection)}
               />
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
