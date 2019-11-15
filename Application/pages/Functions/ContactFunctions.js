import * as firebase from "firebase";

/**
 * This class contains all the functions that the UI uses to manipulate the database.
 */
class ContactFunctions {
   constructor() { }

   GetContactInfo(that) {
      var uid = firebase.auth().currentUser.uid
      firebase
         .database()
         .ref("/contacts/" + uid)
         .on("value", function (snapshot) {
            var allContacts = [];
            var groups = [];
            var groupedList = {};
            var sections = [];
            var ssv = snapshot.val();
            if (ssv) {

               for (var contact in ssv) {
                  allContacts.push(ssv[contact]);
                  if (ssv[contact].group != "") {

                     if (groups.includes(ssv[contact].group)) {
                        groupedList[ssv[contact].group].push(ssv[contact])
                     } else {
                        groups.push(ssv[contact].group)
                        groupedList[ssv[contact].group] = [];
                        groupedList[ssv[contact].group].push(ssv[contact])

                     }
                  }
               }
               for (var group in groupedList) {
                  var temp = [];
                  for (var person in groupedList[group]) {
                     temp.push(groupedList[group][person]);
                  }
                  sections.push({ title: group, data: temp });
               }
               sections.push({ title: "All Contacts", data: allContacts });
               that.setState({ sections: sections });
            } else {
               console.log("No API data...");
               that.setState({ sections: [] });
            }
         });
   }
}

const lf = new ContactFunctions();
export default lf;
