import {
   Alert
} from "react-native";
import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ContactFunctions {
   constructor() { }

   sendNotification = (token, title, body, data) => {
      let response = fetch('https://exp.host/--/api/v2/push/send', {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data
         })
      });
   }

   ShareList(props, listID, usersToShareWith, callback) {
      // Update user count in lists and add to users shared list
      Alert.alert("List " + listID + " will be shared with: " + usersToShareWith.toString());
      // Share the list and increment the user count
      if (true) {
         callback(props)
      }
   }

   DeleteContact(email) {
      var currentUser = firebase.auth().currentUser
      firebase
         .database()
         .ref("/contacts/" + currentUser.uid)
         .once("value", function (snapshot) {
            if (snapshot.val()) {
               var ssv = snapshot.val()
               for (var contact in ssv) {
                  if (ssv[contact].email == email) {
                     firebase
                        .database()
                        .ref("/contacts/" + currentUser.uid)
                        .child(contact)
                        .remove();

                     var userInfoKey = email.replace(/\./g, ",");
                     firebase
                        .database()
                        .ref("/userInfo/" + userInfoKey)
                        .once("value", function (snapshot) {
                           if (snapshot.val()) {
                              var uid = snapshot.val().uid
                              firebase
                                 .database()
                                 .ref("/contacts/" + uid)
                                 .once("value", function (snapshot) {
                                    if (snapshot.val()) {
                                       for (var contact in snapshot.val()) {

                                          if (snapshot.val()[contact].email == currentUser.email) {

                                             firebase
                                                .database()
                                                .ref("/contacts/" + uid)
                                                .child(contact)
                                                .remove();
                                          }
                                       }
                                    }
                                 })
                           } else {
                              console.log("User not logged in properly.")
                           }
                        })
                  }
               }
            }
         })
   }

   RejectContactRequest(requestEmail) {
      var currentUser = firebase.auth().currentUser
      firebase
         .database()
         .ref("/contacts/" + currentUser.uid)
         .once("value", function (snapshot) {
            if (snapshot.val()) {
               var ssv = snapshot.val()
               for (var contact in ssv) {
                  if (ssv[contact].email == requestEmail) {
                     firebase
                        .database()
                        .ref("/contacts/" + currentUser.uid)
                        .child(contact)
                        .remove();

                     var userInfoKey = requestEmail.replace(/\./g, ",");
                     firebase
                        .database()
                        .ref("/userInfo/" + userInfoKey)
                        .once("value", function (snapshot) {
                           if (snapshot.val()) {
                              var requestuid = snapshot.val().uid
                              firebase
                                 .database()
                                 .ref("/contacts/" + requestuid)
                                 .once("value", function (snapshot) {
                                    if (snapshot.val()) {
                                       for (var contact in snapshot.val()) {

                                          if (snapshot.val()[contact].email == currentUser.email) {

                                             firebase
                                                .database()
                                                .ref("/contacts/" + requestuid)
                                                .child(contact)
                                                .remove();
                                          }
                                       }
                                    }


                                 })
                           } else {
                              console.log("User not logged in properly.")
                           }
                        })
                  }
               }
            }
         });
   }

   AcceptContactRequest(contactEmail, contactName, contactGroup) {
      var currentUser = firebase.auth().currentUser
      firebase
         .database()
         .ref("/contacts/" + currentUser.uid)
         .once("value", function (snapshot) {
            var ssv = snapshot.val();
            if (ssv) {
               for (var contact in ssv) {
                  if (ssv[contact].email == contactEmail) {
                     var update = snapshot.ref.child(contact);
                     update.ref.update({
                        "status": "contact",
                        "name": contactName,
                        "group": contactGroup
                     });

                     var userInfoKey = contactEmail.replace(/\./g, ",");
                     var token = '';
                     var name = '';
                     firebase
                        .database()
                        .ref("/userInfo/" + userInfoKey)
                        .once("value", function (snapshot) {
                           if (snapshot.val()) {
                              firebase
                                 .database()
                                 .ref("/contacts/" + snapshot.val().uid)
                                 .once("value", function (snapshot) {
                                    var ssv = snapshot.val();
                                    if (ssv) {
                                       for (var contact in ssv) {
                                          if (ssv[contact].email == currentUser.email) {
                                             var update = snapshot.ref.child(contact);
                                             update.ref.update({
                                                "status": "contact"
                                             });
                                             name = ssv[contact].name
                                             token = snapshot.val().notificationToken
                                          }
                                       }
                                    }
                                 })
                              sendNotification(token, 'Grocery Shopping List New Contact', name + ' has accepted your contact request!', { "page": "YourContacts" });

                           } else {
                              console.log("The app was not configured properly.")
                           }
                        });

                  }
               }
            }
         })
   }

   AddNewGroup(that, groupName, listOfGroups) {
      for (group in listOfGroups) {
         if (listOfGroups[group].text == groupName) {
            Alert.alert("That group already exists!")
            return;
         }
      }
      var obj = {
         label: groupName,
         value: groupName,
         text: groupName
      };
      listOfGroups.push(obj);
      that.setState({
         isDialogVisible: false,
         group: groupName,
         allGroups: listOfGroups
      });
   }

   SendContactRequest(email, name, group) {
      firebase.auth().fetchSignInMethodsForEmail(email)
         .then(function (signInMethods) {
            if (signInMethods.length == 0) {
               Alert.alert("The email you entered does not have an account with us!")
            } else {
               var uid = firebase.auth().currentUser.uid
               var currentUserEmail = firebase.auth().currentUser.email.toString()
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
                                 return
                              } else if (ssv[contact].status == "contact") {
                                 Alert.alert("This person is already a contact of yours!")
                                 return
                              } else if (ssv[contact].status == "pending") {
                                 Alert.alert("You have a contact request from this person pending!")
                                 return
                              }
                           }
                        }
                        // Place contact request in your sent
                        firebase
                           .database()
                           .ref("/contacts/" + uid)
                           .push({
                              name: name,
                              group: group,
                              email: email,
                              status: "sent"
                           });

                        // Place contact request in other persons pending
                        var userInfoKey = email.replace(/\./g, ",");
                        var token = '';
                        firebase
                           .database()
                           .ref("/userInfo/" + userInfoKey)
                           .once("value", function (snapshot) {
                              if (snapshot.val()) {
                                 firebase
                                    .database()
                                    .ref("/contacts/" + snapshot.val().uid)
                                    .push({
                                       name: "",
                                       group: "",
                                       email: currentUserEmail,
                                       status: "pending"
                                    });
                                 token = snapshot.val().notificationToken
                              } else {
                                 console.log("The app was not configured properly.")
                              }
                           });
                        sendNotification(token, 'Grocery Shopping List Contact Request', 'A user with the email ' + firebase.auth().currentUser.email.toString() + ' has sent you a contact request!', { "page": "YourContacts" });
                        Alert.alert("Your contact will appear once the other person accepts it.")

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
            var pendingList = {};
            var sections = [];
            var groupsWithoutPending = [];
            var sectionsWithoutPending = [];
            snapshot.forEach(function (child) {
               if (child.val().status == "sent") { } else if (child.val().status == "pending") {
                  if (groupNames.includes("Pending")) {
                     pendingList["Pending"].push(child.val())
                  } else {
                     groups.push({
                        label: "Pending",
                        value: "Pending",
                        text: "Pending"
                     })
                     groupNames.push("Pending")
                     pendingList["Pending"] = [];
                     pendingList["Pending"].push(child.val())

                  }
               } else {
                  allContacts.push(child.val());

                  if (child.val().group != "") {

                     if (groupNames.includes(child.val().group)) {
                        groupedList[child.val().group].push(child.val())
                     } else {
                        groups.push({
                           label: child.val().group,
                           text: child.val().group,
                           value: child.val().group
                        })
                        groupsWithoutPending.push({
                           label: child.val().group,
                           text: child.val().group,
                           value: child.val().group
                        })
                        groupNames.push(child.val().group)
                        groupedList[child.val().group] = [];
                        groupedList[child.val().group].push(child.val())

                     }
                  }
               }
            });

            for (var group in pendingList) {
               var temp = [];
               for (var person in pendingList[group]) {
                  temp.push(pendingList[group][person]);
               }
               sections.push({
                  title: group,
                  data: temp
               });
            }

            for (var group in groupedList) {
               var temp = [];
               for (var person in groupedList[group]) {
                  temp.push(groupedList[group][person]);
               }
               sections.push({
                  title: group,
                  data: temp
               });
               sectionsWithoutPending.push({
                  title: group,
                  data: temp
               });
            }
            sections.push({
               title: "All Contacts",
               data: allContacts
            });
            sectionsWithoutPending.push({
               title: "All Contacts",
               data: allContacts
            });
            that.setState({
               sections: sections,
               groups: groups,
               sectionsWoPending: sectionsWithoutPending,
               groupsWoPending: groupsWithoutPending
            });

         });
   }
}

const lf = new ContactFunctions();
export default lf;