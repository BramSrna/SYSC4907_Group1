import React, { Component } from "react";
import { StyleSheet, Platform } from 'react-native';
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
import { Permissions, Location, } from 'expo';
import MapView, { Marker, } from 'react-native-maps';
// import axios from 'axios';

const PAGE_TITLE = 'Select Location';
const NO_LOCATION_PERMISSION = 'Please enable location permissions to view your current location.';
const ANDROID_EMULATOR_ERROR = 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!';

class MapsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: { coords: { latitude: 0.0, longitude: 0.0 } },
            statusMessage: null,
        }
    }

    componentWillMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: NO_LOCATION_PERMISSION,
            });
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        this.setState({ currentLocation });
    };

    render() {
        const renderMenuAction = () => (
            <TopNavigationAction
                icon={ArrowBackIcon}
                onPress={() => this.props.navigation.goBack()}
            />
        );
        console.log(this.state.currentLocation);
        return (
            <React.Fragment>
                <TopNavigation
                    title={PAGE_TITLE}
                    alignment="center"
                    leftControl={renderMenuAction()}
                />
                <Layout style={styles.container}>
                    <MapView style={styles.container}
                        region={{ latitude: this.state.currentLocation.coords.latitude, longitude: this.state.currentLocation.coords.longitude, latitudeDelta: 0.0090, longitudeDelta: 0.0090 }}
                    >
                        <Marker
                            coordinate={this.state.currentLocation.coords}
                            title="My Marker"
                            description="Some description"
                        />
                    </MapView>
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