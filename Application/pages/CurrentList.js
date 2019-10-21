import React, { Component } from "react";
import { Text, Image, View, FlatList, Alert } from "react-native";
import styles from "./pageStyles/CurrentListPageStyle";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeout from "react-native-swipeout";
import DoubleClick from "react-native-double-tap";
import * as firebase from "firebase";

class CurrentList extends Component {
   constructor(props) {
      super(props);

      this.state = {
         listName: "",
         listItems: []
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
         listItems: []
      });
      var that = this;
      firebase
         .database()
         .ref("/lists/" + this.props.navigation.getParam("listID", ""))
         .on("value", function (snapshot) {
            var ssv = snapshot.val();
            if (ssv.items) {
               for (var item in ssv.items) {
                  // console.log(ssv.items[item]);
                  var currentItems = that.state.listItems;
                  currentItems.push(ssv.items[item]);
                  that.setState({ listItems: currentItems });
               }
            }

         });

   }

   FlatListItemSeparator = () => {
      return (
         <View
            style={{
               height: 1,
               width: "100%",
               backgroundColor: "#607D8B"
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
      var currentList = this.state.listItems;
      var currentItemBool = currentList[indexPosition].purchased;
      currentList[indexPosition].purchased = !currentItemBool;
      this.setState({ listItems: currentList });
   }

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
                  <Image source={require("../images/delete_list_button.png")} />
               </View>
            ),
            backgroundColor: "red",
            onPress: () => {
               Alert.alert(
                  "Delete item button was clicked for item: " +
                  this.state.listItems[this.state.activeRow].name +
                  " with ID: " +
                  this.state.listItems[this.state.activeRow].key
               );
            }
         }
      ];
      return (
         <View style={styles.ListContainer}>
            {/* Take out once stack if fixed */}
            <Text
               style={styles.backButton}
               onPress={this.GoBackToYourLists.bind(this)}
            >
               {"<<--Your Lists"}
            </Text>
            <Text style={styles.pageTitle}>
               {this.state.listName}: {this.state.listItems.length} Items
            </Text>
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
      );
   }
}

export default CurrentList;
