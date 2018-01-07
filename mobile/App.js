import { StackNavigator } from 'react-navigation';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import TopicListScreen from './src/screens/TopicListScreen/TopicListScreen';
import EditTopicScreen from './src/screens/EditTopicScreen/EditTopicScreen';

const RootNavigator = StackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerTitle: 'Login'
        }
    },
    TopicList: {
        screen: TopicListScreen,
        navigationOptions: {
            headerTitle: 'Topic List'
        }
    },
    EditTopic: {
        screen: EditTopicScreen,
        navigationOptions: {
            headerTitle: 'Edit Topic'
        }
    }
});

export default RootNavigator;
