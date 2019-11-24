import React, { Component } from 'react';
import { StyleSheet, Dimensions, } from 'react-native';
import { mapping, } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Layout, Text, Icon, Button } from 'react-native-ui-kitten';

const GRID_SHAPE = 2;
const MARGIN_RATIO = 30;

const { width } = Dimensions.get("window");

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
    marginValue = calcMarginValue(width, GRID_SHAPE);
    sizeValue = calcSizeValue(width, GRID_SHAPE);
    render() {
        const { name = 'Button', icon = 'list-outline', sizeVal = 1, iconFill = '#3366FF', backgroundLevel = '2' } = this.props;
        return (
            <Layout style={[styles.container, { width: sizeVal == 1 ? sizeValue : (sizeValue * 2) + marginValue * 2, height: sizeValue, margin: marginValue }]} level={backgroundLevel}>
                <Icon style={styles.margin} name={icon} width={sizeValue * .25} height={sizeValue * .25} fill={iconFill} />
                <Text style={styles.margin} category='h6' appearance='default'>{name}</Text>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        margin: 8,
        height: 200,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOpacity: .5,
        elevation: 10,
    },
    margin: {
        margin: 4,
    },
});