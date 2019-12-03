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
import { styles } from "./pageStyles/NewContactPageStyle";
import globalStyles from "./pageStyles/GlobalStyle";
import RNPickerSelect from 'react-native-picker-select';
import Dialog from "react-native-dialog";
import cf from "./Functions/ContactFunctions";
import { Layout, Button, Text, Input, Modal, Select, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";



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
         fromPending: false
      };
   }

   componentDidMount() {
      var email = this.props.navigation.getParam("email", DEFAULT_EMAIL);
      var bool = false;
      if (email != DEFAULT_EMAIL) {
         bool = true;
      }
      var temp = [];
      temp.push({
         label: 'Select a group...',
         value: 'Select a group...',
         text: 'Select a group...'
      });
      temp.concat(this.props.navigation.getParam("groups", []))
      this.setState({ email: email, fromPending: bool, allGroups: temp });
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
      var aGroup = "";
      if (this.state.group != DEFAULT_GROUP && this.state.group.text && this.state.group.text != 'Select a group...') {
         aGroup = this.state.group.text
      }
      //Try adding the contact
      if (this.state.fromPending) {
         cf.AcceptContactRequest(this.props, this.state.email, this.state.name, aGroup, function (props) {
            props.navigation.navigate("YourContacts")
         })
         this.setState({ fromPending: false })

      } else {
         cf.SendContactRequest(this.props, this.state.email, this.state.name, aGroup, function (props) {
            props.navigation.navigate("YourContacts")
         })

      }

   };

   // renderRequiredText(bodyText, reqText = "(*)") {
   //    return (
   //       <Text style={globalStyles.whiteText}>
   //          {bodyText}
   //          <Text style={globalStyles.requiredHighlight}>
   //             {reqText}
   //          </Text>
   //       </Text>
   //    );
   // }

   renderModalElement = () => {
      return (
         <Layout
            level='3'
            style={styles.modalContainer}>
            <Text category='h6' >Add New Group</Text>
            <Input
               style={styles.input}
               placeholder='Enter a group name'
               onChangeText={(group) => this.setState({ group })}
               autoFocus={this.state.isDialogVisible ? true : false}
            />
            <Layout style={styles.buttonContainer}>
               <Button style={styles.modalButton} onPress={() => this.handleCancel()}>Cancel</Button>
               <Button style={styles.modalButton} onPress={() => { this.handleCreate() }}>Create</Button>
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
            <Modal style={styles.modal}
               allowBackdrop={true}
               backdropStyle={{ backgroundColor: 'black', opacity: 0.75 }}
               onBackdropPress={() => { this.setState({ isDialogVisible: !this.state.isDialogVisible }) }}
               visible={this.state.isDialogVisible}>
               {this.renderModalElement()}
            </Modal>
            <KeyboardAvoidingView style={[styles.avoidingView, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]} behavior="padding" enabled keyboardVerticalOffset={24}>
               <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
                  <Layout style={styles.formOuterContainer} level='3'>
                     <Layout style={styles.formInnerContainer}>
                        <Input style={styles.inputRow}
                           label='Email'
                           placeholder='Enter an email'
                           value={this.state.email}
                           onChangeText={(email) => this.setState({ email })}
                           disabled={this.state.fromPending ? true : false}
                        />
                        <Input style={styles.inputRow}
                           label='Name'
                           placeholder='Enter a name'
                           value={this.state.name}
                           onChangeText={(name) => this.setState({ name })}
                        />
                        <Select style={styles.selectBox}
                           label='Group'
                           data={this.state.allGroups}
                           placeholder='Select a group...'
                           selectedOption={this.state.group}
                           onSelect={(group) => this.handleChangeGroup(group)}
                        />
                        <Button style={styles.groupButton} onPress={() => this.setState({ isDialogVisible: true })} >New Group</Button>
                        <Button style={styles.button} onPress={() => this.handleAdd()} >Add Contact</Button>
                     </Layout>
                  </Layout>
               </ScrollView>
            </KeyboardAvoidingView>
         </React.Fragment >
      );
   }
}

export default NewContact;