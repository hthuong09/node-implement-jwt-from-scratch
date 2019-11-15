const accounts = [];
let accountId = 1;

const add = (username, password) => {
    const isExist = accounts.find(account => account.username === username) !== undefined;
    if (isExist) {
        // Should let user know account was exist here actually
        return false;
    }
    accounts.push({
        id: accountId++,
        username,
        password,
    });
    return true;
}

const find = (username, password) => {
    return accounts.find(account => account.username === username && account.password === password);
}

module.exports = {
    add,
    find
}
