import React, { Component } from "react";
import {
   Text,
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
import Menu from "./Menu"
import Dialog from "react-native-dialog";
import cf from "./Functions/ContactFunctions";


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
         allGroups: []
      };
   }

   componentDidMount() {
      this.setState({ allGroups: this.props.navigation.getParam("groups", []) });
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
      cf.SendContactRequest(this.state.email, this)

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

   render() {
      return (
         <React.Fragment>
            <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
            <View style={styles.container}>


               <KeyboardAvoidingView
                  style={styles.midContainer}
                  keyboardVerticalOffset={keyboardVerticalOffset}
                  behavior={keyboardAvoidingViewBehavior}>
                  <Dialog.Container visible={this.state.isDialogVisible} style={{}}>
                     <Dialog.Title>New List</Dialog.Title>
                     <Dialog.Description>
                        Enter the name of the new group you would like to create:
               </Dialog.Description>
                     <Dialog.Input
                        onChangeText={group => this.setState({ group })}
                     ></Dialog.Input>
                     <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                     <Dialog.Button label="Create" onPress={this.handleCreate} />
                  </Dialog.Container>
                  <View style={styles.topContainer}>
                     <Text style={styles.whiteHeaderText}>New Contact</Text>
                  </View>
                  <View style={styles.rowSorter}>
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
               </View>
            </View>
         </React.Fragment>
      );
   }
}

export default NewContact;