import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: "black",
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: "black",
  },
  midContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: "black",
  },
  botContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: "black",
  },
  whiteHeaderText: {
    color: 'white',
    fontSize: 20,
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  submitButton: {
    backgroundColor: "#00b5ec",
  },
  textInput: {
    height: 40, 
    borderColor: "gray", 
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "white",
  },
  picker: {
    height: 40, 
    borderColor: "gray", 
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "white",
  },
  rowSorter: {
    flexDirection: "row",
    padding: 20,
  }
});