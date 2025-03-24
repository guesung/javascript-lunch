import { forEach } from '@fxts/core';

interface EventCallbackProps {
  event: WindowEventMap[keyof WindowEventMap];
  target: HTMLElement;
  currentTarget: HTMLElement;
}

interface AddEventListenerProps {
  eventType: keyof WindowEventMap;
  callback: (props: EventCallbackProps) => void;
  dataAction: string;
  notTriggerDataAction?: string;
}

export class EventHandler {
  #events = new Map<
    keyof WindowEventMap,
    { dataAction: string; callback: (props: EventCallbackProps) => void; notTriggerDataAction?: string }[]
  >();

  addEventListener({ eventType, callback, dataAction, notTriggerDataAction }: AddEventListenerProps) {
    const value = this.#events.get(eventType);

    this.#events.set(
      eventType,
      value
        ? [
            ...value,
            {
              callback,
              dataAction,
              notTriggerDataAction,
            },
          ]
        : [
            {
              callback,
              dataAction,
              notTriggerDataAction,
            },
          ],
    );
  }

  attachEventListener() {
    for (const [eventType, eventActions] of this.#events) {
      window.addEventListener(eventType, (event) => {
        forEach(({ callback, dataAction, notTriggerDataAction }) => {
          const target = event.target as HTMLElement;
          const currentTarget = target.closest(`[data-action="${dataAction}"]`) as HTMLElement;
          const isNotTriggerTarget = target.closest(`[data-action="${notTriggerDataAction}"]`) as HTMLElement;

          if (!currentTarget || isNotTriggerTarget) return;

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
