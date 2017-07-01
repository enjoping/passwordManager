$(document).ready(() => {
    $('#createAccount').click(() => {
        let keyStore = new KeyManager();
        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();
        if (username === '' || password === '' || email === '') {
            alert('Please fill out all fields');
            return;
        }
        keyStore.open().then(function () {
            KeyManager.generateKeypair().then(function (key) {
                KeyManager.exportKey(key.publicKey).then((publicKey) => {
                    $.post('/api/1.0/user', {
                        username: $('#username').val(),
                        password: password,
                        email: email,
                        publicKey: publicKey
                    }).then(() => {
                        keyStore.saveKey(key.publicKey, key.privateKey, 'passwordManager_' + username);
                        window.location = '/';
                    });
                });
            });
        });
    });
});
