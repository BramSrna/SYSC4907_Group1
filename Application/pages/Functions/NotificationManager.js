/**
 * This class contains all the functions that the UI uses to manipulate notifications.
 */
class NotificationManager {
   constructor() {
      this.that = null;
   }

   setThat(that) {
      this.that = that;
   }

   _handleNotification = (notification) => {
      if (notification.origin == "selected") {
         if (notification.data.page == "CurrentListPage" && notification.data.name && notification.data.listID) {
            this.that.props.navigation.navigate(notification.data.page, {
               name: notification.data.name,
               listID: notification.data.listID
            })

         } else if (notification.data.page == "RecipeDetailsPage" && notification.data.name && notification.data.url && notification.data.ingredients) {
            this.that.props.navigation.navigate("RecipeDetailsPage", {
               url: notification.data.url,
               ingredients: notification.data.ingredients,
               name: data.notification.name
            })
         } else {
            this.that.props.navigation.navigate(notification.data.page)
         }
      } else if (notification.origin == "received") {
         if (notification.data.page == "CurrentListPage" && notification.data.name && notification.data.listID) {
            this.that.popup.show({
               onPress: () => {
                  this.that.props.navigation.navigate(notification.data.page, {
                     name: notification.data.name,
                     listID: notification.data.listID
                  })
               },
               appIconSource: require('../../assets/icon.png'),
               appTitle: 'Grocery List Application',
               timeText: 'Now',
               title: notification.data.title,
               body: notification.data.message,
               slideOutTime: 5000
            });
         } else if (notification.data.page == "RecipeDetailsPage" && notification.data.name && notification.data.url && notification.data.ingredients) {
            this.that.popup.show({
               onPress: () => {
                  this.that.props.navigation.navigate("RecipeDetailsPage", {
                     url: notification.data.url,
                     ingredients: notification.data.ingredients,
                     name: data.notification.name
                  })
               },
               appIconSource: require('../../assets/icon.png'),
               appTitle: 'Grocery List Application',
               timeText: 'Now',
               title: notification.data.title,
               body: notification.data.message,
               slideOutTime: 5000
            });
         } else {
            this.that.popup.show({
               onPress: () => {
                  this.that.props.navigation.navigate(notification.data.page)
               },
               appIconSource: require('../../assets/icon.png'),
               appTitle: 'Grocery List Application',
               timeText: 'Now',
               title: notification.data.title,
               body: notification.data.message,
               slideOutTime: 5000
            });
         }
      } else {
         console.log("notification origin not recognized")
      }
   };

}

const nm = new NotificationManager();
export default nm;