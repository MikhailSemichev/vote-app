import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

export default function withStyles(WrappedComponent, defaultStyles, defaultProps) {
    const stylesheet = StyleSheet.create({
        defaultStyles
    });

    return class extends Component {
        render() {
            const { styles, children, ...otherProps } = this.props;

            return (
                <WrappedComponent
                    style={styles ? [stylesheet.defaultStyles, styles] : stylesheet.defaultStyles}
                    {...defaultProps}
                    {...otherProps}>
                    {children}
                </WrappedComponent>
            );
        }
    };
}
