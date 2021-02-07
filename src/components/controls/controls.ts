import './controls.scss';
import Select from '../select/select';
import { ratio, timePeriod, status } from '../../services/app.service';
import Indicator from '../indicator/indicator';

export default class Controls {
  getControls() {
    return `
      <div class="controls">
      ${new Select().getSelect()}
      ${new Indicator().getIndicator(ratio)}
      ${new Indicator().getIndicator(timePeriod)}
      <i class = "material-icons scale">zoom_out_map</i>
      </div>
    `;
  }

  renderControls() {
    document.querySelectorAll('.scalable').forEach((control) => {
      control.insertAdjacentHTML('beforeend', this.getControls());
    });
  }

  initControlsEvent(
    changeStatus: (statusIndex: number) => void,
    changeRatio: (rat: ratio) => void,
    changePeriod: (timePeriod: timePeriod) => void
  ) {
    this.initScaleEvent();
    this.initStatusChangeEvent(changeStatus);
    this.initIndicatorEvent(changeRatio, changePeriod);
  }

  initStatusChangeEvent(changeStatus: (statusIndex: number) => void) {
    document.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        const statusSelected = target.value as status;
        const statusIndex = Object.values(status).indexOf(statusSelected);
        changeStatus(statusIndex);
      });
    });
  }

  initScaleEvent() {
    document.querySelectorAll('.scale').forEach((element) => {
      element?.addEventListener('click', () => {
        element.closest('.scalable')?.classList.toggle('zoom');
      });
    });
  }

  initIndicatorEvent(changeRatio: (rat: ratio) => void, changePeriod: (timePeriod: timePeriod) => void) {
    document.querySelectorAll('.button').forEach((indicator) => {
      indicator?.addEventListener('click', (e) => {
        const button = e.target as HTMLButtonElement;
        const title = button.innerText;

        Object.values(ratio).includes(title as ratio) ? changeRatio(title as ratio) : changePeriod(title as timePeriod);
      });
    });
  }
}
