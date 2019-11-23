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

   render() {
      return (
         <React.Fragment>
            <Menu toggleAction={() => this.props.navigation.toggleDrawer()} />
            <Text style={styles.pageTitle}>
               All Contacts:
            </Text>
            <TouchableOpacity
               onPress={() => this.props.navigation.navigate("NewContact", { groups: this.state.groups })}
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
                  renderItem={({ item }) => (
                     // Single Comes here which will be repeatative for the FlatListItems
                     <Text
                        style={styles.SectionListItemStyle}
                        //Item Separator View
                        onPress={this.GetSectionListItem.bind(
                           this,
                           ' Name: ' + item.name
                        )}>
                        {item.name}
                     </Text>
                  )}
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
});
export default YourContacts;