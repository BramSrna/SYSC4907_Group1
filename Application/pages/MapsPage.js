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
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapView, { Marker, } from 'react-native-maps';
import axios from "axios";
import lf from "./Functions/ListFunctions";
// import axios from 'axios';

const PAGE_TITLE = 'Select Location';
const NO_LOCATION_PERMISSION = 'Please enable location permissions to view your current location.';
const ANDROID_EMULATOR_ERROR = 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!';

const DEFAULT_LATITUDE = 45.4210;
const DEFAULT_LONGITUDE = -75.6907;
const DEFAULT_LATITUDE_DELTA = 0.0090;
const DEFAULT_LONGITUDE_DELTA = 0.0090;
const CURRENT_LOCATION_MARKER_TITLE = 'Your Current Location';
const CURRENT_LOCATION_MARKER_DESCRIPTION = '';
const DEFAULT_MAX_LOCATIONS = 20;

const HERE_REQUEST_HEADER_1 = 'https://places.sit.ls.hereapi.com/places/v1/browse';
const HERE_REQUEST_HEADER_2 = '&q=grocery+store';

// SMAPLE API REQUEST
// https://places.sit.ls.hereapi.com/places/v1/discover/explore
// ?apiKey={YOUR_API_KEY}
// &in=53.2711,-9.0541;r=150
// &cat=sights-museums
// &pretty

class MapsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: { coords: { latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE } },
            currentCursorLocation: { coords: { latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE } },
            statusMessage: null,
            apiKey: null,
            storesApiRequestResult: null,
        }
    }

    componentWillMount() {
        this._getApiKey();
        this._getLocationAsync();
    }

    async _getApiKey() {
        var key = await lf.getMapsApiKey();
        this.setState({ apiKey: key });
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: NO_LOCATION_PERMISSION,
            });
        }

        let currentLocation = await Location.getCurrentPositionAsync();
        this.setState({ currentLocation });
        this.getNearbyStores(currentLocation);
    };

    getNearbyStores = async (currentLocation) => {
        if (this.state.apiKey != null) {
            const request = HERE_REQUEST_HEADER_1 + '?at=' + currentLocation.coords.latitude + ',' + currentLocation.coords.longitude + HERE_REQUEST_HEADER_2 + '&apiKey=' + this.state.apiKey;
            console.log('REQUEST STRING: ' + request);
            this.state.storesApiRequestResult = await axios.get(request).then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            });
        }else{
         console.log('MapsPage: apiKey is null')   
        }
    }

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
                        region={{
                            latitude: this.state.currentLocation.coords.latitude,
                            longitude: this.state.currentLocation.coords.longitude,
                            latitudeDelta: DEFAULT_LATITUDE_DELTA,
                            longitudeDelta: DEFAULT_LONGITUDE_DELTA
                        }}
                    >
                        <Marker
                            coordinate={this.state.currentLocation.coords}
                            title={CURRENT_LOCATION_MARKER_TITLE}
                            description={CURRENT_LOCATION_MARKER_DESCRIPTION}
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