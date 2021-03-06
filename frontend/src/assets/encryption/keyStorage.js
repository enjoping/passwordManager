class KeyManager {
    constructor() {
        if (!window.crypto || !window.crypto.subtle) {
            alert("Your current browser does not support the Web Cryptography API! This page will not work.");
            return;
        }
        if (!window.indexedDB) {
            alert("IndexedDB is not supported by this browser.");
        }
        this.db = null;
        this.dbName = "KeyStore";
        this.objectStoreName = "keys";
    }

    open() {
        const that = this;
        return new Promise(function (fulfill, reject) {
            const req = indexedDB.open(that.dbName, 1);
            req.onsuccess = function (evt) {
                that.db = evt.target.result;
                fulfill();
            };
            req.onerror = function (evt) {
                reject(evt.error);
            };
            req.onblocked = function () {
                reject(new Error("Database already open"));
            };

            // If the database is being created or upgraded to a new version,
            // see if the object store and its indexes need to be created.
            req.onupgradeneeded = function (evt) {
                that.db = evt.target.result;
                if (!that.db.objectStoreNames.contains(that.objectStoreName)) {
                    const objStore = that.db.createObjectStore(that.objectStoreName, {autoIncrement: true});
                    objStore.createIndex("name", "name", {unique: false});
                    objStore.createIndex("spki", "spki", {unique: false});
                }
            };
        });
    };

    saveKey(publicKey, privateKey, name) {
        const that = this;
        return new Promise(function (fulfill, reject) {
            window.crypto.subtle.exportKey('spki', publicKey).then((spki) => {
                const savedObject = {
                    publicKey: publicKey,
                    privateKey: privateKey,
                    name: name,
                    spki: spki
                };

                const transaction = that.getTransaction(() => {}, (evt) => {
                    reject(evt.error);
                });
                const objectStore = transaction.objectStore(that.objectStoreName);
                objectStore.add(savedObject);
                fulfill();
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    getKey(propertyName, propertyValue) {
        const that = this;
        return new Promise(function (fulfill, reject) {
            let request;
            const transaction = that.getTransaction(() => {
                fulfill();
            }, (evt) => {
                reject(evt.error);
            });
            const objectStore = transaction.objectStore(that.objectStoreName);
            if (propertyName === "id") {
                request = objectStore.get(propertyValue);
            } else if (propertyName === "name") {
                request = objectStore.index("name").get(propertyValue);
            } else if (propertyName === "spki") {
                request = objectStore.index("spki").get(propertyValue);
            } else {
                reject(new Error("No such property: " + propertyName));
            }

            request.onsuccess = function (evt) {
                fulfill(evt.target.result);
            };

            request.onerror = function (evt) {
                reject(evt.target.error);
            };
        });
    };

    listKeys() {
        const that = this;
        return new Promise(function (fulfill, reject) {

            let list = [];
            const transaction = that.getTransaction(() => {
                fulfill();
            }, (evt) => {
                reject(evt.error);
            });
            const objectStore = transaction.objectStore(that.objectStoreName);
            const cursor = objectStore.openCursor();

            cursor.onsuccess = function (evt) {
                if (evt.target.result) {
                    list.push({id: evt.target.result.key, value: evt.target.result.value});
                    evt.target.result.continue();
                } else {
                    fulfill(list);
                }
            }
        });
    };

    close() {
        const that = this;
        return new Promise(function (fulfill, reject) {
            that.db.close();
            that.db = null;
            fulfill();
        });
    };

    getTransaction(complete, error) {
        let transaction = this.db.transaction([this.objectStoreName], "readwrite");
        transaction.onerror = error;
        transaction.onabort = error;
        transaction.oncomplete = complete;
        return transaction;
    }

    static encrypt(publicKey, string) {
        return window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            publicKey,
            KeyManager.str2ab(string)
        )
    }

    static decrypt(privateKey, data) {
        return window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            KeyManager.str2ab8(data)
        );
    }

    static encryptField(key, password, counter) {
        return window.crypto.subtle.encrypt(
            {
                name: "AES-CTR",
                counter: counter,
                length: 128,
            },
            key,
            KeyManager.str2ab(password)
        );
    }

    static decryptField(key, password, counter) {
        return window.crypto.subtle.decrypt(
            {
                name: "AES-CTR",
                counter: KeyManager.str2ab8(counter),
                length: 128,
            },
            key,
            KeyManager.str2ab8(password)
        );
    }

    static generateKeypair() {
        return window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {name: "SHA-256"},
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static importGroupKey(password) {
        password = KeyManager.str2ab8(KeyManager.ab2str(password));
        return window.crypto.subtle.importKey(
            "raw",
            password,
            {
                name: "AES-CTR",
            },
            false,
            ["encrypt", "decrypt"]
        );
    }

    static str2ab(str) {
        let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        let bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    static str2ab8(str) {
        let buf = new ArrayBuffer(str.length);
        let bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    static ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    static ab2str8(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    static key2spki(key) {
        return new Promise((fulfill) => {
            window.crypto.subtle.exportKey('spki', key).then((data) => {
                fulfill(data);
            });
        });
    }

    static exportKey(key) {
        return new Promise((fulfill) => {
            KeyManager.key2spki(key).then((spki) => {
                fulfill(KeyManager.ab2str8(spki));
            });
        });

    }

    static spki2key(spki) {
        return new Promise((fulfill) => {
            window.crypto.subtle.importKey(
                "spki",
                KeyManager.str2ab8(spki),
                {
                    name: "RSA-OAEP",
                    hash: {name: "SHA-256"},
                },
                false,
                ["encrypt"]
            ).then((data) => {
                fulfill(data);
            });
        });
    }

    static importKey(spki) {
        return new Promise((fulfill) => {
            KeyManager.spki2key(spki).then((key) => {
                fulfill(key);
            });
        });
    }

    static test() {
      return "TestCall";
    }
}
