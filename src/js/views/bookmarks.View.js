import View from './View';
import previewView from './preview.View';
import icons from 'url:../../img/icons.svg'; //this is a new syntax

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMSG = 'NO  bookmarks yet, Find a nice recipe and bookmark it :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(Bookmark => previewView.render(Bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
