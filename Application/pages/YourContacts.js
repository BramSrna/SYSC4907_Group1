import React, { Component } from "react";
import {
   Text,
   View,
   SectionList,
   StyleSheet,
   Alert,
   TouchableOpacity,
   Image
} from "react-native";
// import styles from "./pageStyles/YourContactsPageStyle";
import cf from "./Functions/ContactFunctions";
import Menu from "./Menu"

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

   Temp() {
      cf.TestNotification("Test")
   }


   render() {
      return (
         <React.Fragment>
            <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
            <Text style={styles.pageTitle}>
               All Contacts:
            </Text>
            <TouchableOpacity
               onPress={() => this.props.navigation.navigate("NewContact", { groups: this.state.groups })/*this.Temp()*/}
            >
               <Image source={require("../assets/icons/new.png")} />
            </TouchableOpacity>
            <View>
               <SectionList style={styles.test}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  sections={this.state.sections}
                  renderSectionHeader={({ section }) => (
                     <Text style={styles.SectionHeaderStyle}> {section.title} </Text>
                  )}
                  renderItem={({ item }) => {
                     if (item.status == "contact") {
                        return <React.Fragment><Text
                           style={styles.SectionListItemStyle}
                           //Item Separator View
                           onPress={this.GetSectionListItem.bind(
                              this,
                              ' Name: ' + item.name
                           )}>
                           {item.name}
                        </Text></React.Fragment>
                     } else if (item.status == "pending") {
                        return <React.Fragment><View style={{ flexDirection: 'row', backgroundColor: '#F5F5F5' }}>
                           <Text
                              style={styles.SectionListItemStyle}
                              //Item Separator View
                              onPress={this.GetSectionListItem.bind(
                                 this,
                                 ' Email: ' + item.email
                              )}>
                              {item.email}
                           </Text>
                           <TouchableOpacity style={styles.acceptDeny}
                              onPress={() => this.props.navigation.navigate("NewContact", { groups: this.state.groups, email: item.email })}
                           >
                              <Image source={require("../assets/icons/accept.png")} />
                           </TouchableOpacity>
                           <TouchableOpacity style={styles.acceptDeny}
                              onPress={() => Alert.alert("Cancel")}
                           >
                              <Image source={require("../assets/icons/cancel.png")} />
                           </TouchableOpacity></View></React.Fragment>
                     }

                  }}
                  keyExtractor={(item, index) => index}
               />
            </View>
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