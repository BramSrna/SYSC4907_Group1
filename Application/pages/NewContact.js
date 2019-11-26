import React, { Component } from "react";
import {
   View,
   TextInput,
   TouchableHighlight,
   Alert,
   Platform,
   KeyboardAvoidingView, TouchableOpacity, Image
} from "react-native";
import { Header } from "react-navigation"
import { styles, pickerStyle } from "./pageStyles/NewContactPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";
import RNPickerSelect from 'react-native-picker-select';
import Dialog from "react-native-dialog";
import cf from "./Functions/ContactFunctions";
import { Layout, Button, Text, Input, Modal, Icon, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";



const keyboardVerticalOffset = Platform.OS === 'ios' ? (Header.HEIGHT + 64) : (Header.HEIGHT + 0)
const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? "padding" : "padding"

// These are the default values for all of the input boxes
const DEFAULT_NAME = ""
const DEFAULT_GROUP = "";
const DEFAULT_EMAIL = ""

class NewContact extends Component {
   constructor(props) {
      super(props);

      this.state = {
         name: DEFAULT_NAME,
         group: DEFAULT_GROUP,
         email: DEFAULT_EMAIL,
         isDialogVisible: false,
         allGroups: [],
         lockEmail: true,
         fromPending: false
      };
   }

   componentDidMount() {
      this.setState({ allGroups: this.props.navigation.getParam("groups", []) });
      this.setState({ email: this.props.navigation.getParam("email", DEFAULT_EMAIL) });
      var bool = true;
      if (this.props.navigation.getParam("email", DEFAULT_EMAIL) != DEFAULT_EMAIL) {
         bool = false;
      }
      this.setState({ lockEmail: bool });
      this.setState({ fromPending: !bool });
   }

   handleChangeGroup(val) {
      if (val != DEFAULT_GROUP) {
         this.setState({ group: val });
      }
   }

   handleCancel = () => {
      this.setState({ isDialogVisible: false, group: DEFAULT_GROUP });
   };

   handleCreate = () => {

      cf.AddNewGroup(this, this.state.group, this.state.allGroups)
   };



   handleAdd = () => {
      //Try adding the contact
      if (this.state.fromPending) {
         cf.AcceptContactRequest(this.state.email, this.state.name, this.state.group)

      } else {
         cf.SendContactRequest(this.state.email, this.state.name, this.state.group)

      }

   };

   renderRequiredText(bodyText, reqText = "(*)") {
      return (
         <Text style={globalStyles.whiteText}>
            {bodyText}
            <Text style={globalStyles.requiredHighlight}>
               {reqText}
            </Text>
         </Text>
      );
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
               onChangeText={group => this.setState({ group })}
               autoFocus={this.state.modalVisible ? true : false}
            />
            <Layout style={styles.buttonContainer}>
               <Button style={styles.modalButton} onPress={() => { this.handleCreate() }}>Create</Button>
               <Button style={styles.modalButton} onPress={this.setModalVisible}>Cancel</Button>
            </Layout>
         </Layout>
      );
   };

   render() {
      const renderMenuAction = () => (
         <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
      );
      return (
         <React.Fragment>
            <TopNavigation
               title="New Contact"
               alignment='center'
               leftControl={renderMenuAction()}
            />
            <Layout>
               <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
                  <Modal style={styles.modal}
                     allowBackdrop={true}
                     backdropStyle={{ backgroundColor: 'black', opacity: 0.75 }}
                     onBackdropPress={this.setModalVisible}
                     visible={this.state.modalVisible}>
                     {this.renderModalElement()}
                  </Modal>
                  {/* <View style={styles.rowSorter}>
                     <View style={{ flex: 1 }}>
                        {this.renderRequiredText("Name: ")}
                     </View>

                     <View style={{ flex: 1 }}>
                        <TextInput
                           style={styles.textInput}
                           placeholder="Name"
                           onChangeText={(name) => this.setState({ name })}
                           value={this.state.name}
                        />
                     </View>
                  </View>

                  <View style={styles.rowSorter}>
                     <View style={{ flex: 1 }}>
                        <Text style={globalStyles.whiteText}>Group: </Text>
                     </View>

                     <View style={{ flex: 1 }}>
                        <RNPickerSelect
                           value={this.state.group}
                           items={this.state.allGroups}
                           style={pickerStyle}
                           useNativeAndroidPickerStyle={false}
                           placeholder={{ label: "Select a group...", value: "" }}
                           onValueChange={(group) => this.setState({ group })} />
                     </View>

                     <TouchableOpacity
                        onPress={() => this.setState({ isDialogVisible: true })}
                     >
                        <Image source={require("../assets/icons/new.png")} />
                     </TouchableOpacity>
                  </View>

                  <View style={styles.rowSorter}>
                     <View style={{ flex: 1 }}>
                        {this.renderRequiredText("Email: ")}
                     </View>

                     <View style={{ flex: 1 }}>
                        <TextInput
                           style={styles.textInput}
                           placeholder="Email"
                           onChangeText={(email) => this.setState({ email })}
                           value={this.state.email}
                           editable={this.state.lockEmail}
                        />
                     </View>
                  </View>
               </KeyboardAvoidingView>

               <View style={styles.botContainer}>
                  <TouchableHighlight
                     style={[globalStyles.defaultButtonContainer, globalStyles.defaultButton]}
                     onPress={this.handleAdd}
                  >
                     <Text style={globalStyles.whiteText}>{"Add Contact"}</Text>
                  </TouchableHighlight>
               </View> */}
               </KeyboardAvoidingView>
            </Layout>
         </React.Fragment>
      );
   }
}

export default NewContact;