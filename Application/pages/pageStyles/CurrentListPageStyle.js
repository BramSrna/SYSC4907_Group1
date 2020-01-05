import {
   StyleSheet,
   Dimensions
} from 'react-native';

export const enterStoreModalStyles = StyleSheet.create({
   result: {
      backgroundColor: '#A8A8A8'
   },
   modalContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
   },
   modalSubContainer: {
      width: Dimensions.get("window").width * 0.75,
      height: Dimensions.get("window").height * 0.5,
      backgroundColor: "black",
      position: "absolute",
      top: Dimensions.get("window").height * 0.1,
      alignItems: "center",
      borderRadius: 20,
   },
   modalTitle: {
      position: 'absolute',
      top: Dimensions.get("window").height * 0.1,
      color: "white",
      fontSize: 20
   },
   modalAutocompleteContainer: {
      flex: 1,
      position: 'absolute',
      top: Dimensions.get("window").height * 0.2,
      width: "60%",
      zIndex: 5,
   },
   modalDoneButton: {
      position: 'absolute',
      top: Dimensions.get("window").height * 0.3,
      backgroundColor: 'black',
   },
   modalButtonText: {
      color: "white"
   },
})

export const styles = StyleSheet.create({
   container: {

   },
   ListContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
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
      paddingTop: 8,
      paddingHorizontal: 4,
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
   },
   modalContainer: {
      flex: 1,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
   },
   modal: {
      paddingBottom: 300, // TODO: Make this dynamic...
   },
   input: {
      flexDirection: 'row',
      borderRadius: 30,
      width: 250,
      margin: 4,
   },
   selectBox: {
      width: '100%',
   },
   buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 250,
      borderRadius: 30,
   },
   modalButton: {
      flex: 1,
      margin: 4,
      borderRadius: 30,
   },
});