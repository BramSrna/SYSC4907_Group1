import React, { Component } from "react";
import { StyleSheet, Platform } from "react-native";
import {
    Layout,
    Button,
    Input,
    Modal,
    TopNavigation,
    TopNavigationAction,
    Select,
    Text,
    CheckBox
} from "react-native-ui-kitten";
import { ArrowBackIcon } from "../assets/icons/icons.js";
import { dark, light } from "../assets/Themes.js";
import NotificationPopup from "react-native-push-notification-popup";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import lf from "./Functions/ListFunctions";
import AutoCompleteAsync from "../components/AutoCompleteAsync.js";
// import axios from 'axios';

const PAGE_TITLE = "Select Location";
const NO_LOCATION_PERMISSION =
    "Please enable location permissions to view your current location.";
const ANDROID_EMULATOR_ERROR =
    "Oops, this will not work on Sketch in an Android emulator. Try it on your device!";

const DEFAULT_LATITUDE = 45.421;
const DEFAULT_LONGITUDE = -75.6907;
const DEFAULT_LATITUDE_DELTA = 0.09;
const DEFAULT_LONGITUDE_DELTA = 0.09;
const CURRENT_LOCATION_MARKER_TITLE = "Your Current Location";
const CURRENT_LOCATION_MARKER_DESCRIPTION = "";
const DEFAULT_MAX_LOCATIONS = 20;

const HERE_REQUEST_HEADER_1 =
    "https://places.sit.ls.hereapi.com/places/v1/browse";
const HERE_REQUEST_HEADER_2 = "&q=grocery+store";
const HERE_REQUEST_HEADER_3 = "&tf=plain";
const HERE_REQUEST_HEADER_4 = "&cat=shopping";

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
            currentLocation: {
                coords: { latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE }
            },
            currentCursorLocation: {
                coords: { latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE }
            },
            currentLocationMarkerOpacity: 0,
            statusMessage: null,
            apiKey: null,
            searchRequestParams: [],
            storesApiRequestResult: null
        };
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
        if (status !== "granted") {
            this.setState({
                errorMessage: NO_LOCATION_PERMISSION
            });
        }
        let currentLocation = await Location.getCurrentPositionAsync();
        this.getNearbyStores(currentLocation);
        this.setSearchRequestParams(currentLocation);
        this.setState({ currentLocation });
        this.setState({ currentLocationMarkerOpacity: 1 });
    };

    setSearchRequestParams = currentLocation => {
        if (this.state.apiKey != null) {
            var request = [];
            request[0] = HERE_REQUEST_HEADER_1 + "?at=" + currentLocation.coords.latitude + "," + currentLocation.coords.longitude;
            request[1] = "&name=";
            request[2] = "";
            request[3] = HERE_REQUEST_HEADER_4 + HERE_REQUEST_HEADER_3;
            request[4] = "&apiKey=" + this.state.apiKey;
            this.setState({ searchRequestParams: request });
        }
        else {
            console.log("MapsPage: apiKey is null, could not set search params.");
        }
    }

    getNearbyStores = currentLocation => {
        if (this.state.apiKey != null) {
            const request =
                HERE_REQUEST_HEADER_1 +
                "?at=" +
                currentLocation.coords.latitude +
                "," +
                currentLocation.coords.longitude +
                HERE_REQUEST_HEADER_2 +
                HERE_REQUEST_HEADER_3 +
                "&apiKey=" +
                this.state.apiKey;
            console.log("REQUEST STRING: " + request);
            axios
                .get(request)
                .then(result => {
                    // console.log(result);
                    this.setState({ storesApiRequestResult: result });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            console.log("MapsPage: apiKey is null, could not get nearby stores.");
        }
    };

    handleMapRegionChange = currentCursorLocation => {
        console.log(currentCursorLocation);
        this.setState({
            currentCursorLocation: {
                coords: {
                    latitude: currentCursorLocation.latitude,
                    longitude: currentCursorLocation.longitude
                }
            }
        });
    };

    calculateLatitudeDelta() {
        if (this.state.storesApiRequestResult != null) {
            var delta = 0.0;
            this.state.storesApiRequestResult.data.results.items.map((item, key) => {
                delta = Math.max(
                    delta,
                    Math.abs(
                        this.state.currentLocation.coords.latitude - item.position[0]
                    )
                );
            });
            return delta * 2;
        } else return DEFAULT_LATITUDE_DELTA;
    }

    calculateLongitudeDelta() {
        if (this.state.storesApiRequestResult != null) {
            var delta = 0.0;
            this.state.storesApiRequestResult.data.results.items.map((item, key) => {
                delta = Math.max(
                    delta,
                    Math.abs(
                        this.state.currentLocation.coords.longitude - item.position[1]
                    )
                );
            });
            return delta * 2;
        } else return DEFAULT_LONGITUDE_DELTA;
    }

    selectStore = location => {
        this.props.navigation.state.params.selectStore(location);
        this.props.navigation.goBack();
    };

    autoCompleteSelected = selectedStore => {
        console.log("RECEIVED selectedStore: " + selectedStore);
    }

    render() {
        const renderMenuAction = () => (
            <TopNavigationAction
                icon={ArrowBackIcon}
                onPress={() => this.props.navigation.goBack()}
            />
        );

        const createStoreMarker = (coords, title, description, key) => (
            <Marker
                key={key}
                coordinate={{ latitude: coords[0], longitude: coords[1] }}
                title={title}
                description={description}
                pinColor={"green"}
                onCalloutPress={() => this.selectStore(title + " - " + description)}
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
                    <Layout style={styles.autoCompleteInputContainer}>
                        <AutoCompleteAsync
                            placeholder={"Search for stores..."}
                            backgroundLevel='2'
                            requestArray={this.state.searchRequestParams}
                            requestValueIndex={2} // the value here is based on the position of the value in the requestArray
                            onValueSelected={this.autoCompleteSelected}
                        />
                    </Layout>
                    <MapView
                        style={styles.mapView}
                        region={{
                            latitude: this.state.currentLocation.coords.latitude,
                            longitude: this.state.currentLocation.coords.longitude,
                            latitudeDelta:
                                this.state.storesApiRequestResult != null
                                    ? this.calculateLatitudeDelta()
                                    : DEFAULT_LATITUDE_DELTA,
                            longitudeDelta:
                                this.state.storesApiRequestResult != null
                                    ? this.calculateLongitudeDelta()
                                    : DEFAULT_LONGITUDE_DELTA
                        }}
                    // onRegionChange={this.handleMapRegionChange}
                    >
                        <Marker
                            coordinate={this.state.currentLocation.coords}
                            title={CURRENT_LOCATION_MARKER_TITLE}
                            description={CURRENT_LOCATION_MARKER_DESCRIPTION}
                            opacity={this.state.currentLocationMarkerOpacity}
                        />
                        {this.state.storesApiRequestResult != null
                            ? this.state.storesApiRequestResult.data.results.items.map(
                                (item, key) => {
                                    return createStoreMarker(
                                        item.position,
                                        item.title,
                                        item.vicinity,
                                        key
                                    );
                                }
                            )
                            : null}
                    </MapView>
                </Layout>
                <NotificationPopup ref={ref => (this.popup = ref)} />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    autoCompleteInputContainer: {
        flexBasis: 60,
        padding: 8,
    },
    mapView: {
        flex: 1,
    },
});

export default MapsPage;
