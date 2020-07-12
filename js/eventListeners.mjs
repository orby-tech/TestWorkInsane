/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */
import {
  saveTodo, loadTodo, saveSearch, exportDocument, importDocument,
} from './fileSystem.mjs';
import {
  inputAddToDo,
  inputHeader,
  inputSearch,
  checkBoxOfSearch,
  ul, li,
  searchSettings,
  importButton,
  exportButton,
} from './variables.mjs';
import {
  elementDelete, elementAppend, elementValueUpdate, elementEdit, getElement, elementFromClipboard,
} from './filterForList.mjs';
import { watchToDoList } from './displayList.mjs';

/**
 * @author Timur Bondarenko
 * initialisation all listeners of interfase
 * @version 1.0
 */
export default () => {
  /**
   * add todo
   */
  inputAddToDo.addEventListener('keypress', (keyPressed) => {
    if (keyPressed.which === 13) {
      if (inputAddToDo.value) {
        const newTodo = inputAddToDo.value;
        inputAddToDo.value = ' ';
        saveTodo([{ value: newTodo, checked: false, edit: false }, ...loadTodo()]);
        watchToDoList();
      }
    }
  });
  /**
   * Search update
   */
  inputSearch.addEventListener('keypress', (keyPressed) => {
    if (keyPressed.which === 13) {
      if (searchSettings.value && searchSettings.value !== searchSettings.last) {
        searchSettings.last = searchSettings.value;
        document.getElementById('lastSearch').innerHTML = (searchSettings.last);
      }
      searchSettings.value = inputSearch.value;
      saveSearch(searchSettings);
      watchToDoList();
    }
  });
  /**
   * Return to OLD search
   */
  document.getElementById('lastSearch').addEventListener('click', () => {
    inputSearch.value = searchSettings.last;
    searchSettings.value = searchSettings.last;
    watchToDoList();
  });
  /**
   * Update name of project
   */
  inputHeader.addEventListener('keypress', (keyPressed) => {
    if (keyPressed.which === 13) {
      document.title = keyPressed.path[0].value;
      sessionStorage.setItem('info', JSON.stringify(keyPressed.path[0].value));
    }
  });
  /**
   * Copy past of items
   */
  li.addEventListener('dblclick', (event) => {
    if (event.target.closest('li')) {
      navigator.clipboard.readText()
        .then((text) => {
          console.log(text)
          if (text && text.slice(0, 4) === 'todo') {
            elementFromClipboard(event.target.id, JSON.parse(text.slice(4)));
            watchToDoList();
            navigator.clipboard.writeText('')
              .catch((err) => {
                console.log('Some Error');
              });
          } else {
            console.log(event.target.id)
            navigator.clipboard.writeText(`todo${JSON.stringify(getElement(event.target.id))}`)
              .then(() => {
                alert('Copied the element');
              })
              .catch((err) => {
                console.log('Some Error');
              });
          }
        })
        .catch((err) => {
          console.log('Some Error', err);
        });
    }
  });
  /**
   * Update value of item
   */
  ul.addEventListener('keypress', (keyPressed) => {
    if (keyPressed.which === 13) {
      elementValueUpdate(keyPressed.path[0].value, keyPressed.path[1].id);
      watchToDoList();
    }
  });
  /**
   * Filter / Find check box
   */
  checkBoxOfSearch.addEventListener('click', (event) => {
    searchSettings.checked = event.target.checked;
    saveSearch(searchSettings);
    watchToDoList();
  });
  /**
   * import
   */
  importButton.addEventListener('change', (event) => {
    importDocument(event.target);
  });
  /**
   * export
   */
  exportButton.addEventListener('click', () => {
    exportDocument();
  });
  /**
   * edit of user panel in item
   */
  ul.addEventListener('click', (ev) => {
    if (String(ev.target.type) === 'checkbox') {
      const listCounter = (indexes, elements) => {
        if (indexes.length === 1) {
          elements[Number(indexes[0])].checked = !elements[Number(indexes[0])].checked;
          return elements;
        }
        const tempElements = [
          ...elements.splice(0, indexes[0]),
          {
            value: elements[0].value,
            checked: elements[0].checked,
            childs: listCounter(indexes.slice(1), elements[0].childs),
          },
          ...elements.slice(1),
        ];

        return tempElements;
      };
      let tempArrayOfIndexes = ev.target.id.split('_');
      tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
      saveTodo(listCounter(tempArrayOfIndexes, loadTodo()));
      watchToDoList();
    }
    if (String(ev.target.tagName) === 'I') {
      if (ev.path[1].id === 'append') {
        let tempArrayOfIndexes = ev.path[2].id.split('_');
        tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
        saveTodo(elementAppend(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      } else if (ev.path[1].id === 'delete') {
        let tempArrayOfIndexes = ev.path[2].id.split('_');
        tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
        saveTodo(elementDelete(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      } else if (ev.path[1].id === 'edit') {
        let tempArrayOfIndexes = ev.path[2].id.split('_');
        tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
        saveTodo(elementEdit(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      }
    }
  }, false);
};
