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
  listOfId,
  inputDiscription,
} from './variables.mjs';
import {
  elementDelete, 
  elementAppend, 
  elementValueUpdate, 
  elementEdit, 
  getElement, 
  elementFromClipboard, 
  elementDiscriptionUpdate,
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
        inputAddToDo.value = '';
        if (newTodo) {
          saveTodo([{ value: newTodo, checked: false, edit: false, discription: "" }, ...loadTodo()]);
          watchToDoList();
        }
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
  inputDiscription.addEventListener('keypress', (keyPressed) => {
    if (keyPressed.which === 13) {
      event.preventDefault()
      watchToDoList();
    }
  });
  /**
   * Select item by click
   */
  var waitingForClick = false;
  ul.addEventListener('click', (event) => {
    if (event.target.closest('img')) {
      let tempArrayOfIndexes = event.path[4].id.split('_');
        tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
      if (event.path[2].id === 'append') {
        saveTodo(elementAppend(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      } else if (event.path[2].id === 'delete') {
        saveTodo(elementDelete(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      } else if (event.path[2].id === 'edit') {
        saveTodo(elementEdit(tempArrayOfIndexes, loadTodo()));
        watchToDoList();
      }
    }
    if (event.target.tagName === "TEXTAREA") {

    } else  if (event.target.tagName === "INPUT") {

    } else if (event.target.closest('li')) {
      switch (event.detail) {
        case 1:
            waitingForClick = setTimeout(function() {
              listOfId.selected = event.target.id;
              watchToDoList();
            }, 100);
            break;
        default:
            if (waitingForClick) { 
                clearTimeout(waitingForClick);
                waitingForClick = false;
            }
            break;
        }

    }
    /**
     * edit of user panel in item
     */
    if (String(event.target.type) === 'checkbox') {
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
      let tempArrayOfIndexes = event.target.id.split('_');
      tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
      saveTodo(listCounter(tempArrayOfIndexes, loadTodo()));
      watchToDoList();
    }
  });
  /**
   * Copy past of items
   */
  document.addEventListener('dblclick', (event) => {
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
    if (keyPressed.target.closest('textarea')) {
      if (keyPressed.which === 13) {
        elementDiscriptionUpdate(keyPressed.target.closest('textarea').value, keyPressed.target.closest('li').id);
        watchToDoList();
      }
    } else if (keyPressed.which === 13) {
      elementValueUpdate(keyPressed.path[0].value, keyPressed.target.closest('li').id);
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
   * 
   * change select by keys
   * 
   */
  document.addEventListener('keydown', (event) => {
    if(event.code === "ArrowDown") {
      if(listOfId.list.indexOf(listOfId.selected) === -1) {
        listOfId.selected = listOfId.list[0];
      } else {
        let index = listOfId.list.indexOf(listOfId.selected) + 1;
        if (index >= listOfId.list.length) index -= listOfId.list.length;
        listOfId.selected = listOfId.list[index];
      }
      watchToDoList();
    } 
    if(event.code === "ArrowUp") {
      if(listOfId.list.indexOf(listOfId.selected) === -1) {
        listOfId.selected = listOfId.list[listOfId.list.length - 1];
      } else {
        let index = listOfId.list.indexOf(listOfId.selected) - 1
        if (index < 0) index += listOfId.list.length;
        listOfId.selected = listOfId.list[index]
      }
      watchToDoList();
    } 
  });
  inputDiscription.addEventListener('click', event => {
    event.preventDefault();
  });

  /**
   * 
   * Hotkeys events
   * 
   */
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      console.log(event.code)
      switch (event.code) {
        case 'KeyD':
          exportDocument()
          break;
        case 'KeyI':
          importButton.click()
          break;
      }
      if(listOfId.list.indexOf(listOfId.selected) !== -1) {
        let tempArrayOfIndexes;
        switch (event.code) {
          case 'Delete':
            tempArrayOfIndexes = listOfId.selected.split('_');
            tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
            saveTodo(elementDelete(tempArrayOfIndexes, loadTodo()));
            watchToDoList();
            break;
          case 'KeyA':
            tempArrayOfIndexes = listOfId.selected.split('_');
            tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
            saveTodo(elementAppend(tempArrayOfIndexes, loadTodo()));
            watchToDoList();
            break;
          case 'KeyE':
            tempArrayOfIndexes = listOfId.selected.split('_');
            tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
            saveTodo(elementEdit(tempArrayOfIndexes, loadTodo()));
            watchToDoList();
            break;
          case 'KeyC':
            navigator.clipboard.writeText(`todo${JSON.stringify(getElement(listOfId.selected))}`)
            .then(() => {
              alert('Copied the element');
            })
            .catch((err) => {
              console.log('Some Error');
            });
            break;
          case 'KeyV':
            navigator.clipboard.readText()
            .then((text) => {
              if (text && text.slice(0, 4) === 'todo') {
                elementFromClipboard(listOfId.selected, JSON.parse(text.slice(4)));
                watchToDoList();
                navigator.clipboard.writeText('')
                  .catch((err) => {
                    console.log('Some Error');
                  });
              }
            })
            .catch((err) => {
              console.log('Some Error', err);
            });
            break;
        }
      }

    }
  });
};
