import { Alert } from "react-native";
import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ContactFunctions {
   constructor() { }

   AddNewGroup(that, groupName, listOfGroups) {
      for (group in listOfGroups) {
         if (listOfGroups[group].label == groupName) {
            Alert.alert("That group already exists!")
         } else {
            var obj = { label: groupName, value: groupName };
            listOfGroups.push(obj);
            that.newGroupName = "";
            that.setState({
               isDialogVisible: false, group: obj, allGroups: listOfGroups
            });
         }
      }
   }

   SendContactRequest(email, that) {
      firebase.auth().fetchSignInMethodsForEmail(email)
         .then(function (signInMethods) {
            if (signInMethods.length == 0) {
               Alert.alert("The email you entered does not have an account with us!")
            } else {
               var uid = firebase.auth().currentUser.uid
               firebase
                  .database()
                  .ref("/contacts/" + uid)
                  .once("value", function (snapshot) {
                     var ssv = snapshot.val();
                     if (ssv) {
                        for (var contact in ssv) {
                           if (ssv[contact].email == email) {
                              if (ssv[contact].status == "sent") {
                                 Alert.alert("You have already sent a contact request to this person!")
                              } else if (ssv[contact].status == "contact") {
                                 Alert.alert("This person is already a contact of yours!")
                              } else if (ssv[contact].status == "pending") {
                                 Alert.alert("You have a contact request from this person pending!")
                              }
                           }
                        }
                        // Send the contact request
                        var push = firebase
                           .database()
                           .ref("/lists")
                           .push({
                              name: listName,
                              items: {},
                              user_count: 1
                           });
                     } else {
                        console.log("User has no contacts")
                     }
                  });
            }

         })
         .catch(function (error) {
            Alert.alert("You used an invalid email format!")
         });
   }

   GetContactInfo(that) {
      var uid = firebase.auth().currentUser.uid
      firebase
         .database()
         .ref("/contacts/" + uid).orderByChild("name")
         .on("value", function (snapshot) {
            var allContacts = [];
            var groups = [];
            var groupNames = [];
            var groupedList = {};
            var sections = [];
            snapshot.forEach(function (child) {
               if (child.val().status == "sent") { }
               else if (child.val().status == "pending") {
                  if (groupNames.includes("Pending")) {
                     groupedList["Pending"].push(child.val())
                  } else {
                     groups.push({ label: "Pending", value: "Pending" })
                     groupNames.push("Pending")
                     groupedList["Pending"] = [];
                     groupedList["Pending"].push(child.val())

                  }
               } else {
                  allContacts.push(child.val());

                  if (child.val().group != "") {

                     if (groupNames.includes(child.val().group)) {
                        groupedList[child.val().group].push(child.val())
                     } else {
                        groups.push({ label: child.val().group, value: child.val().group })
                        groupNames.push(child.val().group)
                        groupedList[child.val().group] = [];
                        groupedList[child.val().group].push(child.val())

                     }
                  }
               }
            });

            for (var group in groupedList) {
               var temp = [];
               for (var person in groupedList[group]) {
                  temp.push(groupedList[group][person]);
               }
               sections.push({ title: group, data: temp });
            }
            sections.push({ title: "All Contacts", data: allContacts });
            that.setState({ sections: sections, groups: groups });

         });
   }
}

const lf = new ContactFunctions();
export default lf;
