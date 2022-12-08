class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //submit - if we press click or enter works in both consition
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); //to prevent from page reloading
      handler();
    });
  }
}

export default new SearchView();
