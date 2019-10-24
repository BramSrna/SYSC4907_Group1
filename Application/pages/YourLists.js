import React, { Component } from "react";
import {
   TouchableOpacity,
   Text,
   View,
   FlatList,
   Image
} from "react-native";
import styles from "./pageStyles/YourListsPageStyle";
import Swipeout from "react-native-swipeout";
import Dialog from "react-native-dialog";
import lf from "./ListFunctions";


class YourLists extends Component {
   constructor(props) {
      super(props);
      this.newListName = "";
      this.state = {
         listTitles: [],
         apiData: [],
         isDialogVisible: false
      };
   }

   GenerateNeededData() {
      lf.GetListsKeyAndName(this);
   }

   componentDidMount() {
      this.GenerateNeededData();
   }

   GetListID(listName) {
      var data = this.state.apiData;
      for (var list in data) {
         if (data[list].name == listName) {
            return data[list].key;
         }
      }
   }

   GoToList(listName) {
      this.props.navigation.navigate("CurrentListPage", {
         name: listName,
         listID: this.GetListID(listName)
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
   handleCancel = () => {
      this.newListName = "";
      this.setState({ isDialogVisible: false });
   };

   handleCreate = () => {
      lf.CreateNewList(this.newListName);
      this.newListName = "";
      this.setState({
         isDialogVisible: false
      });
   };

   handleSwipeOpen(rowId, direction) {
      if (typeof direction !== "undefined") {
         this.setState({ activeRow: rowId });
      }
   }

   setNewListName(name) {
      this.newListName = name;
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
               lf.DeleteList(this.state.apiData[this.state.activeRow].key);
            }
         }
      ];
      return (
         <View style={styles.ListContainer}>
            <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
               <Dialog.Title>New List</Dialog.Title>
               <Dialog.Description>
                  Enter the name of the new list you would like to create:
               </Dialog.Description>
               <Dialog.Input
                  onChangeText={name => this.setNewListName(name)}
               ></Dialog.Input>
               <Dialog.Button label="Cancel" onPress={this.handleCancel} />
               <Dialog.Button label="Create" onPress={this.handleCreate} />
            </Dialog.Container>
            <Text style={styles.pageTitle}>
               Your Lists: {this.state.listTitles.length}
            </Text>
            <TouchableOpacity
               onPress={() => this.setState({ isDialogVisible: true })}
            >
               <Image source={require("../images/new_list_button.png")} />
            </TouchableOpacity>
            <FlatList
               style={styles.flatList}
               data={this.state.listTitles}
               width="100%"
               extraData={this.state.activeRow}
               keyExtractor={index => index.toString()}
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
                     <TouchableOpacity onPress={this.GoToList.bind(this, item)}>
                        <Text style={styles.item}>{item}</Text>
                     </TouchableOpacity>
                  </Swipeout>
               )}
            />
         </View>
      );
   }
}

export default YourLists;