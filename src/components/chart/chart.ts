import './chart.scss';
import Chart from 'chart.js';
import { ratio, status } from '../../services/app.service';

interface CountryInfoForChart {
  Country: string;
  CountryCode: string;
  Province: string;
  City: string;
  CityCode: string;
  Lat: string;
  Lon: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Active: number;
  Date: string;
}

export default class ChartComponent {
  country: string;
  deaths: number[];
  confirmed: number[];
  recovered: number[];
  dates: string[];
  population: number;

  constructor(country: string, population: number) {
    this.country = country;
    this.deaths = [];
    this.confirmed = [];
    this.recovered = [];
    this.dates = [];
    this.population = population;
  }

  createChart(statusSelected: status, ratioSelected: ratio) {
    const dates: string[] = this.dates;
    let values: number[];
    const labelChart = statusSelected;

    switch (statusSelected) {
      case status.Confirmed:
        values = ratioSelected === ratio.Absolute ? this.confirmed : this.confirmed.map((num) => (num / this.population) * 100000);
        break;
      case status.Deaths:
        values = ratioSelected === ratio.Absolute ? this.deaths : this.deaths.map((num) => (num / this.population) * 100000);
        break;
      case status.Recovered:
        values = ratioSelected === ratio.Absolute ? this.recovered : this.recovered.map((num) => (num / this.population) * 100000);
        break;
    }

    const chartElement = document.createElement('canvas') as HTMLCanvasElement;
    chartElement.id = 'myChart';
    document.querySelector('.chart-wrapper')?.append(chartElement);
    const context = chartElement.getContext('2d');
    const chart = new Chart(context as any, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: dates,
        datasets: [
          {
            label: labelChart,
            borderColor: '#bdbdbd',
            data: values,
          },
        ],
      },
      // Configuration options go here
      options: {
        responsive: true,
      },
    });
  }

  reRender(statusSelected: status, ratioSelected: ratio) {
    document.querySelector('.chart-wrapper')?.remove();
    const chartWrapper = '<div class="chart-wrapper">';
    document.querySelector('.diagram-wrapper')?.insertAdjacentHTML('afterbegin', chartWrapper);
    this.createChart(statusSelected, ratioSelected);
  }

  renderChart(statusSelected: status, ratioSelected: ratio) {
    document.querySelector('.chart-wrapper')?.remove();
    document.querySelector('.diagram-wrapper')?.insertAdjacentHTML('afterbegin', '<div class="chart-wrapper">');
    if (this.country === 'World') {
      return fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
        .then((res) => res.json())
        .then(({ cases, deaths, recovered }) => {
          this.confirmed = Object.values(cases);
          this.deaths = Object.values(deaths);
          this.recovered = Object.values(recovered);
          this.dates = Object.keys(cases).map((dateStr) => dateStr.slice(0, -3).replace('/', '-'));
        })
        .then(() => this.createChart(statusSelected, ratioSelected));
    } else {
      return fetch(`https://api.covid19api.com/total/dayone/country/${this.country.toLowerCase()}`)
        .then((data) => data.json())
        .then((data) =>
          data.forEach((country: CountryInfoForChart) => {
            const { Confirmed, Recovered, Deaths, Date } = country;
            this.confirmed.push(Confirmed);
            this.recovered.push(Recovered);
            this.deaths.push(Deaths);
            this.dates.push(Date.slice(5, 10));
          })
        )
        .then(() => this.createChart(statusSelected, ratioSelected));
    }
  }
}
