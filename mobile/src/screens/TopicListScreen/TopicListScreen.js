import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

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
            <View>
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
                        <Text>Edit</Text>
                        <Text>Delete</Text>
                    </View>
                ))}
            </View>
        )
    };
}

const styles = StyleSheet.create({
    topicItem: {
        flexDirection: 'row'
    },
    topicName: {
        flex: 1
    }
});
