import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SideMenuStyle';
import { NavigationActions } from 'react-navigation';
import { ScrollView, } from 'react-native';
import { Layout, Text, } from 'react-native-ui-kitten';
import firebase from 'firebase';

const YOUR_DATA = "Your Data";
const HOME = "Home";
const CONTACTS = "Contacts";
const YOUR_LISTS = "Your Lists";
const SEARCH_RECIPE = "Search for a Recipe";
const FEEDBACK = "Feedback";
const ADD_ITEM_LOCATION = "Add Item Location";
const MAP_A_STORE = "Map a Store";
const REGISTER_AN_ITEM = "Register an Item";
const SIGNOUT = "Sign Out";
const EXCEL_PARSER = "Parse Excel File";

const DEV_MODE_ENABLED = false;

class SideMenu extends Component {
    constructor(props) {
        super(props)
    }

    navigateToScreen = (route) => () => {
        if (route == 'Logout') {
            this.signOutUser();
        } else {
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);
        }
    }

    signOutUser = async () => {
        try {
            await firebase.auth().signOut();
            console.log("SideMenu: firabase.auth().signOut() called App.js will switch navigation");
        } catch (e) {
            console.log(e);
        }
    }

    devModeRender() {
        return (
            <Text
                style={styles.navItemStyle}
                onPress={this.navigateToScreen('ExcelParserPage')}
            >
                {EXCEL_PARSER}
            </Text>
        );
    }

    returnDispalyName() {
        if (firebase.auth().currentUser != null && firebase.auth().currentUser.displayName != null) {
            return (
                <Text style={styles.signedInText} appearance='hint'>Signed in as {firebase.auth().currentUser.displayName}</Text>
            );
        }
    }

    render() {
        return (
            <Layout style={styles.columnContainer} level='2'>
                <ScrollView style={styles.container}>
                    <Layout style={styles.columnContainer}>
                        <Layout style={styles.headingContainer} level='4'>
                            <Text style={styles.sectionHeadingStyle}>
                                {YOUR_DATA}
                            </Text>
                        </Layout>
                        <Layout style={styles.navSectionStyle} level='3'>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                                {HOME}

                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('YourContacts')}>
                                {CONTACTS}
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('YourListsPage')}>
                                {YOUR_LISTS}
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('SearchRecipePage')}>
                                {SEARCH_RECIPE}
                            </Text>
                        </Layout>
                    </Layout>
                    <Layout style={styles.columnContainer}>
                        <Layout style={styles.headingContainer} level='4'>
                            <Text style={styles.sectionHeadingStyle}>
                                {FEEDBACK}
                            </Text>
                        </Layout>
                        <Layout style={styles.navSectionStyle} level='3'>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('AddItemLocationPage')}>
                                {ADD_ITEM_LOCATION}
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('MapCreatorPage')}>
                                {MAP_A_STORE}
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('RegisterItemPage')}>
                                {REGISTER_AN_ITEM}
                            </Text>
                            {DEV_MODE_ENABLED && this.devModeRender()}
                        </Layout>
                    </Layout>
                </ScrollView>
                <Layout style={styles.footerContainer} level='3'>
                    <Layout level='3'>
                        {this.returnDispalyName()}
                    </Layout>
                    <Layout level='3'>
                        <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Logout')}>{SIGNOUT}</Text>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;