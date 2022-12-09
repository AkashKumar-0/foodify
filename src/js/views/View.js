import icons from 'url:../../img/icons.svg'; //this is a new syntax

export default class View {
  _parentEl = document.querySelector('.recipe'); //same as recipeContainer
  _data;
  _message;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.showError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.clearAndInsert(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //^^ string will be converted into real new dom object

    const newElements = Array.from(newDom.querySelectorAll('*')); //'Array.from' coverting NodeList into array
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));

    // console.log(newElements);
    // console.log(currElements);

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // console.log(currEl, newEl.isEqualNode(currEl));

      //update change Text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() != '' //thia lines mean it will run only if its a text
      ) {
        currEl.textContent = newEl.textContent;
      }

      //update change Attribute
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  //------ to clearand insert int right place -------\\
  clearAndInsert(htmlContent) {
    this._parentEl.innerHTML = ''; //bcz we are overighting on recipe container
    this._parentEl.insertAdjacentHTML('afterbegin', htmlContent);
  }

  //-------- for rendering the spinner ----------\\
  renderSpinner() {
    const html = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this.clearAndInsert(html);
  }

  /**
   *
   * @param {*} errMSG
   * @return html tag with error msg
   */
  showError(errMSG = this._errMSG) {
    const html = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${errMSG}</p>
    </div>
      `;
    this.clearAndInsert(html);
  }

  renderMessage(errMSG = this._message) {
    const html = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${errMSG}</p>
    </div>
      `;
    this.clearAndInsert(html);
  }
}
