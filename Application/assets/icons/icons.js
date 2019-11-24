import React from 'react';
import { Image } from 'react-native';
import { Icon } from 'react-native-ui-kitten';

export const EmailIcon = (style) => (
    <Image
        style={style}
        source={require("./icons8-mail-account-64.png")}
    />
);

export const PasswordIcon = (style) => (
    <Image
        style={style}
        source={require("./icons8-key-64.png")}
    />
);

export const MenuOutline = (style) => (
    <Icon {...style} name='menu-outline' />
);

export const MoonOutline = (style) => (
    <Icon {...style} name='moon-outline' />
);

export const Moon = (style) => (
    <Icon {...style} name='moon' />
);

export const MenuIcon = (style) => (
    <Icon {...style} name='more-vertical-outline' />
);