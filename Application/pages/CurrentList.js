import React, { Component } from "react";
import { Text, Image, View, FlatList } from "react-native";
import { Layout, Button, Input, Icon, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";

import styles from "./pageStyles/CurrentListPageStyle";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeout from "react-native-swipeout";
import DoubleClick from "react-native-double-tap";
import lf from "./ListFunctions";
import Dialog from "react-native-dialog";

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
         isDialogVisible: false

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

   FlatListItemSeparator = () => {
      return (
         <View
            style={{
               height: 1,
               width: "100%",
               backgroundColor: "#00b5ec"
            }}
         />
      );
   };

   GenerateListItem(item) {
      if (item.purchased) {
         return <Text style={styles.purchasedItem}>{item.name}</Text>;
      } else {
         return <Text style={styles.notPurchasedItem}>{item.name}</Text>;
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
         isDialogVisible: false
      });
   };
   DELETEME3 = (name) => {
      this.setState({
         itemName: name
      });
   }

   renderMenuAction = () => (
      <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
   );

   render() {
      const swipeButtons = [
         {
            component: (
               <View
                  style={{
                     flex: 1,
                     alignItems: "center",
                     justifyContent: "center",
                     flexDirection: "column"
                  }}
               >
                  <Image source={require("../assets/icons/delete.png")} />
               </View>
            ),
            backgroundColor: "red",
            onPress: () => {
               lf.DeleteItemInList(this.state.listId, this.state.listItemIds[this.state.activeRow])

            }
         }
      ];
      return (
         <React.Fragment>
            <TopNavigation
               title={(this.state.listName != "") ? this.state.listName : PAGE_TITLE}
               leftControl={this.renderMenuAction()}
            />
            <View style={styles.ListContainer}>



               {/* Temporary to quickly add items */}
               <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
                  <Dialog.Title>Add Item</Dialog.Title>
                  <Dialog.Description>
                     Enter the name of the items you would like to add to the list:
               </Dialog.Description>
                  <Dialog.Input
                     onChangeText={name => this.DELETEME3(name)}
                  ></Dialog.Input>
                  <Dialog.Button label="Cancel" onPress={this.DELETEME1} />
                  <Dialog.Button label="Add" onPress={this.DELETEME2} />
               </Dialog.Container>



               <Text style={styles.pageTitle}>
                  {this.state.listName}: {this.state.listItems.length} Items
            </Text>
               <TouchableOpacity
                  onPress={() => this.setState({ isDialogVisible: true })}
               >
                  <Image source={require("../assets/icons/new.png")} />
               </TouchableOpacity>
               <FlatList
                  style={styles.flatList}
                  data={this.state.listItems}
                  width="100%"
                  extraData={this.state}
                  keyExtractor={index => index.name}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item, index }) => (
                     <Swipeout
                        right={swipeButtons}
                        backgroundColor="#000000"
                        underlayColor="white"
                        rowID={index}
                        sectionId={1}
                        autoClose={true}
                        onOpen={(secId, rowId, direction) =>
                           this.handleSwipeOpen(rowId, direction)
                        }
                        close={this.state.activeRow !== index}
                     >
                        <DoubleClick
                           doubleTap={() => {
                              this.HandleDoubleTapItem(index);
                           }}
                           delay={500}
                        >
                           <TouchableOpacity>
                              {this.GenerateListItem(item)}
                           </TouchableOpacity>
                        </DoubleClick>
                     </Swipeout>
                  )}
               />
            </View>
         </React.Fragment>
      );
   }
}

export default CurrentList;
