import { observable, action, computed } from 'mobx';

class LoginStore {
    @observable userInfo = this.getUserInfo();

    getUserInfo() {
        const login = localStorage.getItem('LOGIN');
        const adminPassword = localStorage.getItem('ADMIN_PASSWORD');

        return login ? { login, adminPassword } : null;
    }

    @computed
    get isLoggedIn() {
        return !!this.userInfo;
    }

    @action
    setLogin(login, adminPassword) {
        this.userInfo = { login, adminPassword };
        localStorage.setItem('LOGIN', login);
        localStorage.setItem('ADMIN_PASSWORD', adminPassword);
    }

    @action
    logOff() {
        this.userInfo = null;
        localStorage.removeItem('LOGIN');
        localStorage.removeItem('ADMIN_PASSWORD');
    }
}

export default new LoginStore();
