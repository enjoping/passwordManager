import { async, inject, TestBed } from '@angular/core/testing';
import EventService from './event.service';
import { EventReceiver } from './event-receiver.interface';

class FakeEventReceiver implements EventReceiver {
  onEventReceived(source, key, value) {
    expect(key).toEqual('fake-key');
  }
}

class RealEventReceiver implements EventReceiver {
  onEventReceived(source, key, value) {
    expect(key).not.toEqual('real-key');
  }
}

describe('EventService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService
      ]
    });
  }));

  it('should inject the service', inject([ EventService ], (eventService: EventService) => {
    expect(eventService).toBeDefined();
  }));

  it('should call the event receivers', async(inject([ EventService ], (eventService: EventService) => {
    const fakeEventReceiver = new FakeEventReceiver();
    eventService.subscribe(fakeEventReceiver);

    const realEventReceiver = new RealEventReceiver();
    eventService.subscribe(realEventReceiver);

    eventService.inform(this, 'fake-key', 'fake information');
  })));
});
