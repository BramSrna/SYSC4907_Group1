import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Layout, Text, Button, } from '@ui-kitten/components';

export default class RecipesCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title = 'Title', description = 'description', imageSource = '', onPress = () => { }, onSharePress = () => { }, onDetailsPress = () => { } } = this.props;
        return (
            <Layout style={styles.cardContainer}>
                <Layout style={styles.card}>
                    <Layout>
                        <Image
                            style={styles.headerImage}
                            source={{ uri: imageSource }}
                        />
                    </Layout>
                    <Layout>
                        <Text category='h5'>{title}</Text>
                    </Layout>
                    <Layout>
                        <Text category='p1'>{description}</Text>
                    </Layout>
                    <Layout style={styles.footerContainer}>
                        <Layout style={styles.cardButtonGroup} >
                            <Button
                                style={styles.cardButtonLeft}
                                status='basic'
                                onPress={onSharePress}
                            >
                                {"SHARE"}
                            </Button>
                            <Button
                                style={styles.cardButtonRight}
                                onPress={onDetailsPress}
                            >
                                {"DETAILS"}
                            </Button>
                        </Layout>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 20,
        shadowColor: 'black',
        shadowOpacity: .80,
        shadowOffset: { width: 0, height: 0, },
        backgroundColor: "#0000",
        elevation: 6,
    },
    card: {
        flex: 1,
        borderRadius: 20,
    },
    headerImage: {
        flex: 1,
        height: 300,
    },
    footerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    cardButtonLeft: {
        flex: 1,
        padding: 8,
        marginRight: 4,
    },
    cardButtonRight: {
        flex: 1,
        padding: 8,
        marginLeft: 4,
    },
});