import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

export default class LoginScreen extends Component {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>It's Login Screen!</Text>
                <Button
                    title="Go to Topic List"
                    onPress={() =>
                        navigate('TopicList')
                    }
                />
            </View>
        );
    }
}
