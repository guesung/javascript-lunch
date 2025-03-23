import { forEach } from '@fxts/core';

interface EventCallbackProps {
  event: WindowEventMap[keyof WindowEventMap];
  target: HTMLElement;
  currentTarget: HTMLElement;
}

interface AddEventListenerProps {
  eventType: keyof WindowEventMap;
  dataAction: string;
  callback: (props: EventCallbackProps) => void;
}

export class EventHandler {
  #events = new Map<keyof WindowEventMap, { dataAction: string; callback: (props: EventCallbackProps) => void }[]>();

  addEventListener({ eventType, callback, dataAction }: AddEventListenerProps) {
    const value = this.#events.get(eventType);

    this.#events.set(
      eventType,
      value
        ? [
            ...value,
            {
              callback,
              dataAction,
            },
          ]
        : [
            {
              callback,
              dataAction,
            },
          ],
    );
  }

  attachEventListener() {
    for (const [eventType, eventActions] of this.#events) {
      window.addEventListener(eventType, (event) => {
        forEach(({ callback, dataAction }) => {
          const target = event.target as HTMLElement;
          const currentTarget = target.closest(`[data-action="${dataAction}"]`) as HTMLElement;

          if (!currentTarget) return;

          callback({ event, target, currentTarget });

          event.stopImmediatePropagation();
          event.stopPropagation();
        }, eventActions);
      });
    }
  }
}

const eventHandlerInstance = new EventHandler();
export default eventHandlerInstance;
