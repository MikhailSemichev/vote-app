import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class App extends React.Component {
    state = { done: false };

    onPress = () => {
        debugger;
        this.setState({ done: !this.state.done });
    };

    render() {
        const { done } = this.state;
        const style = {
            fontSize: 40,
            color: done ? 'blue' : 'red',
            textDecorationLine: 'underline'
        };

        return (
            <View style={styles.container}>
                <Text>Changes you make will automatically reload.</Text>
                <Text>Shake your phone to open the developer menu.</Text>
                <Text
                    style={style}
                    onPress={this.onPress}>yyyy</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
