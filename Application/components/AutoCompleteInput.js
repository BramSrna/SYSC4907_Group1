import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Autocomplete, } from 'react-native-ui-kitten';

/**
 * AutoCompleteInput - A simple autocomplete input field based on ui-kitten-autocomplete
 * @property {string} placeholder - Placeholder text to be displayed (default: 'Enter name...')
 * @property {string} iconFill - Color to fill the icon on the right of the container (default: #8F9BB3)
 * @property {array} autoCompleteData - Data array to populate the autocomplete
 * @property {boolean} filterLastItem - Determines if the last item of the data array gets filtered by the filter function
 * @property {boolean} autoFocusKeyboard - Determines if the keyboard should automatically open
 * @property {function} setValue - setValue() allows to call parent function
 */
export default class AutoCompleteInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            data: [],
        };
    }

    componentDidMount() {
    }

    render() {
        const { placeholder = 'Enter name...', autoCompleteData = [], filterLastItem = true, autoFocus = false, setValue = () => { } } = this.props;
        const onSelect = ({ title }) => {
            this.setState({ value: title });
            setValue(title);
        };

        const onChangeText = (value) => {
            this.setState({ value });
            this.setState({
                data: filterLastItem ? [{ name: value, title: value }].concat(autoCompleteData.filter(item => item.title.toLowerCase().includes(value.toLowerCase())))
                    : [{ name: value, title: value }].concat(autoCompleteData.filter(item => item.title.toLowerCase().includes(value.toLowerCase())).concat(autoCompleteData[autoCompleteData.length - 1]))
            });
        };
        return (
            <Autocomplete
                ref={(input) => { this.autoCompleteInput = input; }}
                style={styles.autocomplete}
                placeholder={placeholder}
                value={this.state.value}
                data={this.state.data}
                onChangeText={onChangeText}
                onSelect={onSelect}
            />
        );
    }
};

const styles = StyleSheet.create({
    autocomplete: {
        width: '100%',
        margin: 4,
        borderRadius: 20,
    },
});