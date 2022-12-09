import { async } from 'regenerator-runtime';

import * as model from './model.js';
import recipeView from './views/recipe.Views.js';
import SearchView from './views/search.Views.js';
import resultView from './views/result.View.js';
import bookmarksView from './views/bookmarks.View.js';
import paginationViews from './views/pagination.Views.js';
import addRecipeView from './views/addRecipe.View.js';
import { Upload_Close_sec } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime';

if (module.hot) module.hot.accept(); // this isn'y js . it is parcel
//API
//   https://forkify-api.herokuapp.com/v2

//--------------------->>>> Showing The Recipe  <<<<---------------------\\
/**
 *
 * @returns  - take the hash from the window url loacation
 *           - show spinner untill the data come back(only in 10 sec)
 *           - again update search result without reloading site if any query found
 *           - also update bookmarks list if any
 *           - loadRecipe ke through perticular id ka data search.result me store karayenge
 *           - after that we will render that selected recipe in right container i.e. ('.recipe)
 * @updateMethod   basically it is used for to change the only disrupted on changed part . it will take care that faltu ka page render na ho keval jahan changes huye h vhi change krdo - bahut fast ho hata h site ka working.
 * @catch using this to catch the error and render on the scren if any wrong casualities happens
 */
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    //gaurd clause
    if (!id) return;

    //rendering spinner
    recipeView.renderSpinner();

    // 0 : update results view to mark selected search result
    resultView.update(model.getSearchResultPage());

    //1 : update bookmark view
    bookmarksView.update(model.state.bookmarks);

    //2 : ------------------>>>> Loading Recipe  <<<<------------\\
    await model.loadRecipe(id); //its return a promise that's why await

    //3 : ---------------->>>> rendering Recipe <<<<---------------\\
    recipeView.render(model.state.recipe);
  } catch (error) {
    //rendering error timout
    recipeView.showError(error);
    // console.error(error.message);
  }
};

/**
 *
 * @returns - spinner
 * - gives query Word
 * - seacrh apies for that word(query)
 * - render all the data comes from api on the left container i.e('.search-reults')
 * - and last the next and prev page handling
 * @other showRecipe on hashUrl change as well as on load
 */
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
/**
 *
 * @param {integer} pageNo
 * @other - rendering the page of results list
 * - updating pagination (btn)
 */
const controlPagination = function (pageNo) {
  // result dikhao
  resultView.render(model.getSearchResultPage(pageNo));

  //btn change karo
  paginationViews.render(model.state.search);
};

/**
 *
 * @param {integer} noOfServing
 * @update updating the value on the basis of servings and right conatainer
 */
const controlServings = function (noOfServing) {
  // update the recipe serving
  model.updateServings(noOfServing);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // update the recipe view
};

/**
 * @return
 *  - adding/deleting to/from bookmark
 *  - updating the recipe
 *  - adding left border vagairah
 */
const controlAddBookmark = function () {
  //add and delete bookmarks
  model.addAndDeleteBookmark(model.state.recipe);

  console.log(model.state.recipe);

  //update view
  recipeView.update(model.state.recipe);

  //rendering bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
/**
 *
 * @param {object} newRecipe
 * @other - uploading the recipe on api
 * - rendering that recipe to right container recipeview
 * - adding to our bookmark
 *@url_change_id changing url's id
 *
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    //render loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log('uploaded recipe', model.state.recipe);

    recipeView.render(model.state.recipe);

    //we are pushing element that's why we aren't using update method
    bookmarksView.render(model.state.bookmarks);

    //changing url's id
    // this will change our url without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // recipe.id bcz the added recipe will be i our right container
    //success mesage
    addRecipeView.renderMessage();
    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, Upload_Close_sec * 1000);
  } catch (err) {
    addRecipeView.showError(err);
    console.log(err);
  }
};

/**
 * @initializingORcontrolling_all_the_movements_from_here
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  //second---->  us left vale window me kisi ek recipe pr click kiya , hash liya, data load aur phir show kiya control recipe ke through
  recipeView.addHandlerRender(controlRecipe);

  //
  recipeView.addHandlerUpdateServings(controlServings);

  //bookmark event delegation
  recipeView.addHandlerBookmark(controlAddBookmark);
  //first yahan se socho----> search baar me type kiya enter kiya , vo query ayaa, usse saara api data seacrh reasult me store kara liya aur phir us sttore result ko left window me show kara diya
  SearchView.addHandlerSearch(controlSearchResult);

  paginationViews.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();

console.log('Welcome to the Application');
