import React, { Component } from "react";
import { Alert, StyleSheet, Platform, Picker } from "react-native";
import { Layout, Button, ButtonGroup, Input, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { departments } from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";
import { MoveUpIcon, MoveDownIcon, Trash2Icon, FlipIcon } from '../assets/icons/icons.js';
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
            },
        ]

        this.state = {
            arrayHolder: [], // The departments added so far
            storeName: DEFAULT_STORE_NAME, // The name of the store
            franchiseName: DEFAULT_FRANCHISE_NAME, // The franchise name of the store
            address: DEFAULT_ADDRESS, // The address of the store
        };
    }

    /*
    componentDidMount
    Set mounted to True
    @input  None
    @return void
    */
    componentDidMount() {
        nm.setThat(this);
        this._mounted = true;
        this.setState({ arrayHolder: [...this.currDepartments] });
    }

    /*
    componentWillUnmount
    Set mounted to False
    
    @input  None
    @return void
    */
    componentWillUnmount() {
        this._mounted = false;
    }

    /*
    addDepartment
    Adds a department to the list of departments and
    intializes it to the first item in the list.
    Rerenders the screen + state.
    @input  None
    @return void
    */
    addDepartment = () => {
        // Add a department to the list
        this.currDepartments.push({});

        // Rerender the screen
        this.setState({ arrayHolder: [...this.currDepartments] })
    }

    /*
    handleSaveMap
    Handles the Save Map button being clicked.
    Copies the current department setting list and
    pushes it to the database.
    @input  None
    @return void
    */
    handleSaveMap = () => {
        if (!this.checkReqFields()){
            return;
        }

        var deps = []

        // Copy the current list of departments
        for (var i = 0; i < this.currDepartments.length; i++) {
            deps.push(this.currDepartments[i]["department"])
        }
        
        // Saves the data if all required fields have values
        var tempFranchiseName = this.state.franchiseName === DEFAULT_FRANCHISE_NAME ? null : this.state.franchiseName;

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
     * 
     * renderRequiredText
     * 
     * Renders a required text Text fields.
     * Prints the body of the text field with
     * the required text marker.
     * 
     * @param {String}  bodyText  The text of the Text field
     * @param {String}  reqText   The text to signify it is required text (Default = (*))
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

    /*
    updateDepartment
    Updates the current index in the list, setting
    it to the given value.
    @input  ind     The index to update
    @input  newVal  The new value for the index
    @return void
    */
    updateDepartment = (ind, newVal) => {
        this.currDepartments[ind]["department"] = newVal;
        this.setState({ arrayHolder: [...this.currDepartments] });
    }

    /*
    upButtonPressed
    Handler for the up button. Swaps the department at
    the given index with the department above it. If
    the department is at the top of the list, nothing
    happens.
    @input  ind     The index to move
    @return void
    */
    upButtonPressed = (ind) => {
        // Check if the index is at the top of the list
        if (ind != 0) {
            // Swap the element at the index with the one above it
            var aboveItem = this.currDepartments[ind - 1];
            this.currDepartments[ind - 1] = this.currDepartments[ind];
            this.currDepartments[ind] = aboveItem;

            // Update the state
            this.setState({ arrayHolder: [...this.currDepartments] });
        }
    }

    /*
    delButtonPressed
    Handler for the delete button. Deletes the button
    at the given index from the list. Updates the state.
    @input  ind     The index to delete
    @return void
    */
    delButtonPressed = (ind) => {
        // Remove the department from the list
        this.currDepartments.splice(ind, 1);

        // Update the state
        this.setState({ arrayHolder: [...this.currDepartments] });
    }

    /*
    downButtonPressed
    Handler for the down button. Swaps the department at
    the given index with the department below it. If
    the department is at the bottom of the list, nothing
    happens.
    @input  ind     The index to move
    @return void
    */
    downButtonPressed = (ind) => {
        // Check if the index is at the bottom of the list
        if (ind != this.currDepartments.length - 1) {
            // Swap the element at the index with the below it
            var belowItem = this.currDepartments[ind + 1];
            this.currDepartments[ind + 1] = this.currDepartments[ind];
            this.currDepartments[ind] = belowItem;

            // Update the state
            this.setState({ arrayHolder: [...this.currDepartments] });
        }
    }

    /*
            renderListElem
            Renders the items in the department list. Each
            item has an up button, delete button, down button,
            picker for selecting the department, and a blank spot
            to allow for scrolling.
            @input  index   The index of the element being rendered
            @return void
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
                                onSubmitEditing={() => this.refs.storeaddress.focus()}
                                blurOnSubmit={false}
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
                            <Input style={styles.inputRow}
                                label='Store Address'
                                ref="storeaddress"
                                placeholder='Enter store address...'
                                value={this.state.storeAddress}
                                onChangeText={(storeAddress) => this.setState({ storeAddress })}
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

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    container: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    scrollContainer: {
        flex: 1,
    },
    avoidingView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    overflowMenu: {
        padding: 4,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
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
    listItem: {
        flex: 1,
        marginVertical: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10,
    },
    selectMenu: {
        flex: 1,
        paddingHorizontal: 8,
        minWidth: 60,
    },
    flatList: {
        flex: 1
    },
    inputRow: {
        paddingVertical: 4,
    },
    selectBox: {
        width: '100%',
    },
    button: {
        flex: 1,
        marginTop: 8,
        width: '100%',
    },
    placeholderStyle: {
        color: 'gray',
    },
    mainButtonGroup: {
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
    pickerIOS: {
        marginHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    pickerAndroid: {
        marginHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1,

    },
});

export default MapCreatorPage;  