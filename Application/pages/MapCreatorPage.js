import React, { Component } from "react";
import { Alert, StyleSheet, Platform, Picker } from "react-native";
import { Layout, Button, ButtonGroup, Input, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { departments } from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";
import { MoveUpIcon, MoveDownIcon, Trash2Icon, FlipIcon } from '../assets/icons/icons.js';
import RNPickerSelect from 'react-native-picker-select';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./DBInterface";
import styles from "../pages/pageStyles/MapCreatorPageStyle";

const PAGE_TITLE = "Map Creator";

// The default value for all input fields
const DEFAULT_STORE_NAME = "";
const DEFAULT_FRANCHISE_NAME = "";
const DEFAULT_ADDRESS = "";

class MapCreatorPage extends Component {
    constructor(props) {
        super(props);

        // Use a list for keeping track of all the departments
        this.currDepartments = [
            {
            },
        ]

        this.state = {
            arrayHolder: [], // The departments added so far
            storeName: DEFAULT_STORE_NAME, // The name of the store
            franchiseName: DEFAULT_FRANCHISE_NAME, // The franchise name of the store
            address: DEFAULT_ADDRESS, // The address of the store
        };
    }

    /**
    * componentDidMount
    * 
    * Function called after component was mounted.
    * Sets the context of the notification manager.
    * Sets the mounted boolean and the arrayHolder value.
    * 
    * @params  None
    * 
    * @return None
    */
    componentDidMount() {
        nm.setThat(this);

        this._mounted = true;
        
        this.setState({
            arrayHolder: [...this.currDepartments]
        });
    }

    /**
    * componentWillUnmount
    * 
    * Set mounted to False
    *
    * @params  None
    * 
    * @return void
    */
    componentWillUnmount() {
        this._mounted = false;
    }

    /**
    * addDepartment
    *
    * Adds a department to the list of departments and
    * intializes it to the first item in the list.
    * Rerenders the screen + state.
    * 
    * @params  None
    * 
    * @return void
    */
    addDepartment = () => {
        // Add a department to the list
        this.currDepartments.push({});

        // Rerender the screen
        this.setState({ arrayHolder: [...this.currDepartments] })
    }

    /**
    * handleSaveMap
    * 
    * Handles the Save Map button being clicked.
    * Checks that all required information has been given.
    * Copies the current department setting list and
    * pushes it to the database.
    * 
    * @params  None
    * 
    * @return void
    */
    handleSaveMap = () => {
        // Check that all required information was given
        if (!this.checkReqFields()){
            return;
        }  

        // Copy the current list of departments
        var deps = [];
        for (var i = 0; i < this.currDepartments.length; i++) {
            deps.push(this.currDepartments[i]["department"])
        }

        // Get the franchise name
        var tempFranchiseName = this.state.franchiseName === DEFAULT_FRANCHISE_NAME ? null : this.state.franchiseName;

        // Save the store to the database
        dbi.registerStore(this.state.storeName,
            this.state.address,
            deps,
            tempFranchiseName);

        Alert.alert("Map Saved! Thank you!")
    }

    /**
     * checkReqFields
     * 
     * Checks that the user has inputted values for
     * all mandatory fields. Determines if the user
     * has inputted a value by comparing the default
     * to the current value to see if they match. If
     * the current value matches the default value,
     * then the user has not entered a value.
     * 
     * @param None
     * 
     * @returns Boolean True if the user has inputted a value for all valid fields
     *                  False otherwise
     */
    checkReqFields() {
        // Check the generic name field
        if (this.state.storeName == DEFAULT_STORE_NAME) {
          Alert.alert("Please enter a value for the store name.");
          return (false);
        }

        // Check the specific name field
        if (this.state.address == DEFAULT_ADDRESS) {
          Alert.alert("Please enter a value for the address.");
          return (false);
        }

        return (true);
    }

    /**
    * updateDepartment
    *
    * Updates the current index in the list, setting
    * it to the given value.
    * 
    * @param {Integer}  ind     The index to update
    * @param {String}  newVal  The new value for the index
    * 
    * @returns void
    */
    updateDepartment = (ind, newVal) => {
        // Set the new value in the current departments array
        this.currDepartments[ind]["department"] = newVal;

        // Update the state
        this.setState({
            arrayHolder: [...this.currDepartments]
        });
    }

    /**
    * upButtonPressed
    * 
    * Handler for the up button. Swaps the department at
    * the given index with the department above it. If
    * the department is at the top of the list, nothing
    * happens.
    * 
    * @param {Integer}  ind     The index to move
    * 
    * @returns void
    */
    upButtonPressed = (ind) => {
        // Check if the index is at the top of the list
        if (ind != 0) {
            // Swap the element at the index with the one above it
            var aboveItem = this.currDepartments[ind - 1];
            this.currDepartments[ind - 1] = this.currDepartments[ind];
            this.currDepartments[ind] = aboveItem;

            // Update the state
            this.setState({
                arrayHolder: [...this.currDepartments]
            });
        }
    }

    /**
    * delButtonPressed
    * 
    * Handler for the delete button. Deletes the button
    * at the given index from the list. Updates the state.
    * 
    * @param {Integer}  ind     The index to delete
    * 
    * @returns void
    */
    delButtonPressed = (ind) => {
        // Remove the department from the list
        this.currDepartments.splice(ind, 1);

        // Update the state
        this.setState({
            arrayHolder: [...this.currDepartments]
        });
    }

    /**
    * downButtonPressed
    * 
    * Handler for the down button. Swaps the department at
    * the given index with the department below it. If
    * the department is at the bottom of the list, nothing
    * happens.
    * 
    * @param {Integer}  ind     The index to move
    * 
    * @return void
    */
    downButtonPressed = (ind) => {
        // Check if the index is at the bottom of the list
        if (ind != this.currDepartments.length - 1) {
            // Swap the element at the index with the below it
            var belowItem = this.currDepartments[ind + 1];
            this.currDepartments[ind + 1] = this.currDepartments[ind];
            this.currDepartments[ind] = belowItem;

            // Update the state
            this.setState({
                arrayHolder: [...this.currDepartments]
            });
        }
    }

    /**
    * renderListElem
    * 
    * Renders the items in the department list. Each
    * item has an up button, delete button, down button,
    * picker for selecting the department, and a blank spot
    * to allow for scrolling.
    * 
    * @param {Integer}  index   The index of the element being rendered
    * 
    * @return void
    */
    renderListElem = (index) => {
        const placeholder = {
            label: 'Select a department...',
            value: null,
        };

        renderIosPicker = () => {
            return (
                <RNPickerSelect style={styles.pickerIOS}
                    key={index}
                    items={departments}
                    placeholder={placeholder}
                    value={this.state.arrayHolder[index]['department']}
                    onValueChange={(val) => this.updateDepartment(index, val)}
                />
            );
        }

        renderAndroidPicker = () => {
            return (
                <Picker
                    style={styles.pickerAndroid}
                    prompt={placeholder.label}
                    selectedValue={this.state.arrayHolder[index]['department']}
                    onValueChange={(val) => this.updateDepartment(index, val)}
                >
                    {
                        departments.map((v) => {
                            return <Picker.Item key={index} label={v.label} value={v.value} color={global.theme == light ? light["text-hint-color"] : dark["text-hint-color"]} />
                        })
                    }
                </Picker>
            );
        }

        return (
            <Layout style={styles.listItem} level='2'>
                <ButtonGroup appearance='outline' status='primary'>
                    <Button icon={MoveUpIcon} onPress={() => this.upButtonPressed(index)} />
                    <Button icon={MoveDownIcon} onPress={() => this.downButtonPressed(index)} />
                </ButtonGroup>
                <Layout level='2' style={styles.selectMenu}>
                    {Platform.OS === 'ios' ? renderIosPicker() : renderAndroidPicker()}
                </Layout>
                <Button icon={Trash2Icon} appearance='outline' status='danger' onPress={() => this.delButtonPressed(index)} />
            </Layout>
        );
    }

    renderMenuAction = () => (
        <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );

    render() {
        console.log('ArrayHolder', this.state.arrayHolder);
        return (
            <React.Fragment>
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={this.renderMenuAction()}
                />
                <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
                    <Layout style={styles.formOuterContainer} level='3'>
                        <Layout style={styles.formInnerContainer}>
                            <Input style={styles.inputRow}
                                label='Store Name'
                                ref="storename"
                                placeholder='Enter store name...'
                                returnKeyType='next'
                                value={this.state.storeName}
                                onChangeText={(storeName) => this.setState({ storeName })}
                                onSubmitEditing={() => this.refs.address.focus()}
                                blurOnSubmit={false}
                            />
                            <Input style={styles.inputRow}
                                label='Store Address'
                                ref="address"
                                placeholder='Enter store address...'
                                value={this.state.address}
                                onChangeText={(address) => this.setState({ address })}
                            />
                            <Input style={styles.inputRow}
                                label='Franchise Name'
                                ref="fName"
                                placeholder='Enter franchise name...'
                                value={this.state.franchiseName}
                                onChangeText={(franchiseName) => this.setState({ franchiseName })}
                            />
                        </Layout>
                    </Layout>
                    <Layout style={styles.formOuterContainer} level='3'>
                        <Layout style={styles.formInnerContainer}>
                            <FlatList
                                style={styles.flatList}
                                width="100%"
                                data={this.state.arrayHolder}
                                renderItem={({ item, index }) => this.renderListElem(index)}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state.arrayHolder}
                            />
                            <Layout style={styles.mainButtonGroup} >
                                <Button style={styles.mainPageButton} status='primary' onPress={this.addDepartment}>{'Add Department'}</Button>
                                <Button style={styles.mainPageButton} status='success' onPress={this.handleSaveMap}>{'Save Map'}</Button>
                            </Layout>
                        </Layout>
                    </Layout>
                </ScrollView>
                <NotificationPopup ref={ref => this.popup = ref} />
            </React.Fragment>
        );
    }
}

export default MapCreatorPage;  