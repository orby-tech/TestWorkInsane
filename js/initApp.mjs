import {
  searchSettings,
} from './variables.mjs';
/**
 * @author Timur Bondarenko
 * init App
 * loading name, search settings and old list
 * @version 1.0
 */
export default () => {
  if (sessionStorage.getItem('info')) {
    document.title = JSON.parse(sessionStorage.getItem('info'));
    document.querySelector("input[id = 'header']").value = JSON.parse(sessionStorage.getItem('info'));
  } else {
    document.title = 'new progect';
    document.querySelector("input[id = 'header']").value = 'new progect';
  }
  if (sessionStorage.getItem('searchSettings')) {
    const search = JSON.parse(sessionStorage.getItem('searchSettings'));
    document.querySelector("input[id = 'searchBox__text']").value = search.value;
    document.querySelector("input[id = 'searchBox__checkBox']").checked = search.checked;
    document.getElementById("lastSearch").innerHTML = (search.last);
    searchSettings.value = search.value;
    searchSettings.checked = search.checked;
    searchSettings.last = (search.last);
  } else {
    document.querySelector("input[id = 'searchBox__text']").value = '';
  }
};
