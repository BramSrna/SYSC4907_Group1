import React, { Component } from "react";
import { FlatList, StyleSheet, KeyboardAvoidingView, BackHandler } from "react-native";
         Image,
         FlatList,
import { MenuOutline, AddIcon, BellIcon } from "../assets/icons/icons.js";
         StyleSheet,
         KeyboardAvoidingView,
         Dimensions,
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

var availableStores = [];

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
         isDialogVisible: false,

         orgMethod: organizationOptions[0],
         currStore: "",
         currStoreId: "",
         storeModalVisible: false,

         modalVisible: false,
         modalMode: 'item',
         message: '',
         userCount: 0
      };
   }

   componentWillUnmount() {
      this.focusListener.remove();
   }

   componentDidMount() {
      nm.setThat(this)
      // Need this because componentDidMount only gets called once, therefore add willFocus listener for when the user comes back
      this.focusListener = this.props.navigation.addListener(
         "willFocus",
         () => {
            this.SetNameAndCurrentItems();
         }
      );

      this.loadAvailableStores();
   }

   SetNameAndCurrentItems() {
      this.setState({
         listName: this.props.navigation.getParam("name", "(Invalid Name)"),
         listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
      });

      this.loadCurrList(this, this.props.navigation.getParam("listID", "(Invalid List ID)"));
   }

   loadCurrList(that, listId) {
      // The "once" method reads a value from the database, returning a promise
      // Use "then" to access the promise
      var ref = firebase.database().ref('/lists/' + listId);
      var retItems = ref.on('value', function(snapshot) {
         var items = [];
         var ids = [];
 
         var ssv = snapshot.val();
         var userCount = 0;
 
         if (ssv && ssv.items) {
             var listItems = ssv.items;
             for (var itemId in listItems) {
                 items.push(listItems[itemId]);
                 ids.push(itemId);
            }
         }
 
         if (ssv.user_count) {
            userCount = ssv.user_count;
         }

         that.updateListState(items, ids, userCount = userCount);
      });
   }

   updateListState(newItems, newIds, reorg = false, userCount = null) {
      var localIds = this.state.listItemIds;
      var localItems = this.state.listItems;

      if (reorg) {
         localIds = newIds;
         localItems = newItems;
      } else {
         var itemsAdded = newIds.filter(x => !localIds.includes(x));
         var itemsRemoved = localIds.filter(x => !newIds.includes(x));

         if (itemsAdded.length > 0) {
            for (var i = 0; i < itemsAdded.length; i++) {
               var ind = newIds.indexOf(itemsAdded[i]);

               localIds.push(newIds[ind]);
               localItems.push(newItems[ind]);
            }
         } else if (itemsRemoved.length > 0) {
            for (var i = 0; i < itemsRemoved.length; i++) {
               var ind = localIds.indexOf(itemsRemoved[i]);

               if (ind > -1) {
                  localIds.splice(ind, 1);
                  localItems.splice(ind, 1);
               }
            }
         } else {
            for (var i = 0; i < newIds.length; i++) {
               var id = newIds[i];
               var ind = localIds.indexOf(id);

               if (ind > -1) {
                  localItems[ind] = newItems[i];
               }
            }
         }
      }

      

      this.setState({
         listItems: localItems,
         listItemIds: localIds,
         userCount: userCount === null ? this.state.userCount : userCount
      });
   }

   GenerateListItem(item, index) {// Pass more paremeters here...
      if (item.purchased) {
         return <ListItemContainer title={item.name} fromItemView={true} purchased={true} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
      } else {
         return <ListItemContainer title={item.name} fromItemView={true} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
      }
   }

   handleSwipeOpen(rowId, direction) {
      if (typeof direction !== "undefined") {
         this.setState({ activeRow: rowId });
      }
   }

   HandleDoubleTapItem(indexPosition) {
      lf.UpdatePurchasedBoolOfAnItemInAList(this.state.listId, this.state.listItemIds[indexPosition])
   }

   DELETEME1 = () => {
      this.state.itemName = "";
      this.setState({ isDialogVisible: false });
   };

   DELETEME2 = () => {
      lf.AddItemToList(this.state.listId, this.state.itemName, 1, "aSize mL", "aNote");
      this.setState({
         modalVisible: false,
         itemName: ''
      });
   };

   DELETEME3 = (name) => {
      this.setState({
         itemName: name
      });
   }

   notificationMessage = (message) => {
      this.setState({ message: message })
   }

   handleReorg(selection){
      selectionVal = selection.value;
      
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

      this.setState({
         orgMethod : selection
      });

   }

   reorganizeListAdded() {
      var tempList = lf.reorgListAdded(this.props.navigation.getParam("listID", "(Invalid List ID)"));
      tempList.then((value) => {
         this.updateListState(value.items,
                              value.ids,
                              userCount = value.userCount,
                              reorg = true);
      })
   }

   reorganizeListAlphabetically() {
      var items = this.state.listItems;
      var ids = this.state.listItemIds;

      var temp = [];
      for (var j = 0; j < items.length; j++){
         temp.push({"item" : items[j], "id" : ids[j]});
      }

      temp.sort(function(a, b) {
         var itemA = a.item.name.toUpperCase();
         var itemB = b.item.name.toUpperCase();
         return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0;
      });

      for (var k = 0; k < temp.length; k++){
         items[k] = temp[k].item;
         ids[k] = temp[k].id;
      }

      this.updateListState(items, ids, reorg = true);
   }

   checkIfCurrStoreValid() {
      for (var i = 0; i < availableStores.length; i++) {
         if (availableStores[i].id === context.state.currStoreId) {
            return(true);
         }
      }

      return(false);

   }

   reorganizeListLoc(context=this) {
      if (context.checkIfCurrStoreValid()) {
         var tempList = lf.reorgListLoc(context.state.currStoreId,
                                        context.props.navigation.getParam("listID", "(Invalid List ID)"));
         tempList.then((value) => {
            context.updateListState(value.items, value.ids, reorg = true);
         });

         return;
      } else {
         Alert.alert("Sorry, we do not have information on that store!");
      }
   }

   reorganizeListFastest(context=this) {
      if (context.checkIfCurrStoreValid()) {
         var tempList = lf.reorgListFastest(context.state.currStoreId,
                                            context.props.navigation.getParam("listID", "(Invalid List ID)"));
         tempList.then((value) => {
            context.updateListState(value.items, value.ids, reorg = true);
         });

         return;
      } else {
         Alert.alert("Sorry, we do not have information on that store!");
      }
   }

   loadAvailableStores() {
      var tempList = lf.getAvailableStores();
      tempList.then((value) => {
         var stores = value.stores;
         var ids = value.ids;

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

   loadItems() {
      var currStore = this.state.currStore;
      var startList = [];

      for (var i = 0; i < availableStores.length; i++) {
         startList.push(availableStores[i].name);
      }

      if (currStore.length <= 0) {
         startList = [];
      } else {
         startList = startList.filter(name => 
            name.toLowerCase().startsWith(currStore.toLowerCase())
         );

         if (startList.length > 0) {
            if (currStore.toLowerCase().trim() === startList[0].toLowerCase().trim()) {
               startList = [];
            }
         }
      }

      return(startList);
   }

   setModalDetails(visible, closeFunc) {
      this.setState({
         storeModalVisible: visible,
         closeFunc: closeFunc
      });
   }

   updateCurrStore(newStore) {
      var id = "";
      newStore = newStore.toString();

      for (var i = 0; i < availableStores.length; i++) {
         var name = availableStores[i].name;
         if (name === newStore) {
            id = availableStores[i].id;
         }
      }

      this.setState({
         currStore: newStore,
         currStoreId: id
      });
   }

   sendNotification = () => {
      var message = this.state.message;
      if (message == '') {
         message = 'Hey, just wanted you to check out the list!'
      }
      lf.sendNotificationToSharedUsers(this.state.listId, this.state.listName, message);
      this.setState({
         modalVisible: false, message: ''
      });
   }

   deleteItem = (listID, itemID) => {
      lf.DeleteItemInList(listID, itemID);
   }

   renderModalElement = () => {
      if (this.state.modalMode == 'item') {
         return (
            <Layout
               level='3'
               style={styles.modalContainer}>
               <Text category='h6' >Add New Item</Text>
               <Input
                  style={styles.input}
                  placeholder='Item Name...'
                  onChangeText={name => this.DELETEME3(name)}
                  autoFocus={this.state.modalVisible ? true : false}
               />
               <Layout style={styles.buttonContainer}>
                  <Button style={styles.modalButton} onPress={this.setModalVisible}>Cancel</Button>
                  <Button style={styles.modalButton} onPress={this.DELETEME2}>Add</Button>
               </Layout>
            </Layout>
         );
      } else if (this.state.modalMode == 'notify') {
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
   renderEnterStoreModal() {
      const testItems = this.loadItems();
      const testStore = this.state.currStore;

      return (
         <View style={enterStoreModalStyles.modalContainer}>
            <View style={enterStoreModalStyles.modalSubContainer}>                        
               <Text style={enterStoreModalStyles.modalTitle}>
                  Store Name:
               </Text>
               <View style={enterStoreModalStyles.modalAutocompleteContainer}>
                  <Autocomplete
                     data={testItems}
                     defaultValue={testStore}
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
         <TopNavigationAction {...props} icon={AddIcon} onPress={() => { this.setModalVisible() }} />
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
         <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
      );

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
                  keyExtractor={index => index.name}
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

const enterStoreModalStyles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
   },
   modalSubContainer: {
      width: Dimensions.get("window").width * 0.75,
      height: Dimensions.get("window").height * 0.5,
      backgroundColor: "black",
      position: "absolute",
      top: Dimensions.get("window").height * 0.1,
      alignItems: "center",
      borderRadius: 20,
   },
   modalTitle: {
      position: 'absolute',
      top: Dimensions.get("window").height * 0.1,
      color: "white",
      fontSize: 20
   },
   modalAutocompleteContainer: {
      flex: 1,
      position: 'absolute',
      top: Dimensions.get("window").height * 0.2,
      width: "60%",
      zIndex: 5,
   },
   modalDoneButton: {
      position: 'absolute',
      top: Dimensions.get("window").height * 0.3,
      backgroundColor: 'black',
   },
   modalButtonText: {
      color: "white"
   },
})

const styles = StyleSheet.create({
   container: {

   },
   ListContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
   },
   notPurchasedItem: {
      padding: 10,
      fontSize: 18,
      color: "white"
   },
   purchasedItem: {
      padding: 10,
      fontSize: 18,
      color: "red",
      textDecorationLine: "line-through"
   },
   flatList: {
      paddingTop: 8,
      paddingHorizontal: 4,
   },
   backButton: {
      padding: 10,
      paddingTop: 50,
      paddingBottom: 15,
      color: "white",
      fontSize: 12
   },
   pageTitle: {
      padding: 30,
      paddingTop: 50,
      paddingBottom: 15,
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: 30
   },
   modalContainer: {
      flex: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
   },
   modal: {
      paddingBottom: 300, // TODO: Make this dynamic...
   },
   input: {
      flexDirection: 'row',
      borderRadius: 30,
      width: 250,
      margin: 4,
   },
   selectBox: {
     width: '100%',
   },
   buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 250,
      borderRadius: 30,
   },
   modalButton: {
      flex: 1,
      margin: 4,
      borderRadius: 30,
   },
});

export default CurrentList;
