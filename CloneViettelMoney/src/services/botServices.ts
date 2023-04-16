import { baseConfig } from 'src/config';
import BaseServices from './baseServices';

interface UpdateFormRequest {
  user_id_source: string;
  user_id_destination: string;
  room_id: string;
}

export class BotServices extends BaseServices {
  constructor() {
    super(baseConfig.botServer);
  }

  updateForm(data: UpdateFormRequest) {
    return this.post(`/api/chatbox/bot/update_form`, data);
  }
}

export default new BotServices();
