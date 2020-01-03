import React, { Component } from "react";
import {
    Text,
    View,
    TouchableHighlight,
    TextInput,
    Alert,
    Image
} from "react-native";
import { TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";

import { styles, pickerStyle } from "../pages/pageStyles/MapCreatorPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import { departments } from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import RNPickerSelect from 'react-native-picker-select';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./DBInterface";

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
                depName: departments[0].value,
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
        this._mounted = false
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
        this.currDepartments.push({ depName: departments[0].value });

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
            deps.push(this.currDepartments[i]["depName"])
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
     * renderRequiredText
     * 
     * Renders a required text Text fields.
     * Prints the body of the text field with
     * the required text marker.
     * 
     * @param {String}  bodyText  The text of the Text field
     * @param {String}  reqText   The text to signify it is required text
     *                            (Default = (*))
     * 
     * @returns None
     */
    renderRequiredText(bodyText, reqText = "(*)") {
        return (
            <Text style={globalStyles.whiteText}>
                {bodyText}
                <Text style={globalStyles.requiredHighlight}>
                    {reqText}
                </Text>
            </Text>
        );
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
    updateDepartment(ind, newVal) {
        // Set the new value in the current departments array
        this.currDepartments[ind]["depName"] = newVal;

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
    upButtonPressed(ind) {
        // Check if the index is at the top of the list
        if (ind != 0) {
            // Swap the element at the index with the one above it
            var aboveItem = this.currDepartments[ind - 1]["depName"];
            this.currDepartments[ind - 1]["depName"] = this.currDepartments[ind]["depName"];
            this.currDepartments[ind]["depName"] = aboveItem;

            // Update the state
            this.setState({ arrayHolder: [...this.currDepartments] })
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
    delButtonPressed(ind) {
        // Remove the department from the list
        this.currDepartments.splice(ind, 1)

        // Update the state
        this.setState({ arrayHolder: [...this.currDepartments] })
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
    downButtonPressed(ind) {
        // Check if the index is at the bottom of the list
        if (ind != this.currDepartments.length - 1) {
            // Swap the element at the index with the below it
            var belowItem = this.currDepartments[ind + 1]["depName"]
            this.currDepartments[ind + 1]["depName"] = this.currDepartments[ind]["depName"]
            this.currDepartments[ind]["depName"] = belowItem

            // Update the state
            this.setState({ arrayHolder: [...this.currDepartments] })
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
    renderListElem(index) {
        // Images taken from https://material.io/resources/icons/?icon=cancel&style=baseline
        return (
            // Use the row sorter for rendering the item
            <View style={styles.rowSorter}>
                {/* Render the up button */}
                <TouchableHighlight
                    style={[styles.listButton, { backgroundColor: "black" }]}
                    onPress={() => this.upButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/up_button.png")}
                    />
                </TouchableHighlight>

                {/* Place buffers between elements to make it clearer */}
                <View style={styles.bufferView}></View>

                {/* Render the delete button */}
                <TouchableHighlight
                    style={[styles.listButton, { backgroundColor: "black" }]}
                    onPress={() => this.delButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/delete_button.png")}
                    />
                </TouchableHighlight>

                <View style={styles.bufferView}></View>

                {/* Render the down button */}
                <TouchableHighlight
                    style={[styles.listButton, { backgroundColor: "black" }]}
                    onPress={() => this.downButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/down_button.png")}
                    />
                </TouchableHighlight>

                <View style={styles.bufferView}></View>

                {/* Render the department picker */}
                <View style={{ flex: 5 }}>
                    <RNPickerSelect
                        value={this.currDepartments[index]["depName"]}
                        items={departments}
                        placeholder={{}}
                        style={pickerStyle}
                        onValueChange={(val) => this.updateDepartment(index, val)} />
                </View>

                {/* Add a blank area at the end of the row to allow for scrolling */}
                {/* <View style={{ flex: 1, backgroundColor: "white" }} /> */}
            </View>
        )
    }

    renderMenuAction = () => (
        <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );

    render() {
        return (

            <React.Fragment>
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={this.renderMenuAction()}
                />
                <View style={styles.mainContainer}>
                    <View style={styles.topContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.blackHeaderText}>Map Creator</Text>
                        </View>

                        <View style={styles.rowSorter}>
                            <View style={styles.textContainer}>
                                {this.renderRequiredText("Store Name: ")}
                            </View>

                            <View style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Store Name"
                                    onChangeText={(storeName) => this.setState({ storeName })}
                                    value={this.state.storeName}
                                />
                            </View>

                        </View>

                        <View style={styles.rowSorter}>
                            <View style={styles.textContainer}>
                                <Text style={globalStyles.whiteText}>Franchise Name: </Text>
                            </View>

                            <View style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Franchise Name"
                                    onChangeText={(franchiseName) => this.setState({ franchiseName })}
                                    value={this.state.franchiseName}
                                />
                            </View>

                        </View>

                        <View style={styles.rowSorter}>
                            <View style={styles.textContainer}>
                                {this.renderRequiredText("Address: ")}
                            </View>

                            <View style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Address"
                                    onChangeText={(address) => this.setState({ address })}
                                    value={this.state.address}
                                />
                            </View>

                        </View>
                    </View>

                    <View style={styles.midContainer}>
                        <FlatList
                            data={this.state.arrayHolder}
                            renderItem={({ item, index }) => this.renderListElem(index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <View style={styles.botContainer}>
                        <View style={styles.rowSorter}>
                            <View style={styles.outerButtonContainer}>
                                <TouchableHighlight
                                    style={[styles.buttonContainer, styles.button]}
                                    onPress={this.addDepartment}
                                >
                                    <Text style={globalStyles.whiteText}>{"Add Department"}</Text>
                                </TouchableHighlight>
                            </View>

                            <View style={styles.outerButtonContainer}>
                                <TouchableHighlight
                                    style={[styles.buttonContainer, styles.button]}
                                    onPress={this.handleSaveMap}
                                >

                                    <Text style={globalStyles.whiteText}>{"Save Map"}</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
                <NotificationPopup ref={ref => this.popup = ref} />
            </React.Fragment>
        );
    }
}

export default MapCreatorPage;  