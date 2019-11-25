import React, { Component } from 'react';
import { StyleSheet, } from 'react-native';
import { Layout, ListItem, Text, Icon, OverflowMenu, Button, TopNavigationAction } from 'react-native-ui-kitten';
import { ShareIcon } from "../assets/icons/icons.js";

/**
 * ListItemContainer - A simple list item container designed to be used within lists
 * @property {string} name - Text to be displayed (default: 'Lorem Ipsum')
 * @property {string} icon - Icon name (currently only supports names from Eva Icons Pack: https://akveo.github.io/eva-icons/#/) (default: 'list-outline')
 * @property {integer} shape - 1 for Square, 2 for Rectangle (default: 1)
 * @property {string} iconFill - Color to fill the icon (default: #8F9BB3)
 * @property {string} backgroundLevel - Sets the level value of the ui-kitten Layout component (default: '2') (see https://akveo.github.io/react-native-ui-kitten/docs/components/layout/api#layout for more details)
 * @property {GestureResponderEvent} onPress - onPress()
 * @property {integer} sizeValue - Sets the size of the container (default: 200)
 * @property {integer} marginValue - Sets the margin of the container (default: 8)
 * 
 */
export default class ListItemContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuVisible: false,
        };
    }

    menuData = [
        { title: 'Share', icon: ShareIcon },
    ];

    onMenuActionPress = () => {
        const menuVisible = !this.state.menuVisible;
        this.setState({ menuVisible });
    };

    onSelectMenuItem =() => {
        this.onMenuActionPress;
    };

    render() {
        const { name = 'Lorem Ipsum', icon = 'list-outline', shape = 1, iconFill = '#8F9BB3', backgroundLevelOuter = '2'} = this.props;
        MenuIcon = () => (
            <Icon name='more-vertical-outline' fill={iconFill} />
        );
        return (
            <Layout style={styles.outerContainer} level={backgroundLevelOuter}>
                <Layout style={styles.listItemContainer} level={backgroundLevelOuter}>
                    <ListItem style={styles.listItemContainer} title={name} onPress={this.props.onPress} />
                </Layout>
                <Layout style={styles.optionButtonContainer} level={backgroundLevelOuter}>
                    <OverflowMenu
                        style={styles.overflowMenu}
                        visible={this.state.menuVisible}
                        data={this.menuData}
                        placement='left'
                        onSelect={this.onSelectMenuItem}
                        onBackdropPress={this.onMenuActionPress}>
                        <Button
                            appearance='ghost'
                            icon={MenuIcon}
                            onPress={this.onMenuActionPress}
                        />
                    </OverflowMenu>
                </Layout>

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 4,
        shadowColor: 'black',
        shadowOpacity: .20,
        shadowOffset: { width: 0, height: 0, },
        elevation: 4,
    },
    listItemContainer: {
        flex: 1,
        borderRadius: 10,
        padding: 4,
    },
    optionButtonContainer: {
        borderRadius: 10,
    },
    overflowMenu: {
        padding: 4,
        shadowColor: 'black',
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
    },
});