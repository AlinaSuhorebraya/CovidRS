import './list.scss';
import { GeneralInfo } from '../../services/app.service';
import AppService, { ratio, status, timePeriod } from '../../services/app.service';

interface ListData {
  countryName: string;
  numberOfCases: number;
  flag: string;
}

export default class List {
  sortByNumbers(arr: ListData[]) {
    arr.sort((a: ListData, b: ListData) => (a.numberOfCases > b.numberOfCases ? -1 : 1));
  }
  changeCountry: (country: string) => void = () => {};

  covidInfo: ListData[] = [];
  covidInfoData: GeneralInfo[];

  constructor(covidInfoData: GeneralInfo[], changeConuntry: (country: string) => void) {
    this.changeCountry = changeConuntry;
    this.covidInfo = [];
    this.covidInfoData = covidInfoData;
  }

  getListItems() {
    let str = '';
    this.sortByNumbers(this.covidInfo);
    this.covidInfo.forEach((el) => {
      str += `
          <span data-country="${el.countryName}">
            <h5>
              <strong>${el.numberOfCases}</strong>
              <span>${el.countryName}</span>
              <img src = "${el.flag}" style = "width: 20px"></img>
            </h5>
          </span>`;
    });
    return str;
  }

  render(statusData: status, timePeriodData: timePeriod, ratioData: ratio) {
    this.getCovidInfo(statusData, timePeriodData, ratioData);
    document.querySelector('.block-one')?.insertAdjacentHTML('beforeend', this.getListWrapper());
    document.querySelector('.select-list')?.addEventListener('click', (event) => {
      const element = event.target as HTMLElement;
      if (element.closest('[data-country]')) {
        const listItem = element.closest('[data-country]') as HTMLElement;
        this.changeCountry(listItem.dataset.country!);
      }
    });
  }

  getListWrapper() {
    return `<div class="list-wrapper scalable">
      <div class="caption">
        <h3>Cases by country</h3>
      </div>
      <div class="search">
        <form>
          <input type="text" placeholder="Enter country...">
          <button type="submit"><img src="../../assets/search.svg" alt="search"/></button>
        </form>
      </div>
      ${this.getList()}
    </div>`;
  }

  getList() {
    return `<div class="select-list">
       ${this.getListItems()}
       </div>`;
  }

  reRender(statusData: status, timePeriodData: timePeriod, ratioData: ratio) {
    this.getCovidInfo(statusData, timePeriodData, ratioData);
    const list = document.querySelector('.select-list');
    list?.remove();
    document.querySelector('.search')?.insertAdjacentHTML('afterend', this.getList());
    document.querySelector('.select-list')?.addEventListener('click', (event) => {
      const element = event.target as HTMLElement;
      if (element.closest('[data-country]')) {
        const listItem = element.closest('[data-country]') as HTMLElement;
        this.changeCountry(listItem.dataset.country!);
      }
    });
  }

  getCovidInfo(statusData: status, timePeriodData: timePeriod, ratioData: ratio) {
    this.covidInfo = this.covidInfoData.reduce((result: ListData[], countryInfo) => {
      const listItemData = { countryName: countryInfo.name };
      let numberOfCases;
      let flag;
      switch (statusData) {
        case status.Confirmed: {
          timePeriodData == timePeriod.All ? (numberOfCases = countryInfo.TotalConfirmed) : (numberOfCases = countryInfo.NewConfirmed);
          if (ratioData == ratio.Relative) {
            numberOfCases = +((numberOfCases / countryInfo.population) * 100000).toFixed(2);
          }
          flag = countryInfo.flag;
          result.push({ ...listItemData, numberOfCases, flag });
          break;
        }
        case status.Deaths: {
          timePeriodData == timePeriod.All ? (numberOfCases = countryInfo.TotalDeaths) : (numberOfCases = countryInfo.NewDeaths);
          if (ratioData == ratio.Relative) {
            numberOfCases = +((numberOfCases / countryInfo.population) * 100000).toFixed(2);
          }
          flag = countryInfo.flag;
          result.push({ ...listItemData, numberOfCases, flag });
          break;
        }
        case status.Recovered: {
          timePeriodData == timePeriod.All ? (numberOfCases = countryInfo.TotalRecovered) : (numberOfCases = countryInfo.NewRecovered);
          if (ratioData == ratio.Relative) {
            numberOfCases = +((numberOfCases / countryInfo.population) * 100000).toFixed(2);
          }
          flag = countryInfo.flag;
          result.push({ ...listItemData, numberOfCases, flag });
          break;
        }
      }
      return result;
    }, [] as ListData[]);
  }
}
