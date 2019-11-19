import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SideMenuStyle';
import { NavigationActions } from 'react-navigation';
import { ScrollView, View } from 'react-native';
import { Layout, Text, Toggle } from 'react-native-ui-kitten';
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
        this.state = {
            darkMode: false,
        };
    }

    onDarkModeToggle = (darkMode) => {
        this.setState({ darkMode });
        this.props.toggleTheme();
    };

    navigateToScreen = (route) => () => {
        if (route == 'Logout') {
            firebase.auth().signOut();
        } else {
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);
        }
    }

    render() {
        return (
            <Layout style={styles.columnContainer}>
                <ScrollView style={styles.container}>
                    <Layout style={styles.columnContainer}>
                        <Text style={styles.sectionHeadingStyle}>
                            {YOUR_DATA}
                        </Text>
                        <Layout style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                                {HOME}
                            </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('YourListsPage')}>
                                {YOUR_LISTS}
                            </Text>
                        </Layout>
                    </Layout>
                    <Layout style={styles.columnContainer}>
                        <Text style={styles.sectionHeadingStyle}>
                            {FEEDBACK}
                        </Text>
                        <Layout style={styles.navSectionStyle}>
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
                <Layout style={styles.footerContainer}>
                    <Toggle style={styles.toggle}
                        checked={this.state.darkMode}
                        text='Dark Mode'
                        size='small'
                        onChange={this.onDarkModeToggle}
                    />
                    <Layout>
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