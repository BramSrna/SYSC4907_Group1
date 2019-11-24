import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, } from 'react-native';
import { Layout, Text, Icon, } from 'react-native-ui-kitten';

export default class HomeSquareContainer extends Component {
    render() {
        const { name = 'Button', icon = 'list-outline', shape = 1, iconFill = '#8F9BB3', backgroundLevel = '2', onPress = () => { }, sizeValue, marginValue} = this.props;
        return (
            <TouchableHighlight style={[styles.outerContainer, { width: shape == 1 ? sizeValue : (sizeValue * 2) + marginValue * 2, height: sizeValue, margin: marginValue }]} onPress={onPress}>
                <Layout style={[styles.container, { width: shape == 1 ? sizeValue : (sizeValue * 2) + marginValue * 2, height: sizeValue, margin: marginValue }]} level={backgroundLevel}>
                    <Icon style={styles.margin} name={icon} width={sizeValue * .25} height={sizeValue * .25} fill={iconFill} />
                    <Text style={styles.margin} category='h6' appearance='default'>{name}</Text>
                </Layout>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        margin: 8,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOpacity: .20,
        shadowOffset: { width: 0, height: 4, },
        elevation: 4,
    },
    margin: {
        margin: 4,
    },
});