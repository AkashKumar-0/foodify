import { async } from 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipe.Views.js';
import SearchView from './views/search.Views.js';
import resultView from './views/result.View.js';
import paginationViews from './views/pagination.Views.js';
import 'core-js/stable';
import 'regenerator-runtime';

if (module.hot) module.hot.accept(); // this isn'y js . it is parcel
//API
//   https://forkify-api.herokuapp.com/v2

//--------------------->>>> Showing The Recipe  <<<<---------------------\\
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    //gaurd clause
    if (!id) return;

    //rendering spinner
    recipeView.renderSpinner();

    // 0 : update results view to mark selected search result
    resultView.render(model.getSearchResultPage());

    //------------------>>>> Loading Recipe  <<<<------------\\

    await model.loadRecipe(id); //its return a promise that's why await

    //---------------->>>> rendering Recipe <<<<---------------\\
    recipeView.render(model.state.recipe);
  } catch (error) {
    //rendering error timout
    recipeView.showError(error);
    // console.error(error.message);
  }
};

//----------------->>>> showRecipe on hashUrl change as well as on load <<<<-----------------\\

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    //jo search kiya h vo lao
    const query = SearchView.getQuery();
    if (!query) return;

    // sara result search ke result me store kara do
    await model.loadSearchResult(query);

    // console.log('from controller', model.state.search);

    resultView.render(model.getSearchResultPage());

    //render initial paginatiion
    paginationViews.render(model.state.search);
  } catch (err) {
    resultView.showError(err);
    console.log('search result controller -> ', err);
  }
};

// controling the pagination on clicking on Prev or Next btn
const controlPagination = function (pageNo) {
  // result dikhao
  resultView.render(model.getSearchResultPage(pageNo));

  //btn change karo
  paginationViews.render(model.state.search);

  console.log('page controler');
};

const controlServings = function (noOfServing) {
  // update the recipe serving
  model.updateServings(noOfServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // update the recipe view
};

const init = function () {
  //second---->  us left vale window me kisi ek recipe pr click kiya , hash liya, data load aur phir show kiya control recipe ke through
  recipeView.addHandlerRender(controlRecipe);

  recipeView.addHandlerUpdateServings(controlServings);
  //first yahan se socho----> search baar me type kiya enter kiya , vo query ayaa, usse saara api data seacrh reasult me store kara liya aur phir us sttore result ko left window me show kara diya
  SearchView.addHandlerSearch(controlSearchResult);

  paginationViews.addHandlerClick(controlPagination);
};
init();
