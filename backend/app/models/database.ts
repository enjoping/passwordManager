/**
 * Created by Joe Pietler on 01.06.17.
 */

import * as bluebird from "bluebird";
import * as config from "config";
import * as mongoose from "mongoose";
import * as autoIncrement from "mongoose-auto-increment";

export class Database {
    private connection: mongoose.Connection;
    public static getInstance(): Database {
        return Database.instance;
    }

    private static instance: Database = new Database();

    constructor() {
        if (Database.instance) {
            throw new Error("Error: Instantiation failed: Use .getInstance() instead of new.");
        }
        Database.instance = this;
        this.connect(config.get("db"));
    }

    private connect(database: any) {
        this.connection = mongoose.createConnection(database);
        autoIncrement.initialize(this.connection);
        (mongoose as any).Promise = bluebird;
    }

    public getConnection() {
        return this.connection;
    }
}
