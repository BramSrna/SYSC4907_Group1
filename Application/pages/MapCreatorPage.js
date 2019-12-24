import React, { Component } from "react";
import { Text, View, TouchableHighlight, TextInput, Alert, Image, StyleSheet } from "react-native";
import { Layout, Button, Input, Icon, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import { departments } from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import * as firebase from "firebase";
import RNPickerSelect from 'react-native-picker-select';
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";

const PAGE_TITLE = "Map Creator";

class MapCreatorPage extends Component {
    constructor(props) {
        super(props);

        // Use a list for keeping track of all the departments
        this.currDepartments = [
            {
                depName: departments[0].label,
            },
        ]

        this.state = {
            arrayHolder: [], // The departments added so far
            storeName: "", // The name of the store
            storeAddress: "", // The address of the store
        };
    }

    /*
    componentDidMount
    Set mounted to True
    @input  None
    @return void
    */
    componentDidMount() {
        this._mounted = true

        this.setState({ arrayHolder: [...this.currDepartments] })
    }

    /*
    componentWillUnmount
    Set mounted to False
    
    @input  None
    @return void
    */
    componentWillUnmount() {
        this._mounted = false
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
        this.currDepartments.push({ depName: departments[0].label });

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
        var deps = []

        // Copy the current list of departments
        for (var i = 0; i < this.currDepartments.length; i++) {
            deps.push(this.currDepartments[i]["depName"])
        }

        // Push the list to the database
        firebase.database().ref("/stores").push({
            name: this.state.storeName,
            map: deps
        });

        Alert.alert("Map Saved! Thank you!")
    }

    /*
    updateDepartment
    Updates the current index in the list, setting
    it to the given value.
    @input  ind     The index to update
    @input  newVal  The new value for the index
    @return void
    */
    updateDepartment(ind, newVal) {
        this.currDepartments[ind]["depName"] = newVal

        this.setState({ arrayHolder: [...this.currDepartments] })
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
    upButtonPressed(ind) {
        // Check if the index is at the top of the list
        if (ind != 0) {
            // Swap the element at the index with the one above it
            var aboveItem = this.currDepartments[ind - 1]["depName"]
            this.currDepartments[ind - 1]["depName"] = this.currDepartments[ind]["depName"]
            this.currDepartments[ind]["depName"] = aboveItem

            // Update the state
            this.setState({ arrayHolder: [...this.currDepartments] })
        }
    }

    /*
    delButtonPressed
    Handler for the delete button. Deletes the button
    at the given index from the list. Updates the state.
    @input  ind     The index to delete
    @return void
    */
    delButtonPressed(ind) {
        // Remove the department from the list
        this.currDepartments.splice(ind, 1)

        // Update the state
        this.setState({ arrayHolder: [...this.currDepartments] })
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

    /*
    renderListElem
    Renders the items in the department list. Each
    item has an up button, delete button, down button,
    picker for selecting the department, and a blank spot
    to allow for scrolling.
    @input  index   The index of the element being rendered
    @return void
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
                        </Layout>
                    </Layout>
                </ScrollView>
                {/* <Layout style={styles.mainContainer}>
                    <Layout style={styles.topContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.blackHeaderText}>Map Creator</Text>
                        </View>

                        <View style={styles.rowSorter}>
                            <View style={styles.textContainer}>
                                <Text style={globalStyles.whiteText}>Store Name: </Text>
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
                    </Layout>

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
                </Layout> */}
            </React.Fragment>
        );
    }

    _renderRow = ({ data, active }) => {
        return <Row data={data} active={active} />
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
});

export default MapCreatorPage;  