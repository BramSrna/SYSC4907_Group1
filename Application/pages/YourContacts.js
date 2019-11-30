import React, { Component } from "react";
import {
   View,
   SectionList,
   StyleSheet,
   Alert,
   TouchableOpacity,
   Image
} from "react-native";
// import styles from "./pageStyles/YourContactsPageStyle";
import cf from "./Functions/ContactFunctions";
import { Layout, Text, Input, Modal, Icon, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import ListItemContainer from '../components/ListItemContainer.js';

class YourContacts extends Component {
   constructor(props) {
      super(props);
      this.state = { sections: [], groups: [] };
   }

   componentDidMount() {
      cf.GetContactInfo(this);
   }

   GetSectionListItem = item => {
      //Function for click on an item
      Alert.alert(item);
   };
   FlatListItemSeparator = () => {
      return (
         //Item Separator
         <View
            style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }}
         />
      );
   };

   render() {
      const AddAction = (props) => (
         <TopNavigationAction {...props} icon={AddIcon} onPress={() => this.props.navigation.navigate("NewContact", { groups: this.state.groups })} />
      );

      const renderRightControls = () => [
         <AddAction />
      ];

      const renderMenuAction = () => (
         <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
      );
      return (
         <React.Fragment>
            <TopNavigation
               title="Your Contacts"
               alignment='center'
               leftControl={renderMenuAction()}
               rightControls={renderRightControls()}
            />
            <Layout>
               <SectionList style={styles.test}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  sections={this.state.sections}
                  renderSectionHeader={({ section }) => (
                     <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
                  )}
                  renderItem={({ item }) => {
                     if (item.status == "contact") {
                        return <ListItemContainer contact={true} title={item.name} fromItemView={true} onDelete={() => cf.DeleteContact(item.email)} />;
                     } else if (item.status == "pending") {
                        return <ListItemContainer title={item.email} fromItemView={true} contact={true} acceptFunction={() => { this.props.navigation.navigate("NewContact", { groups: this.state.groups, email: item.email }) }} rejectFunction={() => cf.RejectContactRequest(item.email)} pending={true} />;
                     }

                  }}
                  keyExtractor={(item, index) => index}
               />
            </Layout>
         </React.Fragment >
      );
   }



}
const styles = StyleSheet.create({
   SectionHeaderStyle: {
      backgroundColor: '#CDDC89',
      fontSize: 20,
      padding: 5,
      color: '#fff',
   },
   test: {
      height: '100%'
   },
   SectionListItemStyle: {
      fontSize: 15,
      padding: 15,
      color: '#000',
      backgroundColor: '#F5F5F5',
   },
   acceptDeny: {
      padding: 15,
      backgroundColor: '#F5F5F5',

   }
});
export default YourContacts;