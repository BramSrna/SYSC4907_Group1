import React, { Component } from "react";
import { Image, View, FlatList, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Layout, Button, Input, Icon, Modal, TopNavigation, TopNavigationAction, Text } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import DoubleClick from "react-native-double-tap";
import lf from "./Functions/ListFunctions";
import ListItemContainer from '../components/ListItemContainer.js';

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
         modalVisible: false,
      };
   }

   componentWillUnmount() {
      this.focusListener.remove();
   }

   GoBackToYourLists() {
      this.props.navigation.navigate("YourListsPage");
   }

   componentDidMount() {
      // Need this because componentDidMount only gets called once, therefore add willFocus listener for when the user comes back
      this.focusListener = this.props.navigation.addListener(
         "willFocus",
         () => {
            this.SetNameAndCurrentItems();
         }
      );
   }

   SetNameAndCurrentItems() {
      this.setState({
         listName: this.props.navigation.getParam("name", "(Invalid Name)"),
         listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
      });
      lf.GetItemsInAList(this, this.props.navigation.getParam("listID", "(Invalid List ID)"));
   }

   GenerateListItem(item, index) {// Pass more paremeters here...
      if (item.purchased) {
         return <ListItemContainer title={item.name} fromItemView={true} purchased={true} description={'Shared With: XXXXXXXXX\nLast-Modified: Wed, 21 Oct 2015 07:28:00 ET'} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
      } else {
         return <ListItemContainer title={item.name} fromItemView={true} description={'Shared With: XXXXXXXXX\nLast-Modified: Wed, 21 Oct 2015 07:28:00 ET'} listID={this.state.listId} itemID={this.state.listItemIds[index]} onDelete={this.deleteItem} />;
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
      this.state.itemName = "";
      this.setState({
         modalVisible: false
      });
   };
   DELETEME3 = (name) => {
      this.setState({
         itemName: name
      });
   }

   deleteItem = (listID, itemID) => {
      lf.DeleteItemInList(listID, itemID);
   }

   renderModalElement = () => {
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
   };

   setModalVisible = () => {
      this.setState({ modalVisible: !this.state.modalVisible });
   };

   render() {
      const AddAction = (props) => (
         <TopNavigationAction {...props} icon={AddIcon} onPress={this.setModalVisible} />
      );

      const renderRightControls = () => [
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
               rightControls={renderRightControls()}
            />
            <Layout style={styles.ListContainer}>
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
         </React.Fragment>
      );
   }
}

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
