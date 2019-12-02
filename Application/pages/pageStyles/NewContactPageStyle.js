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
  modal: {
    paddingBottom: 300, // TODO: Make this dynamic...
  },
  formOuterContainer: {
    margin: 8,
    padding: 8,
    borderRadius: 10,
  },
  formInnerContainer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  inputRow: {
    paddingVertical: 4,
  },
  selectBox: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    flexDirection: 'row',
    borderRadius: 30,
    width: 250,
    margin: 4,
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
  button: {
    flex: 1,
    marginTop: 8,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
  },
  avoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});