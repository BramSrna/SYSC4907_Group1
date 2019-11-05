import {
  StyleSheet
} from 'react-native';

export const styles = StyleSheet.create({
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
  blackText: {
    color: 'black',
  },
  textInput: {
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

export const pickerStyle = {
  inputAndroid: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "white",
    paddingRight: 30,
    width: 80
  },
  inputIOS: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "flex-end",
    color: "white",
    paddingRight: 30,
    width: 80
  },
};