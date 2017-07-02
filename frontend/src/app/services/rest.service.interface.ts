export interface RestServiceInterface<Model> {
  single(_id: any): Promise<Model>;
  get(): Promise<Model[]>;
  post(model: Model): Promise<Model>;
  patch(model: Model): Promise<Model>;
  remove(model: Model): Promise<Object>;
}
