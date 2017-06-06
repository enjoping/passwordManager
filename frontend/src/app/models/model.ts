export default class Model {
  _id: number;

  constructor(jsonObject?: any) {
    if (jsonObject) {
      this.jsonFill(jsonObject);
    }
  }

  public jsonFill(jsonObject: any): Model {
    for (const prop in jsonObject) {
      if (jsonObject.hasOwnProperty(prop)) {
        this[prop] = jsonObject[prop];
      }
    }
    return this;
  }
}
