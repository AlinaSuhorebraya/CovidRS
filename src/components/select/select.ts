import './select.scss';
import { status } from '../../services/app.service';

export default class Select {
  getSelect() {
    const statuses = Object.keys(status);
    return `
      <select name='select'>
        ${statuses.map((status) => `<option value='${status}'>${status}</option>`)}
      </select>
    `;
  }
}
