import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import TopicListScreen from './src/screens/TopicListScreen/TopicListScreen';
import EditTopicScreen from './src/screens/EditTopicScreen/EditTopicScreen';
import VoteScreen from './src/screens/VoteScreen/VoteScreen';

const headerStyles = {
    headerStyle: {
        backgroundColor: 'rgb(103, 58, 183)'
    },
    headerTintColor: '#ffffff'
};

const RootNavigator = StackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerTitle: 'Login',
            ...headerStyles
        }
    },
    TopicList: {
        screen: TopicListScreen,
        navigationOptions: {
            headerTitle: 'Topic List',
            ...headerStyles
        }
    },
    EditTopic: {
        screen: EditTopicScreen,
        path: 'topic/:topicId',
        navigationOptions: {
            headerTitle: 'Edit Topic',
            ...headerStyles
        }
    },
    Vote: {
        screen: VoteScreen,
        path: 'vote/:topicId',
        navigationOptions: {
            headerTitle: 'Vote',
            ...headerStyles
        }
    }
});

export default RootNavigator;
