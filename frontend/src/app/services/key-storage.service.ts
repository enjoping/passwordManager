import {Injectable} from '@angular/core';
import {EventService} from './event/event.service';
import {SecurityNoteRepositoryService} from './repositories/security-note-repository.service';
import SecurityNote from '../models/security-note.model';

@Injectable()
export class KeyStorageService {

  private db = null;
  private dbName = 'KeyStore';
  private objectStoreName = 'keys';

  constructor(private eventService: EventService) {
    if (!window.crypto || !window.crypto.subtle) {
      alert('Your current browser does not support the Web Cryptography API! This page will not work.');
      return;
    }
    if (!window.indexedDB) {
      alert('IndexedDB is not supported by this browser.');
    }
  }

  open() {
    const that = this;
    return new Promise((fulfill, reject) => {
      const req = indexedDB.open(that.dbName, 1);
      req.onsuccess = (evt: any) => {
        that.db = evt.target.result;
        this.eventService.log('keyStorage opened');
        fulfill();
      };
      req.onerror = function (evt: any) {
        reject(evt.error);
      };
      req.onblocked = function () {
        reject(new Error('Database already open'));
      };

      // If the database is being created or upgraded to a new version,
      // see if the object store and its indexes need to be created.
      req.onupgradeneeded = function(evt: any) {
        that.db = evt.target.result;
        if (!that.db.objectStoreNames.contains(that.objectStoreName)) {
          const objStore = that.db.createObjectStore(that.objectStoreName, {autoIncrement: true});
          objStore.createIndex('name', 'name', {unique: false});
          objStore.createIndex('spki', 'spki', {unique: false});
        }
      };
    });
  }

  encryptSecurityNoteFields(groupKey: any, securityNote: SecurityNote) {
    return new Promise((fulfill) => {
      let toBeEncrypted = 0;
      securityNote.fields.forEach((field) => {
        if (field.fieldType === 'password') {
          toBeEncrypted++;
          const counter = window.crypto.getRandomValues(new Uint8Array(16));

          this.encryptField(groupKey, field.value, counter)
            .then((encrypted) => {
              field.value = this.ab2str8(encrypted);
              field.counter = this.ab2str8(counter);
              if (--toBeEncrypted === 0) {
                fulfill(securityNote);
              }
            });
        }
      });
      if (toBeEncrypted === 0) {
        fulfill(securityNote);
      }
    });
  }

  saveKey(publicKey, privateKey, name) {
    return new Promise((fulfill, reject) => {
      window.crypto.subtle.exportKey('spki', publicKey).then((spki) => {

        const savedObject = {
          publicKey: publicKey,
          privateKey: privateKey,
          name: name,
          spki: spki
        };

        this.eventService.log(savedObject);

        const transaction = this.getTransaction(
          () => {
            fulfill();
          },
          (evt) => {
            console.log(evt, evt.error);
            reject(evt.error);
          });
        const objectStore = transaction.objectStore(this.objectStoreName);
        objectStore.add(savedObject);

      }, (error) => {
        reject(error);
      });
    });
  }

  getGroupKey(group, username): Promise<any> {
    return this.getKey('name', 'passwordManager_' + username)
      .then((keyPair) => {
        return this.decrypt(keyPair.privateKey, group.members[0].password);
      })
      .then((password) => {
        return this.importGroupKey(password);
      });
  }

  getKey(propertyName, propertyValue): Promise<any> {
    const that = this;
    return new Promise(function (fulfill, reject) {
      let request;
      const transaction = that.getTransaction(() => {
        fulfill();
      }, (evt) => {
        reject(evt.error);
      });
      const objectStore = transaction.objectStore(that.objectStoreName);
      if (propertyName === 'id') {
        request = objectStore.get(propertyValue);
      } else if (propertyName === 'name') {
        request = objectStore.index('name').get(propertyValue);
      } else if (propertyName === 'spki') {
        request = objectStore.index('spki').get(propertyValue);
      } else {
        reject(new Error('No such property: ' + propertyName));
      }

      request.onsuccess = function (evt) {
        fulfill(evt.target.result);
      };

      request.onerror = function (evt) {
        reject(evt.target.error);
      };
    });
  }

  listKeys() {
    const that = this;
    return new Promise(function (fulfill, reject) {

      const list = [];
      const transaction = that.getTransaction(() => {
        fulfill();
      }, (evt) => {
        reject(evt.error);
      });

      const objectStore = transaction.objectStore(that.objectStoreName);
      const cursor = objectStore.openCursor();

      cursor.onsuccess = (evt) => {
        if (evt.target.result) {
          list.push({id: evt.target.result.key, value: evt.target.result.value});
          evt.target.result.continue();
        } else {
          fulfill(list);
        }
      };
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
    const transaction = this.db.transaction([this.objectStoreName], 'readwrite');
    transaction.onerror = error;
    transaction.onabort = error;
    transaction.oncomplete = complete;
    return transaction;
  }

  encrypt(publicKey, string) {
    return window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      this.str2ab(string)
    );
  }

  decrypt(privateKey, data) {
    return window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      this.str2ab8(data)
    );
  }

  encryptField(key, password, counter) {
    return window.crypto.subtle.encrypt(
      {
        name: 'AES-CTR',
        counter: counter,
        length: 128,
      },
      key,
      this.str2ab(password)
    );
  }

  decryptField(key, password, counter) {
    return window.crypto.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: this.str2ab8(counter),
        length: 128,
      },
      key,
      this.str2ab8(password)
    );
  }

  generateKeypair(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        window.crypto.subtle.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: 'SHA-256'},
          },
          true,
          ['encrypt', 'decrypt']
        ).then(
          (success) => {
            resolve(success);
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  generateGroupKeyPair(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        window.crypto.subtle.generateKey({
            name: 'AES-CBC',
            length: 256,
          }, true, ['encrypt', 'decrypt'])
          .then(
            (key) => {
              resolve(key);
            },
            (error) => {
              reject(error);
          });
      }
    );
  }

  importGroupKey(password) {
    password = this.str2ab8(this.ab2str(password));
    return window.crypto.subtle.importKey(
      'raw',
      password,
      {
        name: 'AES-CTR',
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  str2ab(str) {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  str2ab8(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  ab2str8(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  key2spki(key) {
    return new Promise((fulfill) => {
      window.crypto.subtle.exportKey('spki', key).then((data) => {
        fulfill(data);
      });
    });
  }

  exportKey(key) {
    return new Promise((fulfill) => {
      this.key2spki(key).then((spki) => {
        fulfill(this.ab2str8(spki));
      });
    });
  }

  exportRawKey(key) {
    return new Promise(
      (resolve, reject) => {
        window.crypto.subtle.exportKey('raw', key)
          .then(
            exportedKey => resolve(exportedKey),
            error => reject(error)
          );
      }
    );
  }

  spki2key(spki) {
    return new Promise((fulfill) => {
      window.crypto.subtle.importKey(
        'spki',
        this.str2ab8(spki),
        {
          name: 'RSA-OAEP',
          hash: {name: 'SHA-256'},
        },
        false,
        ['encrypt']
      ).then((data) => {
        fulfill(data);
      });
    });
  }

  importKey(spki) {
    return new Promise((fulfill) => {
      this.spki2key(spki).then((key) => {
        fulfill(key);
      });
    });
  }
}
