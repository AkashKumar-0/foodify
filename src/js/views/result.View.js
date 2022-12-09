import View from './View';
import previewView from './preview.View';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errMSG = 'No recipe found for your query! please try again';
  _message = '';

  _generateMarkup() {
    // console.log('preview ->', this._data);
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new ResultView();
