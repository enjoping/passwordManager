import {Injectable} from '@angular/core';
import {EventReceiver} from './event-receiver.interface';


/**
 * Handles all events that could be emitted by our application.
 *
 * Informs subscribed components
 * on a status change. I.E to inform a user about a successful upload.
 *
 * Works by utilizing the observer pattern.
 * EventReceivers can subscribe on the event service and they will be informed as soon as an event is omitted.
 *
 */
@Injectable()
export default class EventService {

  /**
   * A list of a all event receivers.
   *
   * @type {Array}
   */
  private eventReceivers: EventReceiver[] = [ ];

  subscribe(eventReceiver: EventReceiver): void {
    this.eventReceivers.push(eventReceiver);
  }

  unsubscribe(eventReceiver: EventReceiver): void {
    const index = this.eventReceivers.indexOf(eventReceiver);
    if (index > -1) {
      this.eventReceivers.splice(index, 1);
    }
  }

  /**
   * Informs all subscribed components about a status change.
   * I.E. by displaying the change to the user.
   *
   * This method will be called by the service/component where the event happens.
   *
   * The event information will not be persisted. It will just be send to
   * all receivers.
   *
   * @param source
   * @param key
   * @param information
   */
  inform(source: any, key: string, information): void {
    this.eventReceivers.forEach((eventReceiver) => {
      // Inform each event receiver about the event.
      eventReceiver.onEventReceived(source, key, information);
    });
  }
}
