import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './SideMenuStyle';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View } from 'react-native';
import firebase from 'firebase';

class SideMenu extends Component {

    constructor(props) {
        super(props)
    }
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
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text style={styles.sectionHeadingStyle}>
                            Your Data
            </Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
                                Home
              </Text>
                        </View>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('YourListsPage')}>
                                Your Lists
              </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.sectionHeadingStyle}>
                            Feedback
            </Text>
                        <View style={styles.navSectionStyle}>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('AddItemPage')}>
                                Add Item
              </Text>
                            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('MapCreatorPage')}>
                                Map Creator
              </Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.footerContainer}>
                    <Text onPress={this.navigateToScreen('Logout')}>
                        Sign Out
              </Text>
                </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;