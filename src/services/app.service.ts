import AllCases from '../components/all-cases/all-cases';
import List from '../components/list/list';
import Map from '../components/map/map';
import Table from '../components/table/table';
import Diagram from '../components/diagram/diagram';
import Controls from '../components/controls/controls';
import { CountryData, CovidData } from './data.service';
import ChartComponent from '../components/chart/chart';

export interface GeneralInfo {
  name: string;
  NewConfirmed: number;
  NewDeaths: number;
  NewRecovered: number;
  TotalConfirmed: number;
  TotalDeaths: number;
  TotalRecovered: number;
  flag: string;
  population: number;
}

export enum status {
  Confirmed = 'Confirmed',
  Deaths = 'Deaths',
  Recovered = 'Recovered',
}

export enum timePeriod {
  All = 'All',
  ByDay = 'Day',
}

export enum ratio {
  Absolute = 'Abs',
  Relative = '100k',
}

export default class AppService {
  currentCountry: string = 'World';
  status = status.Confirmed;
  timePeriod = timePeriod.All;
  ratio = ratio.Absolute;
  list: List | undefined;
  chart: ChartComponent | undefined;
  diagram: Diagram | undefined;
  controls: Controls | undefined;
  generalInfo: GeneralInfo[] = [];
  countriesInfo: CountryData[] = [];
  covidInfo: CovidData[] = [];
  date: string = '';
  table: Table | undefined;

  generateGeneralInfo() {
    this.generalInfo = this.covidInfo.reduce((result, { Country, ...covidData }) => {
      const [countryInfo] = this.countriesInfo.filter((countryInfo) => countryInfo.name === Country);
      return countryInfo ? [...result, { ...countryInfo, ...covidData }] : result;
    }, [] as GeneralInfo[]);

    const worldPopulation = this.countriesInfo.reduce((worldPopulation, country) => {
      worldPopulation += country.population;
      return worldPopulation;
    }, 0);

    const [worldObj] = this.covidInfo.filter(({ Country }) => Country === 'World');

    const { Country, ...wordlCovidInfo } = worldObj;
    this.generalInfo.push({ ...wordlCovidInfo, population: worldPopulation, flag: '', name: Country });
  }

  changeCountry(country: string) {
    this.currentCountry = country;
    const [countryFiltered] = this.generalInfo.filter(({ name }) => name === this.currentCountry);
    this.chart = new ChartComponent(this.currentCountry, countryFiltered.population);
    this.chart.renderChart(this.status, this.ratio);
    document.querySelector('.column:last-child')?.remove();
    document.querySelector('.table')?.insertAdjacentHTML('beforeend', this.table!.getTableData(this.currentCountry, this.timePeriod, this.ratio))
  }

  changeStatus(statusIndex: number) {
    this.status = Object.values(status)[statusIndex];
    document.querySelectorAll('select').forEach((select) => {
      select.selectedIndex = statusIndex;
    });
    this.chart?.reRender(this.status, this.ratio);
    this.list?.reRender(this.status, this.timePeriod, this.ratio);
  }

  changePeriod(period: timePeriod) {
    this.timePeriod = period === timePeriod.All ? timePeriod.ByDay : timePeriod.All;
    document.querySelectorAll('.time-period').forEach((element) => {
      element.textContent = this.timePeriod;
    });
    this.chart?.reRender(this.status, this.ratio);
    this.list?.reRender(this.status, this.timePeriod, this.ratio);
    document.querySelector('.column:last-child')?.remove();
    document.querySelector('.table')?.insertAdjacentHTML('beforeend', this.table!.getTableData(this.currentCountry, this.timePeriod, this.ratio))
  }

  changeRatio(rat: ratio) {
    this.ratio = rat === ratio.Absolute ? ratio.Relative : ratio.Absolute;
    document.querySelectorAll('.ratio').forEach((element) => {
      element.textContent = this.ratio;
    });
    this.chart?.reRender(this.status, this.ratio);
    this.list?.reRender(this.status, this.timePeriod, this.ratio);
    document.querySelector('.column:last-child')?.remove();
    document.querySelector('.table')?.insertAdjacentHTML('beforeend', this.table!.getTableData(this.currentCountry, this.timePeriod, this.ratio))
  }

  render() {
    document.querySelector('.block-one')?.insertAdjacentHTML('afterbegin', new AllCases().getAllCases(this.generalInfo));
    this.list = new List(this.generalInfo, this.changeCountry.bind(this));
    this.list.render(this.status, this.timePeriod, this.ratio);
    new Map().renderMap();
    this.table = new Table(this.generalInfo);
    document.querySelector('.block-three')?.insertAdjacentHTML('afterbegin', this.table.getTable(this.currentCountry, this.timePeriod, this.ratio));
    document.querySelector('.block-three')?.insertAdjacentHTML('beforeend', new Diagram().getDiagram());

    const [country] = this.generalInfo.filter(({ name }) => name === this.currentCountry);
    this.chart = new ChartComponent(this.currentCountry, country.population);
    this.chart.renderChart(this.status, this.ratio);

    this.controls = new Controls();
    this.controls.initScaleEvent();
    this.controls.renderControls();
  }

  initEvents() {
    this.controls?.initControlsEvent(this.changeStatus.bind(this), this.changeRatio.bind(this), this.changePeriod.bind(this));
  }
}
