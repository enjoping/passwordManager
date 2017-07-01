import {
  async, inject, TestBed
} from '@angular/core/testing';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import {
  HttpModule, Http, XHRBackend, Response, ResponseOptions
} from '@angular/http';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import Invite from '../models/invite.model';
import { RegisterService } from './register.service';

function makeInvite(): Invite {
  let fakeInvite = new Invite();
  fakeInvite._id = 1;
  fakeInvite.email = 'Test@invite.com';
  fakeInvite.inviteToken = '123abc';
  fakeInvite.creationDate = new Date("December 17, 1995 03:24:00");
  return fakeInvite;
}
////////  Tests  /////////////
describe('Register (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        RegisterService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    })
      .compileComponents();
  }));


  it('can instantiate service when inject service',
    inject([RegisterService], (service: RegisterService) => {
      expect(service instanceof RegisterService).toBe(true);
    }));


  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new RegisterService(http);
    expect(service instanceof RegisterService).toBe(true, 'new service should be ok');
  }));


  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
    }));

  describe('when single(\'validToken\')', () => {
    let backend: MockBackend;
    let service: RegisterService;
    let fakeInvite: Invite;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new RegisterService(http);
      fakeInvite = makeInvite();
      let options = new ResponseOptions({status: 200, body: {data: fakeInvite}});
      response = new Response(options);
    }));

    it('should have expected fake Invite (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.single('123abc')
      // .then(() => Promise.reject('deliberate'))
        .then((recv_invite) => {
          const invite: Invite = recv_invite;
          const obj = invite._body.data;
          expect(obj._id).toBe(fakeInvite._id,
            'should have expected id');
          expect(obj.email).toBe(fakeInvite.email,
            'should have expected email');
          expect(obj.inviteToken).toBe(fakeInvite.inviteToken,
            'should have expected invite token');
          expect(obj.creationDate).toBe(fakeInvite.creationDate,
            'should have expected creation date');
        });
    })));
  });

  describe('when single(\'invalidToken\')', () => {
    let backend: MockBackend;
    let service: RegisterService;
    let fakeInvite: Invite;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new RegisterService(http);
      fakeInvite = makeInvite();
      let options = new ResponseOptions({status: 400, body: {"error":
        "There is no invite with the given invite token in the database!" }});
      response = new Response(options);
    }));

    it('should be OK returning error when called with invalid token', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.single('321cba')
        .then((recv_invite) => {
          const invite: Invite = recv_invite;
          const obj = invite._body.data;
          expect(obj._id).toBe(fakeInvite._id,
            'should have expected id');
        })
        .catch((err) => {
          // console.log(err);
          expect(err).toMatch('TypeError: ', ' Cannot read property \'_id\' of undefined');
        });
    })));
  });
});

