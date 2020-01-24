import React, { Component } from "react";
import {
   FlatList,
   KeyboardAvoidingView,
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
   Text,
} from 'react-native-ui-kitten';
import { MenuOutline, AddIcon, BellIcon } from "../assets/icons/icons.js";
import DoubleClick from "react-native-double-tap";
import lf from "./Functions/ListFunctions";
import ListItemContainer from '../components/ListItemContainer.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { organizationOptions } from "../OrgMethods";
import { styles } from './pageStyles/CurrentListPageStyle'

// The Arrays for populating that autocomplete fields
var availableStores = [];

const PAGE_TITLE = "Current List";
const NEW_STORE = "Register a store...";

const FASTEST_PATH = "FASTEST_PATH";
const BY_LOCATION = "BY_LOCATION";
const ORDER_ADDED = "ORDER_ADDED";
const ALPHABETICALLY = "ALPHABETICALLY";

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

         notificationModalVisible: false,
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
      console.log('SetNameAndCurrentItems');

      this._isMounted && this.setState({
         listName: this.props.navigation.getParam("name", "(Invalid Name)"),
         listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
      });
      if (this.props.navigation.state.params.currStoreId && this.props.navigation.state.params.sort) {
         console.log('got extra navigation params: ' + this.props.navigation.getParam("sort", ALPHABETICALLY));
         this._isMounted && this.setState({
            currStoreId: this.props.navigation.getParam("currStoreId", "(Invalid Store ID)"),
         });
         if (this.props.navigation.getParam("sort", ALPHABETICALLY) == FASTEST_PATH) {
            this.reorganizeListFastest(this);
            console.log('reorganize based on fastest path');
            this.setState({ orgMethod: organizationOptions.find(element => element.value == FASTEST_PATH) });
         }
         else if (this.props.navigation.getParam("sort", ALPHABETICALLY) == BY_LOCATION) {
            this.reorganizeListLoc(this);
            console.log('reorganize based on location');
            this.setState({ orgMethod: organizationOptions.find(element => element.value == BY_LOCATION) });
         }
         else {
            this.reorganizeListAlphabetically(this);
            console.log('reorganize alphabetically');
            this.setState({ orgMethod: organizationOptions.find(element => element.value == ALPHABETICALLY) });
         }
      }

      // Load the current contents of the list
      this.loadCurrList(this,
         this.props.navigation.getParam("listID", "(Invalid List ID)"));

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
                  title: stores[i],
                  id: ids[i]
              });
          }
          temp.push({ name: NEW_STORE, title: NEW_STORE, id: -1 });
          availableStores = temp;
      });
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
         case ORDER_ADDED:
            this.reorganizeListAdded();
            break;
         case ALPHABETICALLY:
            this.reorganizeListAlphabetically();
            break;
         case BY_LOCATION:
            this.props.navigation.navigate("SelectStorePage", {
               name: this.state.listName,
               listID: this.state.listId,
               sort: BY_LOCATION
            })
            break;
         case FASTEST_PATH:
            this.props.navigation.navigate("SelectStorePage", {
               name: this.state.listName,
               listID: this.state.listId,
               sort: FASTEST_PATH
            })
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
      console.log('reorganizeListAlphabetically');

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
      console.log('reorganizeListLoc');
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
      console.log('reorganizeListFastest');
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
   checkIfCurrStoreValid(context = this) {
      // Check if the given id matches a known id
      for (var i = 0; i < availableStores.length; i++) {
         if (availableStores[i].id === context.state.currStoreId) {
            return (true);
         }
      }

      return (false);
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
    * renderNotificationModalElement
    * 
    * Renders the notificaiton modal so that the user
    * can enter a notificaiton message.
    * 
    * @param   None
    * 
    * @returns None
    */
   renderNotificationModalElement = () => {
      return (
         <Layout
            level='3'
            style={styles.modalContainer}>
            <Text category='h6' >Enter Notification Message</Text>
            <Input
               style={styles.input}
               placeholder='Optional message...'
               onChangeText={message => this.notificationMessage(message)}
               autoFocus={this.state.notificationModalVisible ? true : false}
            />
            <Layout style={styles.buttonContainer}>
               <Button style={styles.modalButton} onPress={this.setNotificationModalVisible}>Cancel</Button>
               <Button style={styles.modalButton} onPress={() => { this.sendNotification() }}>Send</Button>
            </Layout>
         </Layout>
      );
   };

   /**
    * setNotificationModalVisible
    * 
    * Toggles the visibility of the notification modal.
    * Also clears the message in the state.
    * 
    * @returns None
    */
   setNotificationModalVisible = () => {
      const notificationModalVisible = !this.state.notificationModalVisible;
      if (notificationModalVisible) {
         this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.notificationModalVisible) {
               const notificationModalVisible = false;
               this._isMounted && this.setState({ notificationModalVisible });
            }
            this.backHandler.remove();
            return true;
         });
      }
      else {
         this.backHandler.remove();
      }
      this._isMounted && this.setState({
         notificationModalVisible,
         message: ''
      });
   };

   render() {
      const AddAction = () => (
         <TopNavigationAction
            icon={AddIcon}
            onPress={() => this.props.navigation.navigate("AddItemPage", {
               name: this.state.listName,
               listID: this.state.listId
            })} />
      );

      const NotificationAction = () => (
         <TopNavigationAction
            icon={BellIcon}
            onPress={() => this._isMounted && this.setNotificationModalVisible()}
         />
      );

      const renderRightControls = () => [
         <NotificationAction />,
         <AddAction />,
      ];

      const renderRightControl = () => [
         <AddAction />,
      ];

      const renderMenuAction = () => (
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
               <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                  <Modal style={styles.modal}
                     allowBackdrop={true}
                     backdropStyle={{ backgroundColor: 'black', opacity: 0.75 }}
                     onBackdropPress={this.setNotificationModalVisible}
                     visible={this.state.notificationModalVisible}>
                     {this.renderNotificationModalElement()}
                  </Modal>
               </KeyboardAvoidingView>
               <Layout style={styles.selectContainer}>
                  <Select style={styles.selectBox}
                     label={this.state.currStore === "" ? "Sort" : "Sort: (" + this.state.currStore + ")"}
                     data={organizationOptions}
                     placeholder='Select an organization method'
                     selectedOption={this.state.orgMethod}
                     onSelect={(selection) => this.handleReorg(selection)}
                  />
               </Layout>
               <Layout style={styles.dashboard} >
                  <Layout style={styles.dashboardOuterContainer} level='3' >
                     <Layout style={styles.dashboardInnerContainer}>
                        <Text style={styles.dashboardText}>Number of Items: {this.state.listItems.length}</Text>
                        <Text style={styles.dashboardText}>List shared with {this.state.userCount - 1} others</Text>
                        {/* -1 here to make sure we dont include the current user */}
                     </Layout>
                  </Layout>
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
         </React.Fragment >
      );
   }
}

export default CurrentList;