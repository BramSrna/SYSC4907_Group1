import React, { Component } from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import {
    Layout,
    Button,
    TopNavigation,
    TopNavigationAction,
    Autocomplete,
} from 'react-native-ui-kitten';
import { ArrowBackIcon } from '../assets/icons/icons.js';
import { dark, light } from '../assets/Themes.js';
import NotificationPopup from 'react-native-push-notification-popup';
import lf from "./Functions/ListFunctions";

const PAGE_TITLE = "Add Item";
const NEW_ITEM = "Register an item...";

var availableItems = [];

class AddItemPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listId: "",
            listName: "",
            itemName: "",
            genName: "",
            specName: null,
            currItemId: "",
            value: '',
            data: [],
        };
    }

    /**
    * componentWillMount
    * 
    * Function called after component mounts.
    * Populates the arrays for the autocomplete fields.
    * 
    * @param   None
    * 
    * @returns None
    */
    componentWillMount() {
        this._isMounted = true;

        this.setState({
            listName: this.props.navigation.getParam("name", "(Invalid Name)"),
            listId: this.props.navigation.getParam("listID", "(Invalid List ID)"),
        });

        // Populate the Arrays for the autocomplete fields
        this.loadAvailableItems();
    }

    /**
    * componentWillUnmount
    * 
    * Function to call before the component is unmounted.
    * 
    * @param   None
    * 
    * @returns None
    */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
    * loadAvailableItems
    * 
    * Loads the known item names and their
    * corresponding ids from the database.
    * 
    * @param   None
    * 
    * @returns None
    */
    loadAvailableItems() {
        // Load the available items and parses the data
        var tempList = lf.getAvailableItems();
        tempList.then((value) => {
            // Get the items, their ids, and data
            var items = value.items;
            var ids = value.ids;
            var genNames = value.genNames;
            var specNames = value.specNames;

            // Save the item information
            var temp = [];
            for (var i = 0; i < ids.length; i++) {
                temp.push({
                    name: items[i],
                    title: items[i],
                    id: ids[i],
                    genName: genNames[i],
                    specName: specNames[i]
                });
            }
            temp.push({ name: NEW_ITEM, title: NEW_ITEM, id: -1 });
            availableItems = temp;
        });
    }

    /**
    * updateCurrItem
    * 
    * Updates the current item name and id in
    * the state based on the given information.
    * 
    * @param {String} newStore The name of the store given by the user
    * 
    * @returns None
    */
    updateCurrItem(newItem) {
        if (newItem.toString() == NEW_ITEM) {
            this.props.navigation.navigate("RegisterItemPage", {
                page: "CurrentListPage",
                listName: this.props.navigation.getParam("name", "(Invalid Name)"),
                listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
            })
        } else {
            var id = ""; // Assume an empty id
            var genName = newItem; // Assume the given name is the generic name
            var specName = null; // Assume no specific name has been given

            newItem = newItem.toString();

            // Check if the item is a known item
            for (var i = 0; i < availableItems.length; i++) {
                var name = availableItems[i].name;
                if (name === newItem) {
                    // Set the data for the item if known
                    id = availableItems[i].id;
                    genName = availableItems[i].genName;
                    specName = availableItems[i].specName;
                    break;
                }
            }

            // Update the state
            this._isMounted && this.setState({
                itemName: newItem,
                genName: genName,
                specName: specName,
                currItemId: id
            });
        }
    }

    /**
    * addItem
    * 
    * Adds the current item saved in the state
    * to the current list. Toggles the add item
    * modal visibility and clears the item name.
    * 
    * @param   None
    * 
    * @returns None
    */
    addItem = () => {
        // Add the item to the list
        lf.AddItemToList(
            this.state.listId,
            this.state.genName,
            1,
            "aSize mL",
            "aNote",
            specName = this.state.specName);
        if (this._isMounted) {
            this.props.navigation.goBack();
        }
    };

    render() {
        const renderMenuAction = () => (
            <TopNavigationAction
                icon={ArrowBackIcon}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const onSelect = ({ title }) => {
            this.setState({ value: title });
            this.updateCurrItem(title);
        };

        const onChangeText = (value) => {
            this.setState({ value });
            this.setState({
                data: [{ name: value, title: value }].concat(availableItems.filter(item => item.title.toLowerCase().includes(value.toLowerCase())).concat(availableItems[availableItems.length - 1]))
            });
        };

        return (
            < React.Fragment >
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={renderMenuAction()}
                />
                <KeyboardAvoidingView style={[styles.avoidingView, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]} behavior="padding" enabled keyboardVerticalOffset={24}>
                    <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
                        <Layout style={styles.formOuterContainer} level='3'>
                            <Layout style={styles.formInnerContainer}>
                                <Autocomplete
                                    ref={(input) => { this.autoCompleteInput = input; }}
                                    style={styles.autocomplete}
                                    placeholder='Enter an item'
                                    value={this.state.value}
                                    data={this.state.data}
                                    onChangeText={onChangeText}
                                    onSelect={onSelect}
                                />
                                <Layout style={styles.mainButtonGroup} >
                                    <Button style={styles.mainPageButton} status='danger' onPress={() => this.props.navigation.goBack()}>{'Cancel'}</Button>
                                    <Button style={styles.mainPageButton} status='primary' onPress={this.addItem}>{'Add Item'}</Button>
                                </Layout>
                            </Layout>
                        </Layout>
                    </ScrollView>
                </KeyboardAvoidingView>
                <NotificationPopup ref={ref => this.popup = ref} />
            </React.Fragment >
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    avoidingView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    mainButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
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
    mainPageButton: {
        flex: 1,
        padding: 8,
        marginVertical: 8,
        marginHorizontal: 2,
    },
    autocomplete: {
        width: '100%',
        margin: 4,
        borderRadius: 20,
    },
});

export default AddItemPage;


