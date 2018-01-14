import React from 'react';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import TopicListScreen from './src/screens/TopicListScreen/TopicListScreen';
import EditTopicScreen from './src/screens/EditTopicScreen/EditTopicScreen';
import VoteScreen from './src/screens/VoteScreen/VoteScreen';
import Header from './src/components/Header';

const header = (props) => (<Header {...props} />);

const RootNavigator = StackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            header
        }
    },
    TopicList: {
        screen: TopicListScreen,
        navigationOptions: {
            headerTitle: '!!!!!',
            header
        }
    },
    EditTopic: {
        screen: EditTopicScreen,
        path: 'topic/:topicId',
        navigationOptions: {
            header
        }
    },
    Vote: {
        screen: VoteScreen,
        path: 'vote/:topicId',
        navigationOptions: {
            header
        }
    }
});

export default RootNavigator;
