import { StyleSheet,
    Dimensions } from 'react-native';

export const styles = StyleSheet.create({   
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
        borderLeftWidth: Dimensions.get('window').width / 20,
        borderRightWidth: Dimensions.get('window').width / 20,
        borderColor: "white",
        justifyContent: "space-between",
    }, 
    topContainer: {
        flex: 2,
    },
    headerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    rowSorter: {
        flexDirection: "row",
        flex: 1,
    },
    textContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    outerButtonContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    pickerContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "stretch",
    },
    midContainer: {
        flex: 8,
        borderWidth: 5,
        borderColor: "black",
    },
    botContainer: {
        flex: 2,
    },
    textInput: {
        height: 40, 
        borderColor: "black", 
        borderWidth: 1,
        justifyContent: "flex-end",
        color: "black",
    },
    blackHeaderText: {
        color: 'black',
        fontSize: 20,
    },
    picker: {
      height: 40, 
      borderColor: "black", 
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
        width: Dimensions.get('window').width / 3,
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

export const pickerStyle = {
    inputAndroid: {
        borderColor: "white", 
        borderWidth: 1,
        justifyContent: "flex-end",
        color: "black",
        paddingRight: 30,
    },
    inputIOS: {
        borderColor: "gray", 
        borderWidth: 1,
        justifyContent: "flex-end",
        color: "black",
        paddingRight: 30,
    },
}; 