import { Component } from "react";

// Type definitions for react-native-button

declare module 'react-native-button' {

    type ButtonProps = {
        allowFontScaling?: boolean;
        accessibilityLabel?: string;
        containerStyle?: object;
        disabledContainerStyle?: object;
        disabled?: boolean;
        style?: object;
        styleDisabled?: object;
        childGroupStyle?: object;
    }

    export default class Button<P = {}, S = {}> extends Component<any, any> {
        constructor(props: object);
    }
}
