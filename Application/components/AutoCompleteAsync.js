import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Autocomplete } from 'react-native-ui-kitten';
import axios from "axios";

/**
 * AutoCompleteAsync - An asyncronous autocomplete input box
 * @property {string} title - Text to be displayed (default: 'Lorem Ipsum')
 */
export default class AutoCompleteAsync extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            data: [],
            apiResponse: null,
        };
    }

    render() {
        const { placeholder = 'Start typing to fetch options', requestArray = [], requestValueIndex = 0, backgroundLevel = '3', onValueSelected = () => { } } = this.props;

        const onSelect = ({ title }) => {
            this.setState({ value: title });
            onValueSelected(title);
        };

        const onChangeText = (value) => {
            if (value.length > 6) {
                this.setState({ value });
                // console.log("CREATING REQUEST:= requestArray: " + requestArray);
                const request = requestArray.slice(0, requestValueIndex).concat(value.trim()).concat(requestArray.slice(requestValueIndex + 1)).join('');
                console.log("CREATED REQUEST:= request: " + request);
                axios
                    .get(request)
                    .then(result => {
                        // console.log(result);
                        var displayResult = [];
                        result.data.results.items.forEach(element => {
                            displayResult.push({ title: element.title + ' - ' + element.vicinity.replace(/[\n\r]/g, " ") });
                        });
                        this.setState({ data: displayResult });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            else {
                this.setState({ value });
            }
        };

        return (
            <Layout style={styles.outerContainer} level={backgroundLevel} >
                <Autocomplete
                    placeholder={placeholder}
                    value={this.state.value}
                    data={this.state.data}
                    onChangeText={onChangeText}
                    onSelect={onSelect}
                />
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        borderRadius: 10,
    },
});