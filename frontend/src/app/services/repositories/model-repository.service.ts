import Model from '../../models/model';
import {RestServiceInterface} from '../rest.service.interface';
import Group from '../../models/group.model';

/**
 * Our generic repository service. We can implement concrete Repositories by extending a
 * typed instance of this service.
 */
export class ModelRepositoryService<T extends Model> {

  public models: T[] = [ ];

  constructor(private restService: RestServiceInterface<T>) {
    this.loadModels();
  }

  // TODO: save method

  private loadModels() {
    this.restService.get()
      .then((models: T[]) => {
        this.models = models;
        this.models.forEach(model => this.loadAdditionalModelInformation(model));
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  public saveModel(model: T): Promise<T> {
    if (model._created) {
      const index = this.models.findIndex(row => row._id === model._id);
      if (index !== -1) {
        this.models[index] = model;
      }
    } else {
      this.models.push(model);
    }

    this.loadAdditionalModelInformation(model);

    // TODO: implement API as soon as endpoint is working.

    return Promise.resolve(model);

    // const promise =
    //   (model._created)
    //     ? this.restService.patch(model)
    //     : this.restService.post(model);
    //
    // return promise;
  }

  public createModel() {
    throw new Error('Model cannot be created. Functions needs to be overriden.');
  }

  public addModels(models: T[]) {
    models.forEach((model) => {
      this.loadAdditionalModelInformation(model);
      this.models.push(model);
    });
  }

  protected loadAdditionalModelInformation(model: T) { }

  /**
   * Returns a single model with the specified id.
   *
   * @param _id
   * @returns {Promise<T>}
   */
  get(_id: number): Promise<T> {
    return new Promise(
      (resolve, reject) => {
        const model = this.models.find(row => row._id === _id);

        if (!model) {
          // There is no group with this id.
          reject();
        } else {
          // We found the group.
          resolve(model);
        }
      }
    );
  }

  /**
   * Returns all models that are in this repository.
   *
   * @returns {Promise<any[]>}
   */
  public all(): Promise<T[]> {
    return Promise.resolve(this.models);
  }

  /**
   * Filters all available models by applying a filtering function.
   * The filtering function will be passed to the {@link Array.filter} method.
   *
   * @param callable
   *
   * @returns {Promise<any[]>}
   */
  public filter(callable: (value: any) => boolean): Promise<T[]> {
    return Promise.resolve(this.models.filter(callable));
  }
}
