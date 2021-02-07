import './table.scss';
import { GeneralInfo } from '../../services/app.service';
import AppService, { ratio, status, timePeriod } from '../../services/app.service';
import { threadId } from 'worker_threads';

interface TableData  {
  name: string;
  confirmedCases: number;
  deathCases: number;
  recoveredCases: number;
  flag: string;
}

export default class Table {
  changeCountry: (country: string) => void = () => {};

  tableData: TableData | undefined= undefined;
  covidInfodata: GeneralInfo[];
  calculateTableData(currentCountry: string, periodData: timePeriod, ratioData: ratio){
    const [selectedCountryData] = this.covidInfodata.filter(countrydata=>
      countrydata.name === currentCountry
    );
      this.tableData = {
        name: selectedCountryData.name,
        flag: selectedCountryData.flag,
        confirmedCases: periodData === timePeriod.All
         ? (ratioData == ratio.Absolute ? selectedCountryData.TotalConfirmed : +(selectedCountryData.TotalConfirmed / selectedCountryData.population * 100000).toFixed(2))
        :  (ratioData == ratio.Absolute ? selectedCountryData.NewConfirmed : +(selectedCountryData.NewConfirmed / selectedCountryData.population * 100000).toFixed(2)),
        deathCases: periodData === timePeriod.All
        ? (ratioData == ratio.Absolute ? selectedCountryData.TotalDeaths : +(selectedCountryData.TotalDeaths / selectedCountryData.population * 100000).toFixed(2))
       :  (ratioData == ratio.Absolute ? selectedCountryData.NewDeaths : +(selectedCountryData.NewDeaths / selectedCountryData.population * 100000).toFixed(2)),
       recoveredCases: periodData === timePeriod.All
       ? (ratioData == ratio.Absolute ? selectedCountryData.TotalRecovered : +(selectedCountryData.TotalRecovered / selectedCountryData.population * 100000).toFixed(2))
      :  (ratioData == ratio.Absolute ? selectedCountryData.NewRecovered : +(selectedCountryData.NewRecovered / selectedCountryData.population * 100000).toFixed(2)),
      }
  }
  constructor(covidInfoData: GeneralInfo[]) {
    this.covidInfodata = covidInfoData;
  }

  getTableData(currentCountry: string, periodData: timePeriod, ratioData: ratio){
    this.calculateTableData(currentCountry, periodData, ratioData)
    return `   <div class="column"><div class="cell"><span class="country">${this.tableData?.name}</span>  ${(this.tableData?.flag) && "<img src=" + this.tableData.flag + " alt='flag' style = 'width: 20px'>"}</div>
    <div class="cell"><span class="cases">${this.tableData?.confirmedCases}</span></div>
    <div class="cell"><span class="death">${this.tableData?.deathCases}</div>
    <div class="cell"><span class="recovered">${this.tableData?.recoveredCases}</span></div></div>`
  }
  getTable(currentCountry: string, periodData: timePeriod, ratioData: ratio) {
    return `
      <div class= "table-wrapper scalable">
        <div class="table">
          <div class="column">
            <div class="cell"><span class="country">Country</span></div>
            <div class="cell"><span class="cases">Global Cases</span></div>
            <div class="cell"><span class="death">Global Death</span></div>
            <div class="cell"><span class="recovered">Global Recovered</span></div>
          </div>
           ${this.getTableData(currentCountry, periodData, ratioData)}
        </div>
      </div>
    `;
  }
}
