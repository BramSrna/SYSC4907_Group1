import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import { Select, Layout, Button, ButtonGroup, Input, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { departments } from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { dark, light } from '../assets/Themes.js';
import { ScrollView } from "react-native-gesture-handler";
import { MoveUpIcon, MoveDownIcon, Trash2Icon } from '../assets/icons/icons.js';

const PAGE_TITLE = "Map Creator";

class MapCreatorPage extends Component {
    constructor(props) {
        super(props);

        // Use a list for keeping track of all the departments
        this.currDepartments = [
            {
                department: departments[0],
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
        this.currDepartments.push({ department: departments[0].label });

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
            deps.push(this.currDepartments[i]["department"])
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
            var aboveItem = this.currDepartments[ind - 1]["department"]
            this.currDepartments[ind - 1]["department"] = this.currDepartments[ind]["department"]
            this.currDepartments[ind]["department"] = aboveItem

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
    delButtonPressed = (ind) => {
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
    downButtonPressed = (ind) => {
        // Check if the index is at the bottom of the list
        if (ind != this.currDepartments.length - 1) {
            // Swap the element at the index with the below it
            var belowItem = this.currDepartments[ind + 1]["department"]
            this.currDepartments[ind + 1]["department"] = this.currDepartments[ind]["department"]
            this.currDepartments[ind]["department"] = belowItem

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
    renderListElem = (index) => {
        return (
            <Layout style={styles.listItem} level='2'>
                <ButtonGroup appearance='outline' status='primary'>
                    <Button icon={MoveUpIcon} onPress={() => this.upButtonPressed(index)} />
                    <Button icon={MoveDownIcon} onPress={() => this.downButtonPressed(index)} />
                </ButtonGroup>
                <Select style={styles.selectMenu}
                    multiSelect={false}
                    data={departments}
                    placeholder='Select a department...'
                    placeholderStyle={styles.placeholderStyle}
                    selectedOption={this.state.arrayHolder[index]['text']}
                    onSelect={(val) => this.updateDepartment(index, val)}
                />
                <Button icon={Trash2Icon} appearance='outline' status='danger' onPress={() => this.delButtonPressed(index)} />
            </Layout>
        );
    }

    renderMenuAction = () => (
        <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );

    render() {
        console.log(this.state.arrayHolder);
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
                            <FlatList
                                style={styles.flatList}
                                width="100%"
                                data={this.state.arrayHolder}
                                renderItem={({ item, index }) => this.renderListElem(index)}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={this.state}
                            />
                            <Layout style={styles.mainButtonGroup} >
                                <Button style={styles.mainPageButton} status='primary' onPress={this.addDepartment}>{'Add Department'}</Button>
                                <Button style={styles.mainPageButton} status='success' onPress={this.handleSaveMap}>{'Save Map'}</Button>
                            </Layout>
                        </Layout>
                    </Layout>
                </ScrollView>
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
});

export default MapCreatorPage;  