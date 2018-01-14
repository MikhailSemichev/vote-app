import { observable, action, computed, runInAction } from 'mobx';
import { AsyncStorage } from 'react-native';

class LoginStore {
    @observable login = null;

    constructor() {
        this.getLogin().then(login => {
            runInAction(() => {
                this.login = login;
            });
        });
    }

    async getLogin() {
        try {
            return await AsyncStorage.getItem('LOGIN');
        } catch (ex) {
            return null;
        }
    }

    @computed
    get isLoggedIn() {
        return !!this.login;
    }

    @action
    setLogin(login) {
        this.login = login;
        return AsyncStorage.setItem('LOGIN', login);
    }

    @action
    logOff() {
        this.login = null;
        return AsyncStorage.removeItem('LOGIN');
    }
}

export default new LoginStore();
