import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SideMenuStyle';
import { NavigationActions } from 'react-navigation';
import { ScrollView, } from 'react-native';
import { Layout, Text, } from 'react-native-ui-kitten';
import firebase from 'firebase';

const YOUR_DATA = "Your Data";
const HOME = "Home";
const YOUR_LISTS = "Your Lists";
const FEEDBACK = "Feedback";
const ADD_ITEM_LOCATION = "Add Item Location";
const MAP_A_STORE = "Map a Store";
const REGISTER_AN_ITEM = "Register an Item";
const SIGNOUT = "Sign Out";

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
            navigate('Auth');
        } catch (e) {
            console.log(e);
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
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('YourListsPage')}>
                                {YOUR_LISTS}
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
                        </Layout>
                    </Layout>
                </ScrollView>
                <Layout style={styles.footerContainer} level='3'>
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