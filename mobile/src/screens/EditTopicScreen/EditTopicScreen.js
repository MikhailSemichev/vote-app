import React, { Component } from 'react';
import { Text, View, ScrollView, Button, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import * as _ from 'lodash';

import { topicsStore } from '../../stores';

@observer
export default class EditTopicScreen extends Component {
    state = {
        topic: null
    };

    componentDidMount() {
        this.loadTopic();
    }

    handleSubmit = async e => {
        e.preventDefault();
        if (!this.state.isSaving) {
            const { topic } = this.state;
            this.setState({ isSaving: true });

            try {
                await topicsStore.saveTopic({
                    id: topic.id,
                    _id: topic._id,
                    name: topic.name,
                    candidates: _.uniq(topic.candidatesText.split('\n'))
                        .filter(name => name)
                        .map(name => ({ name }))
                });
                topicsStore.loadTopics();
                this.props.navigation.goBack(null);
            } catch (err) {
                this.setState({ isSaving: false });
            }
        }
    };

    handleTopicNameChange = name => {
        this.setState({
            topic: {
                ...this.state.topic,
                name
            }
        });
    };

    handleTopicCandidatesChange = candidatesText => {
        this.setState({
            topic: {
                ...this.state.topic,
                candidatesText
            }
        });
    };

    getTopicId() {
        return this.props.navigation.state.params && this.props.navigation.state.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();
        const topic = topicId ? await topicsStore.getTopic(topicId)
            : { candidates: [] };

        topic.candidatesText = topic.candidates.map(c => c.name).join('\n');
        this.setState({
            topic: { ...topic },
            isSaving: false
        });
    }

    render() {
        const topicId = this.getTopicId();
        const { topic, isSaving } = this.state;

        return (
            <ScrollView style={styles.container}>
                {topic && <View>
                    <View>
                        <Text style={styles.fieldLabel}>Topic Name</Text>
                        <TextInput
                            name='name'
                            style={styles.fieldInput}
                            value={topic.name}
                            onChangeText={this.handleTopicNameChange}
                            placeholder="Type topic name here" />
                    </View>
                    <View>
                        <Text style={styles.fieldLabel}>Topic Candidates</Text>
                        <TextInput
                            name='candidatesText'
                            style={styles.fieldInput}
                            value={topic.candidatesText}
                            onChangeText={this.handleTopicCandidatesChange}
                            multiline={true}
                            numberOfLines={4}
                            placeholder="Type topic candidates here" />
                    </View>
                    <View style={styles.submitButton}>
                        <Button
                            title={isSaving ? 'Saving...' : 'Save'}
                            disabled={isSaving}
                            onPress={this.handleSubmit} />
                    </View>
                </View>}
                {!topic && <View>
                    <Text>Loading...</Text>
                </View>}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgb(237, 231, 246)'
    },
    fieldLabel: {
        margin: 10,
        fontSize: 24
    },
    fieldInput: {
        fontSize: 20,
        marginBottom: 10
    },
    submitButton: {
        marginTop: 30,
        marginBottom: 30
    }
});
