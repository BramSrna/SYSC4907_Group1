import React, { Component } from "react";
import { StyleSheet } from 'react-native';
import {
    Layout,
    Button,
    Input,
    Modal,
    TopNavigation,
    TopNavigationAction,
    Select,
    Text,
    CheckBox,
} from 'react-native-ui-kitten';
import { ArrowBackIcon } from "../assets/icons/icons.js";
import { dark, light } from '../assets/Themes.js';
import NotificationPopup from 'react-native-push-notification-popup';
import nm from '../pages/Functions/NotificationManager.js';
import { MapView } from 'expo';
// import axios from 'axios';

const PAGE_TITLE = 'Select Location';

class MapsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {
                latitude: '00.0',
                longitude: '00.0',
            },
        }
    }

    render() {
        const renderMenuAction = () => (
            <TopNavigationAction
                icon={ArrowBackIcon}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        return (
            <React.Fragment>
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={renderMenuAction()}
                />
                <Layout style={styles.container}>
                    <MapView style={styles.container}/>
                </Layout>
                <NotificationPopup ref={ref => this.popup = ref} />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avoidingView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    mainButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
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
    mainPageButton: {
        flex: 1,
        padding: 8,
        marginVertical: 8,
        marginHorizontal: 2,
    },
    autocomplete: {
        width: '100%',
        margin: 4,
        borderRadius: 20,
    },
});

export default MapsPage; 