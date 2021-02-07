import { ratio, timePeriod } from '../../services/app.service';
import './indicator.scss';

export default class Indicator {
  getIndicator(types: typeof ratio | typeof timePeriod) {
    const indicatorClass = `${types === ratio ? 'ratio' : 'time-period'}`;
    const indicatorTitle = `${Object.values(types)[0]}`;
    const indicatorLabel = `${types === ratio ? 'Ratio' : 'Period'}`;
    return `
      <div class='indicator-wrapper'>
        <label>${indicatorLabel}: </label>
        <button title='Click' class='button ${indicatorClass}'> ${indicatorTitle}</button>
      </div>
    `;
  }
}
