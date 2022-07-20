import {
  Observable,
  Subject,
  catchError,
  delay,
  map,
  of,
  Subscriber,
  tap,
  mergeMap,
} from "rxjs";
import {Response} from "./shared";

export type Notification = {
  title: string;
  content: string;
  read: boolean;
  picture?: string | null;
};

export class NotificationService {
  private notifications: Notification[] = [];
  public readonly notifications$: Observable<Notification[]>;

  /**
   * Simulate WebSocket connections
   * @private
   * @type {Subject<string>}
   * @memberof FruitService
   */
  private readonly ws: Subject<string>;

  public constructor() {
    this.ws = new Subject<string>();
    this.notifications$ = new Observable((subscriber: Subscriber<Notification[]>) => {
      subscriber.next((this.notifications = this.notifications.concat([]))); // initial value;
      this.load().subscribe(({data}) =>
        subscriber.next((this.notifications = this.notifications.concat(data))),
      );
      this.ws.pipe<Notification>(map((raw) => JSON.parse(raw))).subscribe({
        next: (message) =>
          subscriber.next((this.notifications = this.notifications.concat(message))),
        error: subscriber.error,
      });
    }).pipe(
      delay(1000),
      tap(console.log),
      catchError((error) => {
        console.log(error);
        return of<Notification[]>(this.notifications);
      }),
    );
  }

  public read(message: Notification) {
    return (message.read = true);
  }

  public readAll() {
    this.notifications.forEach((x) => (x.read = true));
    return true;
  }

  /**
   * Retrieve unread notifications
   * Note : Ceci est un Mock
   * TODO : Faire un call a l'api
   */
  private load() {
    return new Observable<Response<Notification[]>>((subsriber) => {
      subsriber.next({
        status: "success",
        data: [
          {
            title: "Bienvenu !",
            content: "Préparez votre de sac à dos pour partir en vadrouille !",
            picture: null,
            read: false,
          },
        ],
      });
      subsriber.complete();
    }).pipe(
      catchError((error, _caught) => {
        console.error(error);
        return of<Response<Notification[]>>({status: "error", data: []});
      }),
    );
  }

  public send(message: Omit<Notification, "read">): Notification {
    this.ws.next(JSON.stringify({...message, read: false}));
    return message as Notification;
  }
}

export default NotificationService;
