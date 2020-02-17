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
import { ArrowBackIcon, MapIcon } from '../assets/icons/icons.js';
import { dark, light } from '../assets/Themes.js';
import NotificationPopup from 'react-native-push-notification-popup';
import lf from "./Functions/ListFunctions";

const PAGE_TITLE = "Select Store";
const NEW_STORE = "Register a store...";
const MAPS = "MapsPage";


var availableStores = [];

class SelectStorePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listId: "",
            listName: "",

            sort: "",

            currStoreTitle: "",
            currStoreAddr: "",
            currStoreId: "",
            currStoreName: "",

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
            sort: this.props.navigation.getParam("sort", "(Invalid Sort Method)"),
        });
        // Populate the Arrays for the autocomplete fields
        this.loadAvailableStores();
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
    * loadAvailableStores
    * 
    * Loads the known store names and their
    * corresponding ids from the database.
    * 
    * @param   None
    * 
    * @returns None
    */
    loadAvailableStores() {
        // Load the available stores and parses the data
        var tempList = lf.getAvailableStores().then((value) => {
            availableStores = value;
        });
    }

    /**
    * updateCurrStore
    * 
    * Updates the current store name and id in
    * the state based on the given information.
    * 
    * @param {String} newStore The name of the store given by the user
    * 
    * @returns None
    */
    updateCurrStore(newStore) {
        if (newStore.toString() == NEW_STORE) {
            this.props.navigation.navigate("MapCreatorPage", {
                previousPage: "CurrentListPage",
                listName: this.props.navigation.getParam("name", "(Invalid Name)"),
                listId: this.props.navigation.getParam("listID", "(Invalid List ID)")
            })
        } else {
            var id = ""; // Empty id to handle unknown stores
            var addr = "";
            var storeName = "";

            newStore = newStore.toString();

            // Find the name of the store in the list of available stores
            for (var i = 0; i < availableStores.length; i++) {
                var title = availableStores[i].title;
                if (title === newStore) {
                    // Set the id of the store if known
                    id = availableStores[i].id;
                    addr = availableStores[i].addr;
                    storeName = availableStores[i].storeName;
                }
            }

            // Update the state
            this._isMounted && this.setState({
                currStoreTitle: newStore,
                currStoreId: id,
                currStoreAddr: addr,
                currStoreName: storeName
            });
        }
    }


    /**
    * submitStore
    * 
    * Submits the current selected store to the CurrentList page
    * Navigates to CurrentList page
    * 
    * @param   None
    * 
    * @returns None
    */
    submitStore = () => {
        this.props.navigation.navigate("CurrentListPage", {
            fromPage: "SelectStorePage",
            listName: this.state.listName,
            listId: this.state.listId,
            currStoreTitle: this.state.currStoreTitle,
            currStoreId: this.state.currStoreId,
            currStoreAddr: this.state.currStoreAddr,
            currStoreName: this.state.currStoreName,
            sort: this.state.sort
        });
    };

    selectStore = location => {
        console.log(location);
        this.setState({ value: location });
    }

    render() {
        const renderMenuAction = () => (
            <TopNavigationAction
                icon={ArrowBackIcon}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const onSelect = ({ title }) => {
            this.setState({ value: title });
            this.updateCurrStore(title);
        };

        const onChangeText = (value) => {
            this.setState({ value });
            this.setState({
                data: [{ title: value }].concat(availableStores.filter(item => item.title.toLowerCase().includes(value.toLowerCase())).concat(availableStores[availableStores.length - 1]))
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
                                <Layout style={styles.mainInputGroup}>
                                    <Layout style={styles.autocompleteContainer}>
                                        <Autocomplete
                                            ref={(input) => { this.autoCompleteInput = input; }}
                                            style={styles.autocomplete}
                                            placeholder={'Enter a store name'}
                                            value={this.state.value}
                                            data={this.state.data}
                                            onChangeText={onChangeText}
                                            onSelect={onSelect}
                                        />
                                    </Layout>
                                    <Button style={styles.mapButton} icon={MapIcon} onPress={() => this.props.navigation.navigate(MAPS, { selectStore: this.selectStore })}/>
                                </Layout>
                                <Layout style={styles.mainButtonGroup} >
                                    <Button style={styles.mainPageButton} status='danger' onPress={() => this.props.navigation.goBack()}>{'Cancel'}</Button>
                                    <Button style={styles.mainPageButton} status='primary' onPress={() => { this.submitStore() }}>{'Submit'}</Button>
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
    mainInputGroup: {
        flexDirection: 'row',
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
    mapButton: {
        padding: 8,
        marginVertical: 4,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    autocompleteContainer: {
        flex: 1,
        borderRadius: 20,
    },
    autocomplete: {
        marginTop: 9,
        margin: 4,
        borderRadius: 20,
    },
});

export default SelectStorePage;


