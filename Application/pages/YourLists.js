import React, { Component } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, Image, Alert } from "react-native";
import { Layout, Button, Text, Input, Modal, Icon, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import lf from "./Functions/ListFunctions";
import ListItemContainer from '../components/ListItemContainer.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as firebase from "firebase";

const PAGE_TITLE = "Your Lists";

class YourLists extends Component {
   constructor(props) {
      super(props);
      this.newListName = "";
      this.state = {
         listTitles: [],
         apiData: [],
         modalVisible: false,
      };
   }

   GenerateNeededData(that) {
      var uid = firebase.auth().currentUser.uid;

      var ref = firebase.database().ref("/users/" + uid + "/lists")
      var retVal = ref.on("value", function(snapshot) {
         var ssv = snapshot.val();
         var childVals = [];
         var listIds = [];

         if (ssv) {
            for (var created in ssv.created) {
               listIds.push(created);
            }

            for (var shared in ssv.shared) {
               listIds.push(shared);
            }          

            for (var idKey in listIds) {
               var currentListId = listIds[idKey];

               var childRef = firebase.database().ref("/lists/" + currentListId).once("value");

               childVals.push(childRef);
            }
         }

         Promise.all(childVals).then(result => {
            var listIdLength = result.length;

            var apiData = [];
            var listTitles = [];

            for (var i = 0; i < result.length; i++){
                  var ssv = result[i];

                  if (ssv) {
                     apiData.push({
                        key: ssv.key,
                        name: ssv.val().name
                     });

                     listTitles.push(ssv.val().name);

                     if ((i - 1) === listIdLength) {
                        break;
                     }
                  } else {
                     console.log("ERROR: List does not exist.");    
                     break;
                  }
            }

            that.updateListState(apiData, listTitles);
         });
      });
   }

   updateListState(newApiData, newListTitles) {
      var localApiData = this.state.apiData;
      var localListTitles = this.state.listTitles;

      function checkArrayApi(arr, api) {
         for (var i = 0; i < arr.length; i++) {
            var tempApi = arr[i];
            if ((tempApi.key === api.key) && (tempApi.name === api.name)) {
               return true;
            }
         }
         return false;
      }

      var itemsAdded = newApiData.filter(x => !checkArrayApi(localApiData, x));
      var itemsRemoved = localApiData.filter(x => !checkArrayApi(newApiData, x));

      if (itemsAdded.length > 0) {
         for (var i = 0; i < itemsAdded.length; i++) {
            var ind = newApiData.indexOf(itemsAdded[i]);

            localApiData.push(newApiData[ind]);
            localListTitles.push(newListTitles[ind]);
         }
      } else if (itemsRemoved.length > 0) {
         for (var i = 0; i < itemsRemoved.length; i++) {
            var ind = localApiData.indexOf(itemsRemoved[i]);

            if (ind > -1) {
               localApiData.splice(ind, 1);
               localListTitles.splice(ind, 1);
            }
         }
      } else {
         for (var i = 0; i < newApiData.length; i++) {
            var id = newApiData[i];
            var ind = localApiData.indexOf(id);

            if (ind > -1) {
               localListTitles[ind] = newListTitles[i];
            }
         }
      }

      this.setState({
         listTitles: localListTitles.slice(),
         apiData: localApiData.slice()
      });
   }

   componentDidMount() {
      nm.setThat(this)

      this.GenerateNeededData(this);
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

   handleCreate = () => {
      lf.CreateNewList(this.newListName);
      this.newListName = "";
      this.setState({
         modalVisible: false
      });
   };

   setNewListName(name) {
      this.newListName = name;
   }

   deleteListWithID = (id) => {
      lf.DeleteList(id);
   }

   renderModalElement = () => {
      return (
         <Layout
            level='3'
            style={styles.modalContainer}>
            <Text category='h6' >Create New List</Text>
            <Input
               style={styles.input}
               placeholder='List Name...'
               onChangeText={name => this.setNewListName(name)}
               autoFocus={this.state.modalVisible ? true : false}
            />
            <Layout style={styles.buttonContainer}>
               <Button style={styles.modalButton} onPress={this.setModalVisible}>Cancel</Button>
               <Button style={styles.modalButton} onPress={() => { this.handleCreate() }}>Create</Button>
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

      const renderMenuAction = () => (
         <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
      );

      return (
         <React.Fragment>
            <TopNavigation
               title={PAGE_TITLE}
               alignment='center'
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
               <FlatList
                  contentContainerStyle={{ paddingBottom: 16 }}// This paddingBottom is to make the last item in the flatlist to be visible.
                  style={styles.flatList}
                  data={this.state.listTitles}
                  width="100%"
                  keyExtractor={index => index.toString()}
                  renderItem={({ item, index }) => (
                     <ListItemContainer navigate={() => {
                        this.props.navigation.navigate("YourContacts", {
                           share: true,
                           listID: this.state.apiData[index].key,
                           listName: item
                        })
                     }} title={item} description={'Shared With: XXXXXXXXX\nLast-Modified: Wed, 21 Oct 2015 07:28:00 ET'} listName={item} onPress={this.GoToList.bind(this, item)} listIndex={index} listID={this.state.apiData[index].key} onDelete={this.deleteListWithID} />
                  )}
               />
            </Layout>
            <NotificationPopup ref={ref => this.popup = ref} />
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
   flatList: {
      paddingTop: 8,
      paddingHorizontal: 4,
   },
   pageTitle: {
      padding: 30,
      paddingBottom: 15,
      color: "white",
      fontSize: 30
   },
   item: {
      padding: 10,
      fontSize: 18,
      // height: 40,
      color: "white"
   },
   addButton: {
      padding: 10,
      paddingTop: 50,
      paddingBottom: 15,
      color: "white"
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

export default YourLists;