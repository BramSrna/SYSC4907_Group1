import React, { Component } from "react";
import { Text, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Layout, Button, Input, Select, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { MenuOutline } from "../assets/icons/icons.js";
import { ScrollView } from "react-native-gesture-handler";
import { dark, light } from '../assets/Themes.js';
import globalStyles from "./pageStyles/GlobalStyle";
import * as firebase from "firebase";
import { departments } from "../DepartmentList";
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import * as dbi from "./Functions/DBInterface";

const PAGE_TITLE = "Excel Parser";

const excelData = require('../collectedInfo.json');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ExcelParserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    renderMenuAction = () => (
        <TopNavigationAction icon={MenuOutline} onPress={() => this.props.navigation.toggleDrawer()} />
    );

    async parseFile() {
        var items = excelData["ITEMS"];
        var stores = excelData["STORES"];
        var locs = excelData["LOCS"];

        for (var i = 0; i < items.length; i++) {
            var tempItem = items[i];
            
            var genName = tempItem["genericName"];
            var price = tempItem["price"];
            var size = tempItem["size"];
            var sizeUnit = tempItem["sizeUnit"];
            var specName = tempItem["specificName"];

            /**
            // Register the item
            dbi.registerItem(genName,
                             specName,
                             size,
                             sizeUnit,
                             price);

            await sleep(50);
            */
        }

        for (var i = 0; i < stores.length; i++) {
            var tempStore = stores[i];
            
            var storeName = tempStore["storeName"];
            var map = tempStore["map"];
            var fName = tempStore["franchiseName"];
            var aisleTags = tempStore["aisleTags"];
            var address = tempStore["address"];

            /**
            // Register the store
            dbi.registerStore(storeName,
                              address,
                              map,
                              fName);

            await sleep(50);
            */
        }

        for (var i = 0; i < locs.length; i++) {
            var tempLoc = locs[i];
            
            var address = tempLoc["address"];
            var aisleNum = tempLoc["aisleNum"];
            var department = tempLoc["department"];
            var genName = tempLoc["genericName"];
            var specName = tempLoc["specificName"];
            var storeName = tempLoc["storeName"];

            /**
            dbi.addItemLoc(genName,
                           specName,
                           storeName,
                           address,
                           aisleNum,
                           department);

            await sleep(50);
            */
    
        }

        //console.log(items.length, stores.length, locs.length);

        console.log("Done Parsing.");
    }

    render() {
        return (
            <React.Fragment>
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={this.renderMenuAction()}
                />
                <KeyboardAvoidingView style={[styles.avoidingView, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]} behavior="padding" enabled keyboardVerticalOffset={24}>
                    <ScrollView style={[styles.scrollContainer, { backgroundColor: global.theme == light ? light["background-basic-color-1"] : dark["background-basic-color-1"] }]}>
                        <Layout style={styles.formOuterContainer} level='3'>
                            <Layout style={styles.formInnerContainer}>
                            <Button style={styles.button} onPress={this.parseFile} >Parse Excel File</Button>
                            </Layout>
                        </Layout>
                    </ScrollView>
                </KeyboardAvoidingView>
                <NotificationPopup ref={ref => this.popup = ref} />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
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

export default ExcelParserPage;