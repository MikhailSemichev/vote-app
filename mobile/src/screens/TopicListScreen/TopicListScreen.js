import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { topicsStore } from '../../stores';

@observer
export default class TopicListScreen extends Component {
    componentWillMount() {
        topicsStore.loadTopics();
    }

    handleNewTopic = e => {
        this.props.navigation.navigate('EditTopic');
    }

    render() {
        const { topics } = topicsStore;
        const isLoading = topics === null;
        const isEmpty = topics && !topics.length;

        return (
            <View style={styles.container}>
                <View>
                    <Button
                        title='New Topic'
                        onPress={this.handleNewTopic} />
                </View>
                {topics && topics.map(topic => (
                    <View
                        style={styles.topicItem}
                        key={topic.id}>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        <Icon name="pencil-square-o" size={25} style={styles.icon} />
                        <Icon name="times" size={25} style={styles.icon} />
                    </View>
                ))}
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)'
    },
    topicItem: {
        flexDirection: 'row'
    },
    topicName: {
        flex: 1
    },
    icon: {
        color: '#4285f4',
        marginLeft: 10
    }
});
