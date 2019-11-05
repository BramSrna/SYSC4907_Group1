import {
   StyleSheet
} from "react-native";

export default StyleSheet.create({
   ListContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "black"
   },
   notPurchasedItem: {
      padding: 10,
      fontSize: 18,
      color: "white"
   },
   purchasedItem: {
      padding: 10,
      fontSize: 18,
      color: "red",
      textDecorationLine: "line-through"
   },
   flatList: {
      paddingTop: 30
   },
   backButton: {
      padding: 10,
      paddingTop: 50,
      paddingBottom: 15,
      color: "white",
      fontSize: 12
   },
   pageTitle: {
      padding: 30,
      paddingTop: 50,
      paddingBottom: 15,
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: 30
   }
});