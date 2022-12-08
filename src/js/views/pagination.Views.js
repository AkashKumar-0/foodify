import View from './View';
import icons from 'url:../../img/icons.svg'; //this is a new syntax

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      console.log(btn);

      const goToPage = +btn.dataset.goto;
      console.log('moved to -> ', goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    console.log('toal no of recipe page ->', numPages);
    const currPage = this._data.page;

    // page 1 , and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupBtnNExt(currPage);
    }
    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupBtnPrev(currPage);
    }
    // other page
    if (currPage < numPages) {
      return (
        this._generateMarkupBtnPrev(currPage) +
        this._generateMarkupBtnNExt(currPage)
      );
      //   return prev + next;
    }
    //  page 1, and there are no other page
    return '';
  }

  _generateMarkupBtnNExt(currPage) {
    return `
        <button data-goto="${
          currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
              <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-right"></use>
             </svg>
        </button>
    `;
  }

  _generateMarkupBtnPrev(currPage) {
    return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-left"></use>
              </svg>
              <span>Page ${currPage - 1}</span>
        </button>
    `;
  }
}

export default new PaginationView();
