import React, { Component } from "react";
import {
   View,
   SectionList,
   StyleSheet,
   Alert,
   Button
} from "react-native";
import cf from "./Functions/ContactFunctions";
import { Layout, Text, TopNavigation, TopNavigationAction, } from 'react-native-ui-kitten';
import { MenuOutline, AddIcon } from "../assets/icons/icons.js";
import ListItemContainer from '../components/ListItemContainer.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';

class YourContacts extends Component {
   constructor(props) {
      super(props);
      this.state = { listName: '', listID: '', sections: [], groups: [], share: false, selected: [], sectionsWoPending: [], groupsWoPending: [], sectionsSelected: [] };
   }

   componentDidMount() {
      nm.setThat(this)

      this.setState({
         share: this.props.navigation.getParam("share", false),
         listID: this.props.navigation.getParam("listID", ''),
         listName: this.props.navigation.getParam("listName", '')
      });
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

   ShareContactPress(email) {
      var newSelected = this.state.selected
      if (newSelected.includes(email)) {
         for (var a = 0; a < newSelected.length; a++) {
            if (newSelected[a] === email) {
               newSelected.splice(a, 1);
               a--;
            }
         }
         this.setState({ selected: newSelected });
      } else {
         newSelected.push(email)
         this.setState({ selected: newSelected });
      }
   }

   CheckIfSelected(email) {
      var selected = this.state.selected
      if (selected.includes(email)) {
         return true;
      } else {
         return false;
      }
   }

   SectionShare(section) {
      var sectionsSelected = this.state.sectionsSelected;
      var newSelected = this.state.selected;
      if (sectionsSelected.includes(section.title)) {
         for (var a = 0; a < sectionsSelected.length; a++) {
            if (sectionsSelected[a] === section.title) {
               sectionsSelected.splice(a, 1);
               a--;
            }
         }
         for (var data in section.data) {
            if (newSelected.includes(section.data[data].email)) {
               for (var a = 0; a < newSelected.length; a++) {
                  if (newSelected[a] === section.data[data].email) {
                     newSelected.splice(a, 1);
                     a--;
                  }
               }
            }
         }
      } else {
         sectionsSelected.push(section.title)
         for (var data in section.data) {
            if (!newSelected.includes(section.data[data].email)) {
               newSelected.push(section.data[data].email)
            }
         }
      }
      this.setState({ selected: newSelected, sectionsSelected: sectionsSelected });
   }

   render() {
      const AddAction = (props) => (
         <TopNavigationAction {...props} icon={AddIcon} onPress={() => this.props.navigation.navigate("NewContact", { groups: this.state.groupsWoPending })} />
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
               <SectionList style={this.state.share ? styles.share : styles.notShare}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  sections={this.state.share ? this.state.sectionsWoPending : this.state.sections}
                  renderSectionHeader={({ section }) => {
                     if (this.state.share) {
                        return <Text style={styles.SectionHeaderStyle} onPress={() => { this.SectionShare(section) }}> {section.title} </Text>
                     } else {
                        return <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
                     }
                  }}
                  renderItem={({ item }) => {
                     if (this.state.share) {
                        return <ListItemContainer share={true} contact={true} title={item.name} purchased={this.CheckIfSelected(item.email)} fromItemView={false} onPress={() => { this.ShareContactPress(item.email) }} />;
                     } else {
                        if (item.status == "contact") {
                           return <ListItemContainer contact={true} title={item.name} fromItemView={false} onDelete={() => cf.DeleteContact(item.email)} onPress={() => { this.props.navigation.navigate("NewContact", { groups: this.state.groupsWoPending, email: item.email, group: item.group, name: item.name, edit: true }) }} />;
                        } else if (item.status == "pending") {
                           return <ListItemContainer title={item.email} fromItemView={true} contact={true} acceptFunction={() => { this.props.navigation.navigate("NewContact", { groups: this.state.groupsWoPending, email: item.email }) }} rejectFunction={() => cf.RejectContactRequest(item.email)} pending={true} />;
                        }
                     }

                  }}
                  keyExtractor={(item, index) => index}
               />
            </Layout>
            {this.state.share &&
               <Layout>
                  <Button
                     title="SHARE"
                     color="#13FF00"
                     onPress={() => cf.ShareList(this.props, this.state.listName, this.state.listID, this.state.selected, function (props) {
                        props.navigation.navigate("YourListsPage")
                     })}
                  />
               </Layout>
            }
            <NotificationPopup ref={ref => this.popup = ref} />
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
   notShare: {
      height: '100%'
   },
   share: {
      height: '88%'
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