import Model from '../../models/model';
import { RestServiceInterface } from '../rest.service.interface';
import { LoginService } from '../login.service';
import { EventService } from '../event/event.service';

/**
 * Our generic repository service. We can implement concrete Repositories by extending a
 * typed instance of this service.
 */
export class ModelRepositoryService<T extends Model> {

  public models: T[] = [ ];

  constructor(private restService: RestServiceInterface<T>,
              private eventService: EventService,
              private loginService: LoginService) { }

  loadModels(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.restService.get()
          .then((models: T[]) => {
            this.models = models;

            // Build a promise chain.
            const promises = [ ];

            this.models.forEach(model => {
              this.eventService.log(model);
              promises.push(this.loadAdditionalModelInformation(model));
            });

            Promise.all(promises)
              .then(() => {
                  resolve();
              });
          })
          .catch((error) => {
            if (error.status === 401) {
              // Unauthorized.
              this.loginService.accessTokenNotValid();
            }

            reject();
          });
      }
    );
  }

  public saveModel(model: T): Promise<T> {
    return new Promise(
      (resolve, reject) => {
        const promise =
          (model._created)
            ? this.restService.patch(model)
            : this.restService.post(model);

        promise
          .then((result) => {
            this.eventService.log(result);
            if (model._created) {
              const index = this.models.findIndex(row => row._id === model._id);
              if (index !== -1) {
                this.models[index] = model;
              }
            } else {
              model._created = true;
              // TODO this doesn't assign the backend id to model id...
              model._id = result._id;
              const body = result.toString();
              console.log('Model id ' + model._id + ' Result id ' + result._id);
              this.models.push(model);
            }

            this.loadAdditionalModelInformation(model);
            resolve(model);
          })
          .catch((error) => {
            if (error.status === 401) {
              // Unauthorized.
              this.loginService.accessTokenNotValid();
            }

            this.eventService.log(error);
            reject();
          });
      }
    );
  }

  public createModel(): T {
    throw new Error('Model cannot be created. Functions needs to be overriden.');
  }

  public addModels(models: T[]) {
    models.forEach((model) => {
      this.loadAdditionalModelInformation(model);
      this.models.push(model);
    });
  }

  protected loadAdditionalModelInformation(model: T): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Returns a single model with the specified id or token.
   *
   * @param _id
   * @returns {Promise<T>}
   */
  get(_id: any): Promise<T> {
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
    return new Promise(
      (resolve, reject) => {
        this.loadModels()
          .then(() => {
            resolve(this.models);
          });
      }
    );
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

  public deleteModel(model: T) {
    this.restService.remove(model)
      .then((result) => {
        const index = this.models.findIndex(row => row._id === model._id);
        if (index !== -1) {
          this.models.splice(index, 1);
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          // Unauthorized.
          this.loginService.accessTokenNotValid();
        }
      });
  }
}
