export interface RestInterface<Model> {
  single(_id: number): Promise<Model>;
  get(): Promise<Model[]>;
  post(model: Model): Promise<Model>;
  patch(model: Model): Promise<Model>;
  remove(model: Model): Promise<Object>;
}
