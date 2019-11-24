import React, { Component } from 'react';
import { StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { Layout, Text, Icon, Button } from 'react-native-ui-kitten';

const GRID_SHAPE = 2;
const MARGIN_RATIO = 30;

const {width, height} = Dimensions.get("window");

const calcMarginValue = (deviceWidth, tpr) => {
    marginValue = deviceWidth / (tpr * MARGIN_RATIO);
    return marginValue;
};

const calcSizeValue = (deviceWidth, tpr) => {
    marginValue = deviceWidth / (tpr * MARGIN_RATIO);
    sizeValue = (deviceWidth - marginValue * (tpr * 2)) / tpr;
    return sizeValue;
};
export default class HomeSquareContainer extends Component {
    render() {
        marginValue = calcMarginValue(width, GRID_SHAPE);
        sizeValue = calcSizeValue(width, GRID_SHAPE);
        const { name = 'Button', icon = 'list-outline', sizeVal = 1, iconFill = '#8F9BB3', backgroundLevel = '2', onPress = () => { } } = this.props;
        return (
            <TouchableHighlight style={[styles.outerContainer, { width: sizeVal == 1 ? sizeValue : (sizeValue * 2) + marginValue * 2, height: sizeValue, margin: marginValue }]} onPress={onPress}>
                <Layout style={[styles.container, { width: sizeVal == 1 ? sizeValue : (sizeValue * 2) + marginValue * 2, height: sizeValue, margin: marginValue }]} level={backgroundLevel}>
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