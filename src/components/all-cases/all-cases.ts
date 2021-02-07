import { GeneralInfo } from '../../services/app.service';
import './all-cases.scss';

export default class AllCases {
  worldCases = {};
  covidInfoData: GeneralInfo[]
  constructor(){
    this.covidInfoData = [];
  }
  getAllCases( covidInfoData: GeneralInfo[]) {
    const [world] = covidInfoData.filter((obj) => obj?.name === 'World');
    return `
      <div class="all-cases">
          <span>Global Cases</span>
          <span class="global-cases-number">${world.TotalConfirmed}</span>
      </div>
    `;
  }
}
