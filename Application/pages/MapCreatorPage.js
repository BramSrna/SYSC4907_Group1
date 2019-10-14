import React, { Component } from "react";
import { Text,
         View,
         TouchableHighlight,
         TextInput,
         Picker,
         Alert,
         Image} from "react-native";
import styles from "../pages/pageStyles/MapCreatorPageStyle";
import globalStyles from "../pages/pageStyles/GlobalStyle";
import {departments} from "../DepartmentList"
import { FlatList } from "react-native-gesture-handler";
import * as firebase from "firebase";

class MapCreatorPage extends Component {
    constructor(props) {
        super(props);

        this.currDepartments = [
            {
                depName: Object.keys(departments)[0],
            },
        ]

        this.state = {
            arrayHolder: [],
            storeName: "",
        };
    }

    /*
    componentDidMount
    Set mounted to True
    @input  None
    @return void
    */
    componentDidMount () {
        this._mounted = true

        this.setState({ arrayHolder: [...this.currDepartments] })
    }

    /*
    componentWillUnmount
    Set mounted to False
    @input  None
    @return void
    */
    componentWillUnmount () {
        this._mounted = false
    }

    addDepartment = () => {
        this.currDepartments.push({depName : Object.keys(departments)[0]});

        this.setState({ arrayHolder: [...this.currDepartments]})
    }

    handleSaveMap = () => {
        var deps = []

        for (var i = 0; i < this.currDepartments.length; i++){
            deps.push(this.currDepartments[i]["depName"])
        }

        console.log(deps)

        firebase.database().ref("/stores").push({
            name: this.state.storeName,
            map: deps
        });
    }

    updateDepartment(ind, newVal) {
        this.currDepartments[ind]["depName"] = newVal

        this.setState({ arrayHolder: [...this.currDepartments]})
    }

    upButtonPressed(ind) {
        if (ind != 0) {
            var aboveItem = this.currDepartments[ind - 1]["depName"]
            this.currDepartments[ind - 1]["depName"] = this.currDepartments[ind]["depName"]
            this.currDepartments[ind]["depName"] = aboveItem

            this.setState({ arrayHolder: [...this.currDepartments]})
        }
    }

    delButtonPressed(ind) {
        this.currDepartments.splice(ind, 1)

        this.setState({ arrayHolder: [...this.currDepartments]})
    }

    downButtonPressed(ind) {
        if (ind != this.currDepartments.length - 1) {
            var belowItem = this.currDepartments[ind + 1]["depName"]
            this.currDepartments[ind + 1]["depName"] = this.currDepartments[ind]["depName"]
            this.currDepartments[ind]["depName"] = belowItem

            this.setState({ arrayHolder: [...this.currDepartments]})
        }
    }

    renderListElem(index) {
        // Images taken from https://material.io/resources/icons/?icon=cancel&style=baseline
        return (
            <View style={styles.rowSorter}>
                <View style = {styles.bufferView}></View>

                <TouchableHighlight
                    style = {[styles.listButton, {backgroundColor : "white"}]}
                    onPress = {() => this.upButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/up_button.png")}
                    />
                </TouchableHighlight>

                <View style = {styles.bufferView}></View>

                <TouchableHighlight
                    style = {[styles.listButton, {backgroundColor : "white"}]}
                    onPress = {() => this.delButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/delete_button.png")}
                    />
                </TouchableHighlight>

                <View style = {styles.bufferView}></View>

                <TouchableHighlight
                    style = {[styles.listButton, {backgroundColor : "white"}]}
                    onPress = {() => this.downButtonPressed(index)}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={require("../assets/icons/down_button.png")}
                    />
                </TouchableHighlight>

                <View style = {styles.bufferView}></View>

                <View style = {{flex : 5}}>                
                    <Picker
                        selectedValue={this.currDepartments[index]["depName"]}
                        style={styles.picker}
                        onValueChange={(itemDepartment) => this.updateDepartment(index, itemDepartment)}>
                        {Object.keys(departments).map((key) => {
                            return (<Picker.Item label={departments[key]["displayName"]} value={key} key={key}/>)
                        })}
                    </Picker>
                </View>

                <View style = {{flex : 1, backgroundColor : "white"}}/>

            </View>
        )
    }

    render() {
        return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Text style={styles.blackHeaderText}>Map Creator:</Text>

                <View style={styles.rowSorter}>
                    <View style = {styles.mainContainer}>
                        <Text style={globalStyles.blackText}>Store Name: </Text>
                    </View>

                    <View style = {styles.mainContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Store Name"
                            onChangeText={(storeName) => this.setState({storeName})}
                            value={this.state.storeName}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.midContainer}>
                <FlatList
                    data={this.state.arrayHolder}
                    renderItem={({item, index}) => this.renderListElem(index)}
                    keyExtractor={item => item.id}
                />
            </View>

            <View style={styles.botContainer}>
                <View style={styles.rowSorter}>
                    <TouchableHighlight
                        style={[styles.buttonContainer, styles.button]}
                        onPress={this.addDepartment}
                    >
                        <Text style={globalStyles.whiteText}>{"Add Department"}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.buttonContainer, styles.button]}
                        onPress={this.handleSaveMap}
                    >

                        <Text style={globalStyles.whiteText}>{"Save Map"}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
        );
    }
}

export default MapCreatorPage; 