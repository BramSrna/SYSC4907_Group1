import React, { Component } from "react";
import { View, FlatList, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Layout, Button, Text, Input, Modal, Icon, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import lf from "./ListFunctions";
import ListItemContainer from '../components/ListItemContainer.js';

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

   handleCreate = () => {
      lf.CreateNewList(this.newListName);
      this.newListName = "";
      this.setState({
         modalVisible: false
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

   deleteListWithID(id){
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
               placeholder='List Name'
               value={this.state.primaryValue}
               onChangeText={name => this.setNewListName(name)}
               autoFocus={this.state.modalVisible ? true : false}
            />
            <Layout style={styles.buttonContainer}>
               <Button style={styles.modalButton} onPress={() => { this.handleCreate() }}>Create</Button>
               <Button style={styles.modalButton} onPress={this.setModalVisible}>Cancel</Button>
            </Layout>
         </Layout>
      );
   };

   setModalVisible = () => {
      this.setState({ modalVisible: !this.state.modalVisible });
   };

   render() {
      // const swipeButtons = [
      //    {
      //       component: (
      //          <Layout
      //             style={{
      //                flex: 1,
      //                alignItems: "center",
      //                justifyContent: "center",
      //                backgroundColor: "red",
      //                flexDirection: "column",
      //                backgroundColor: "red",
      //             }}
      //          >
      //             <Icon name='trash-2-outline' width={30} height={30} />
      //          </Layout>
      //       ),
      //       onPress: () => {
      //          lf.DeleteList(this.state.apiData[this.state.activeRow].key);
      //       }
      //    }
      // ];

      const AddIcon = (style) => (
         <Icon {...style} name='plus-outline' />
      );

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
               <KeyboardAvoidingView style={styles.container} contentContainerStyle={styles.container} behavior="position" enabled>
                  <Modal style={styles.modal}
                     allowBackdrop={true}
                     backdropStyle={{ backgroundColor: 'black', opacity: 0.5 }}
                     onBackdropPress={this.setModalVisible}
                     visible={this.state.modalVisible}>
                     {this.renderModalElement()}
                  </Modal>
               </KeyboardAvoidingView>

               {/* <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
                  <Dialog.Title>New List</Dialog.Title>
                  <Dialog.Description>
                     Enter the name of the new list you would like to create:
               </Dialog.Description>
                  <Dialog.Input
                     onChangeText={name => this.setNewListName(name)}
                  ></Dialog.Input>
                  <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                  <Dialog.Button label="Create" onPress={this.handleCreate} />
               </Dialog.Container> */}
               {/* <Text style={styles.pageTitle}>
                  All Lists: {this.state.listTitles.length}
               </Text>
               <TouchableOpacity
                  onPress={() => this.setState({ isDialogVisible: true })}
               >
                  <Image source={require("../assets/icons/new.png")} />
               </TouchableOpacity> */}
               <FlatList
                  contentContainerStyle={{ paddingBottom: 34 }}
                  style={styles.flatList}
                  data={this.state.listTitles}
                  width="100%"
                  extraData={this.state.activeRow}
                  keyExtractor={index => index.toString()}
                  renderItem={({ item, index }) => (
                     <ListItemContainer name={item} onPress={this.GoToList.bind(this, item)} listIndex={index} listID={this.state.apiData[index].key} onDelete={this.deleteListWithID} />
                     // <Swipeout
                     //    right={swipeButtons}
                     //    backgroundColor="#000000"
                     //    rowID={index}
                     //    sectionId={1}
                     //    autoClose={true}
                     //    onOpen={(secId, rowId, direction) =>
                     //       this.handleSwipeOpen(rowId, direction)
                     //    }
                     //    close={this.state.activeRow !== index}
                     // >
                     //    <TouchableOpacity onPress={this.GoToList.bind(this, item)}>
                     //       <Text style={styles.item}>{item}</Text>
                     //    </TouchableOpacity>
                     // </Swipeout>
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
   flatList: {
      paddingTop: 30
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