/**
 * @author Timur Bondarenko
 * short names for app
 * @version 1.0
 */

const inputAddToDo = document.querySelector("input[id = 'addToDo']");
const inputHeader = document.querySelector("input[id = 'header']");
const inputSearch = document.querySelector("input[id = 'searchBox__text']");
const inputDiscription = document.querySelector("textarea");
const checkBoxOfSearch = document.querySelector("input[id = 'searchBox__checkBox']");
const ul = document.getElementById('ulLevel0');
const li = document.querySelector('li');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('file-input');
const defaultListOfElements = [
  { value: '1', checked: true },
  { value: '2', checked: false },
  {
    value: 'base',
    checked: false,
    childs: [
      { value: '3', checked: false },
      { value: '4', checked: false },
    ],
  },
  {
    value: 'base',
    checked: false,
    childs: [
      { value: '3', checked: false },
      { value: '4', checked: false },
    ],
  },
];

const searchSettings = {
  value: '',
  checked: false,
  last: '',
};
let listOfId = {
  list:[],
  selected: null,
}
export {
  inputAddToDo,
  inputHeader,
  inputSearch,
  checkBoxOfSearch,
  ul, li,
  defaultListOfElements,
  searchSettings,
  importButton,
  exportButton,
  listOfId,
  inputDiscription,
};
