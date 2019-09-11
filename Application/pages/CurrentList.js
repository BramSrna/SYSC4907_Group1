import React, { Component } from "react";
import { Text, View, FlatList, BackHandler } from "react-native";
import styles from "./pageStyles/CurrentListPageStyle";

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
      this.props.navigation.navigate("Your Lists");
   }

   componentDidMount() {
      // Need this because componentDidMount only gets called once, therefore add willFocus listener for when the user comes back
      this.focusListener = this.props.navigation.addListener(
         "willFocus",
         () => {
            this.SetNameAndCurrentItems();
         }
      );
      BackHandler.addEventListener("hardwareBackPress", function() {
         // Return true if you want to go back, false if want to ignore. This is for Android only.
         // return true;
         return false;
      });
   }

   SetNameAndCurrentItems() {
      this.setState({
         listName: this.props.navigation.getParam("name", ""),
         listItems: this.props.navigation.getParam("list", [])
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

   render() {
      return (
         <View style={styles.ListContainer}>
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
               extraData={this.state.arrayHolder}
               keyExtractor={index => index.name}
               ItemSeparatorComponent={this.FlatListItemSeparator}
               renderItem={({ item }) => (
                  <Text style={styles.item}>{item.name}</Text>
               )}
            />
         </View>
      );
   }
}

export default CurrentList;
