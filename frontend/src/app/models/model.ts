export default class Model {
  _id: number;


  public jsonFill(jsonObject: any): Model {
    for (const prop in jsonObject) {
      if (jsonObject.hasOwnProperty(prop)) {
        this[prop] = jsonObject[prop];
      }
    }
    return this;
  }
}
