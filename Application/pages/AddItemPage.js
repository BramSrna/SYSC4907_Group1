import React, { Component } from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    FlatList,
    ScrollView,
    TouchableOpacity
} from "react-native";
import {
    Layout,
    Button,
    TopNavigation,
    TopNavigationAction,
    Autocomplete,
    Text,
} from 'react-native-ui-kitten';
import { ArrowBackIcon } from '../assets/icons/icons.js';
import { dark, light } from '../assets/Themes.js';
import NotificationPopup from 'react-native-push-notification-popup';
import lf from "./Functions/ListFunctions";
import ListItemContainer from "../components/ListItemContainer.js";
import DoubleClick from "react-native-double-tap";
import { AddIcon } from '../assets/icons/icons.js';
import * as firebase from 'firebase/app';

const globalComps = require('./Functions/GlobalComps');

const PAGE_TITLE = "Add Item";
const NEW_ITEM = "Register an item...";

const NUM_REC_ITEMS = 10;

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
            recommendedItems: [],
            listItemIds: []
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
            listItemIds: this.props.navigation.getParam("listItemIds", "(Invalid List Item IDs")
        });

        // Populate the Arrays for the autocomplete fields
        this.loadAvailableItems();       
    }

    componentDidMount() {
        this.loadRecommendedItems();
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

    sortObjectByKeys(toSort) {
        var sortable = [];
        for (var item in toSort) {
            sortable.push([item, toSort[item]]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });

        return sortable;
    }

    loadRecommendedItems() {
        var currItemIds = this.state.listItemIds;
        console.log(currItemIds);

        var that = this;

        var ref = firebase.database().ref('/recommendations');
        var retItems = ref.once('value').then((snapshot) => {
            var newItems = {};
            var ssv = snapshot.val();
            for (var i = 0; i < currItemIds.length; i++) {
                var itemId = currItemIds[i];
                if (itemId in ssv) {
                    var items = ssv[itemId];
                    for (var newItemId in items) {
                        var newItem = items[newItemId];
                        console.log(newItem);
                        if (!currItemIds.includes(newItem)) {
                            if (!(newItem in newItems)){
                                newItems[newItem] = 0;
                            }
                            newItems[newItem] += 1;
                        }
                    }
                }
            }

            var recItems = this.sortObjectByKeys(newItems);
            var topItems = this.sortObjectByKeys(ssv.topItems);
    
            var finalItems = [];
            var ids = [];
            for (var i = 0; (i < recItems.length) && (finalItems.length < NUM_REC_ITEMS); i++){
                var info = globalComps.ItemObj.getInfoFromId(recItems[i][0]);
                var name = (new globalComps.ItemObj(info.genericName, info.specificName)).getDispName();
                var id = recItems[i][0];

                finalItems.push({
                    genName: info.genericName,
                    specName: info.specificName,
                    name: name,
                    id: id
                });

                ids.push(id)
            }

            for (var i = 0; (i < topItems.length) && (finalItems.length < NUM_REC_ITEMS); i++){
                var id = topItems[i][0];
                if (!currItemIds.includes(id)) {
                    var info = globalComps.ItemObj.getInfoFromId(topItems[i][0]);
                    var name = (new globalComps.ItemObj(info.genericName, info.specificName)).getDispName();
                    
                    if (!ids.includes(id)){
                        finalItems.push({
                            genName: info.genericName,
                            specName: info.specificName,
                            name: name,
                            id: id
                        });                        
                    }
                }
            }

    
            that.setState({
                recommendedItems: finalItems
            });
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

    handleAddButton = () => {
        // Add the item to the list
        this.addItem(this.state.listId,
                     this.state.genName,
                     specName = this.state.specName);
        if (this._isMounted) {
            this.props.navigation.goBack();
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
    addItem(listId, genName, specName) {
        // Add the item to the list
        lf.AddItemToList(
            listId,
            genName,
            1,
            "aSize mL",
            "aNote",
            specName = specName);
    };

    addItemFromRecommended(ind) {
        var temp = this.state.recommendedItems;

        var item = temp[ind];
        this.addItem(this.state.listId,
                     item.genName,
                     item.specName);

        temp = this.state.listItemIds;
        temp.push(item.id);
        this.setState({
            listItemIds: temp
        });
        
        this.loadRecommendedItems();
    }

    renderListElem = (item, index) => {
        return (
            <Layout style={styles.listItem} level='2'>
                <Layout style={styles.listTextContainer}>
                    <Text>
                        {item.name}
                    </Text>
                </Layout>
                
                <Layout style={styles.listSpacerContainer}>
                    
                </Layout>

                <Layout style={styles.listButtonContainer}>
                    <Button
                        icon={AddIcon}
                        appearance='outline'
                        status='danger'
                        onPress={() => this.addItemFromRecommended(index)}
                    />
                </Layout>
            </Layout>
        );
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
                                    <Button
                                        style={styles.mainPageButton}
                                        status='danger'
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        {'Cancel'}
                                    </Button>
                                    
                                    <Button
                                        style={styles.mainPageButton}
                                        status='primary'
                                        onPress={this.handleAddButton}
                                    >
                                        {'Add Item'}
                                    </Button>
                                </Layout>

                            </Layout>
                        </Layout>
                
                        <Layout style={styles.formOuterContainer} level='3'>
                            <Layout style={styles.formInnerContainer}>
                                <Text>
                                    Recommended Items:
                                </Text>

                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 16 }}// This paddingBottom is to make the last item in the flatlist to be visible.
                                    style={styles.flatList}
                                    data={this.state.recommendedItems}
                                    width="100%"
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => this.renderListElem(item, index)}
                                />
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
    flatList: {
       paddingTop: 8,
       paddingHorizontal: 4,
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
    listItem: {
        flex: 1,
        marginVertical: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    ListContainer: {
       //justifyContent: "center",
       //alignItems: "center",
       flex: 1,
    },
    listTextContainer: {
        flex: 0.65
    },
    listSpacerContainer: {
        flex: 0.1
    },
    listButtonContainer: {
        flex: 0.25
    }
});

export default AddItemPage;


