import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {RestServiceInterface} from './rest.service.interface';
import Model from '../models/model';
import Note from '../models/note.model';
import {Http} from '@angular/http';

@Injectable()
export class NoteService implements RestServiceInterface<Note> {

  private route: string;

  constructor(private http: Http) {
    this.route = environment.apiEndpoint + '/note';
  }

  single(_id: number): Promise<Model> {
    return this.http.get(this.route + '/' + _id)
      .map((response) => {
        return new Note().jsonFill(response);
      })
      .toPromise();
  }

  public get(): Promise<Note[]> {
    return this.http.get(this.route)
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
          return new Note().jsonFill(row);
        });
      })
      .toPromise();
  }

  public post(note: Note): Promise<Note> {
    return this.http.post(this.route, note)
      .map((response) => {
        return new Note().jsonFill(response);
      })
      .toPromise();
  }

  public remove(note: Note): Promise<Object> {
    return this.http.delete(this.route + '/' + note._id)
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(note: Note): Promise<Note> {
    return this.http.patch(this.route + '/' + note._id, note)
      .map((response) => {
        return new Note().jsonFill(response);
      })
      .toPromise();
  }

}
