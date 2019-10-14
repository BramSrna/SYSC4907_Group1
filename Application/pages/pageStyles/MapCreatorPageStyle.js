import { StyleSheet,
    Dimensions } from 'react-native';

export default StyleSheet.create({    
    topContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
    },
    midContainer: {
        flex: 4,
        //borderWidth: 10,
        //borderColor: "gray",
    },
    botContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    textInput: {
        height: 40, 
        borderColor: "gray", 
        borderWidth: 1,
        justifyContent: "flex-end",
        color: "black",
    },
    blackHeaderText: {
        color: 'black',
        fontSize: 20,
    },
    rowSorter: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
    picker: {
      height: 40, 
      borderColor: "gray", 
      borderWidth: 1,
      justifyContent: "flex-end",
      color: "black",
    },
    buttonContainer: {
        height: 45,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 0,
        width: Dimensions.get('window').width / 2 - 10,
        borderRadius: 30,
    },
    button: {
        backgroundColor: "#00b5ec",
    },
    bufferView: {
        flex: 0.1,
    },
    listButton: {
        flex: 1,
        borderRadius: 20,
    },
    image: {
        flex: 1,
    }
});  