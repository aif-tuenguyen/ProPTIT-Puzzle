export interface IMessage {
  userIdFrom: string | number;
  userIdTo: string | number;
  message: {
    type: 'text' | 'audio' | 'image';
    value: string;
  };
}
