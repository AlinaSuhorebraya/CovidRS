import './diagram.scss';

export default class Diagram {
  getDiagram() {
    return `
      <div class="diagram-wrapper scalable">
        <div class='chart-wrapper'>
        </div>
      </div>
    `;
  }
}
