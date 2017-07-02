/**
 * Created by pietler on 13.05.17.
 */
$(document).ready(() => {
    const domain = 'http://localhost:3000';

    let keyStore = new KeyManager();
    const username = 'theFirstTestUser3';
    const username2 = 'theFirstTestUser2';
    const password = 'abcdef';
    const email = 'admin@example.com';

    let token = null;

    keyStore.open().then(function () {
        getKey().then(() => {
           login();
        }).catch(() => {
            createUser();
        });
    });

    function login() {
        $.post(domain + '/api/1.0/login', {
            username: username,
            password: password
        }).then((data) => {
            token = data;
            createGroup().then((group) => {
                createSecurityNote(group).then((note) => {
                    getSecurityNote(group, note._id).then((receivedNote) => {
                        console.log(receivedNote.fields);
                    })
                });
                addUserToGroup(group, username2).then((group) => {
                    console.log(group);
                });
            });
        });
    }

    function createUser() {
        KeyManager.generateKeypair().then(function (key) {
            KeyManager.exportKey(key.publicKey).then((publicKey) => {
                $.post(domain + '/api/1.0/user', {
                    username: username,
                    password: password,
                    email: email,
                    publicKey: publicKey
                }).then(() => {
                    keyStore.saveKey(key.publicKey, key.privateKey, 'passwordManager_' + username);
                    login();
                });
            });
        });
    }

    function getKey() {
        return new Promise((fulfill, reject) => {
            keyStore.getKey('name', 'passwordManager_' + username).then((key) => {
                if(undefined === key) {
                    reject();
                } else {
                    fulfill(key);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    function createGroup() {
        return new Promise((fulfill) => {

            window.crypto.subtle.generateKey(
                {
                    name: "AES-CBC",
                    length: 256,
                },
                true,
                ["encrypt", "decrypt"]
            ).then((key) => {
                window.crypto.subtle.exportKey(
                    "raw",
                    key
                ).then(function(password){
                    getKey().then((key) => {
                        KeyManager.encrypt(key.publicKey, KeyManager.ab2str8(password)).then((encryptedPassword) => {
                            $.ajax({
                                url: domain + '/api/1.0/group',
                                type: 'post',
                                headers: {
                                    "Content-Type": 'application/json',
                                    "Authorization": 'Bearer ' + token
                                },
                                data: JSON.stringify({name: 'Testgruppe', password: KeyManager.ab2str8(encryptedPassword)}),
                                dataType: 'json',
                                success: (data) => {
                                    fulfill(data);
                                }
                            });
                        });
                    });
                })
            });
        });
    }

    function createSecurityNote(group) {
        return new Promise((fulfill) => {
            getGroupKey(group).then((password) => {
                let securityNote = {
                    name: 'Testnote',
                    fields: [
                        {
                            name: 'title',
                            fieldType: 'text',
                            value: 'My Testnote'
                        },
                        {
                            name: 'password',
                            fieldType: 'password',
                            value: 'myreallysecretPassword',
                        }
                    ]
                };

                encryptFields(password, securityNote).then(() => {
                    $.ajax({
                        url: domain + '/api/1.0/group/' + group._id + '/security-note',
                        type: 'post',
                        headers: {
                            "Content-Type": 'application/json',
                            "Authorization": 'Bearer ' + token
                        },
                        data: JSON.stringify(securityNote),
                        dataType: 'json',
                        success: (data) => {
                            fulfill(data);
                        }
                    });
                });
            });
        });
    }

    function getSecurityNote(group, noteId) {
        return new Promise((fulfill) => {
            getGroupKey(group).then((password) => {
                $.ajax({
                    url: domain + '/api/1.0/group/' + group._id + '/security-note/' + noteId,
                    type: 'get',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": 'Bearer ' + token
                    },
                    dataType: 'json',
                    success: (data) => {
                        decryptFields(password, data).then(() => {
                            fulfill(data);
                        });
                    }
                });
            });
        });
    }

    function getGroupKey(group) {
        return new Promise((fulfill) => {
            getKey().then((key) => {
                KeyManager.decrypt(key.privateKey, group.members[0].password)
                    .then((password) => {
                        KeyManager.importGroupKey(password).then(function (key) {
                            fulfill(key);
                        }).catch(function (err) {
                            console.error(err);
                        });
                    }).catch((err) => {
                        console.error(err);
                    });
            });
        });
    }

    function encryptFields(password, securityNote) {
        return new Promise((fulfill) => {
            let toBeEncrypted = 0;
            securityNote.fields.forEach((field) => {
                if(field.fieldType === 'password') {
                    toBeEncrypted++;
                    let counter = window.crypto.getRandomValues(new Uint8Array(16));
                    KeyManager.encryptField(password, field.value, counter).then((encrypted) => {
                        field.value = KeyManager.ab2str8(encrypted);
                        field.counter = KeyManager.ab2str8(counter);
                        if(--toBeEncrypted === 0) {
                            fulfill();
                        }
                    });
                }
            });
            if(toBeEncrypted === 0) {
                fulfill();
            }
        });
    }

    function decryptFields(password, securityNote) {
        return new Promise((fulfill) => {
            let toBeEncrypted = 0;
            securityNote.fields.forEach((field) => {
                if(field.fieldType === 'password') {
                    toBeEncrypted++;
                    KeyManager.decryptField(password, field.value, field.counter).then((decrypted) => {
                        field.value = KeyManager.ab2str8(decrypted);
                        if(--toBeEncrypted === 0) {
                            fulfill();
                        }
                    });
                }
            });
            if(toBeEncrypted === 0) {
                fulfill();
            }
        });
    }

    function addUserToGroup(group, username) {
        return new Promise((fulfill) => {
            getGroupKey(group).then((password) => {
                getPublicKeyOfUser(username).then((data) => {
                    const userId = data[0];
                    const key = data[1];
                    KeyManager.encrypt(key, KeyManager.ab2str8(password)).then((encryptedPassword) => {
                        $.ajax({
                            url: domain + '/api/1.0/group/' + group._id + '/member',
                            type: 'post',
                            headers: {
                                "Content-Type": 'application/json',
                                "Authorization": 'Bearer ' + token
                            },
                            data: JSON.stringify({
                                id: userId,
                                password: KeyManager.ab2str8(encryptedPassword),
                            }),
                            dataType: 'json',
                            success: (data) => {
                                fulfill(data);
                            }
                        });
                    });
                });
            });
        });
    }

    function getPublicKeyOfUser(username) {
        return new Promise((fulfill) => {
            $.ajax({
                url: domain + '/api/1.0/user/',
                type: 'get',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": 'Bearer ' + token
                },
                dataType: 'json',
                success: (data) => {
                    data.forEach((user) => {
                        if(user.username === username) {
                            $.ajax({
                                url: domain + '/api/1.0/user/' + user._id,
                                type: 'get',
                                headers: {
                                    "Content-Type": 'application/json',
                                    "Authorization": 'Bearer ' + token
                                },
                                dataType: 'json',
                                success: (data) => {
                                    KeyManager.importKey(data.publicKey).then((key) => {
                                        fulfill([user._id, key]);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
});