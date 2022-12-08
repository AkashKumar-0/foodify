import View from './View';
import icons from 'url:../../img/icons.svg'; //this is a new syntax

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errMSG = 'No recipe found for your query! please try again';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(this._generateMarkupCom);
  }
  _generateMarkupCom(res) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
    <a class="preview__link ${
      res.id === id ? 'preview__link--active' : ''
    } " href="#${res.id}">
      <figure class="preview__fig">
        <img src="${res.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${res.title}</h4>
        <p class="preview__publisher">${res.publisher}</p>
      </div>
    </a>
    </li>`;
  }
}

export default new ResultView();
