/**
 * Created by Joe Pietler on 01.06.17.
 */

import * as mongoose from "mongoose";
import * as bluebird from "bluebird";

export class Database {
    public static getInstance(): Database {
        return Database.instance;
    }

    private static instance: Database = new Database();

    constructor() {
        if (Database.instance) {
            throw new Error("Error: Instantiation failed: Use .getInstance() instead of new.");
        }
        Database.instance = this;
    }

    public connect(database: any) {
        mongoose.connect(database);
        (mongoose as any).Promise = bluebird;
    }
}
