import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // console.error(`${error}`);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search);
    state.search.page = 1;
  } catch (err) {
    throw err;
    // console.log(err);
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const [start, end] = [(page - 1) * RES_PER_PAGE, page * RES_PER_PAGE];

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity + newServing / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const deleteBookmark = function (id) {
  //finding index
  const index = state.bookmarks.findIndex(el => el.id === id);
  //deleting that recipe
  state.bookmarks.splice(index, 1);

  console.log('popped', state.bookmarks);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

export const addAndDeleteBookmark = function (recipe) {
  if (state.recipe?.bookmarked) {
    deleteBookmark(recipe.id);
    return;
  }
  // Add bookmark
  state.bookmarks.push(recipe);
  console.log('pushed', state.bookmarks);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

const initModel = function () {
  const bookmarkStorage = localStorage.getItem('bookmarks');
  if (bookmarkStorage) state.bookmarks = JSON.parse(bookmarkStorage);
};
initModel();
// console.log('bookmarkStorage', state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] != '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient formate! please use the correct formate :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);
    const dataUpload = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(dataUpload);
    addAndDeleteBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
