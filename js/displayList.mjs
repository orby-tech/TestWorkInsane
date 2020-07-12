/* eslint-disable import/extensions */
import { loadTodo } from './fileSystem.mjs';
import {
  ul,
  searchSettings,
} from './variables.mjs';

/**
 * @author Timur Bondarenko
 * @param element { HTML Obgect }, item (base element with childs) {Obgect},
 * @returns new List { Obgect }
 * @version 1.0
 */
const searchStyle = (element, item) => {
  if (searchSettings.value) {
    if (searchSettings.checked) {
      if (JSON.stringify(item).indexOf(searchSettings.value.toLowerCase()) === -1) {
        element.classList.add('display');
      }
    } else if (item.value.toLowerCase().indexOf(searchSettings.value.toLowerCase()) !== -1) {
      element.classList.add('findedElement');
    }
  }

  return element;
};

/**
 * @author Timur Bondarenko
 * create toDo list in page
 * @version 1.0
 */
const watchToDoList = () => {
  /**
   * @author Timur Bondarenko
   * @param data {Obgect}
   * One tick of toDo list
   * @version 1.0
   */
  const createList = (data) => {
    const paranteUl = data.ul;
    let i = 0;
    data.elements.forEach((item) => {
      let li = document.createElement('li');
      const checkBox = document.createElement('input');
      const deleteElement = document.createElement('span');
      const editElement = document.createElement('span');
      const appendElement = document.createElement('span');
      const deleteIcon = document.createElement('i');
      const editIcon = document.createElement('i');
      const appendIcon = document.createElement('i');

      deleteIcon.classList.add('fa', 'fa-trash');
      deleteElement.append(deleteIcon);
      deleteElement.id = ('delete');

      editIcon.classList.add('fa', 'fa-pencil');
      editElement.append(editIcon);
      editElement.id = ('edit');

      appendIcon.classList.add('fa', 'fa-plus');
      appendElement.append(appendIcon);
      appendElement.id = ('append');

      checkBox.type = 'checkbox';
      checkBox.id = `${data.parentID}_${i}`;
      if (item.checked) checkBox.checked = true;

      li = searchStyle(li, item);
      let todo = item.value;
      if (item.edit) {
        todo = document.createElement('input');
        todo.id = 'editElementInput';
        todo.placeholder = item.value;
      }

      li.id = `${data.parentID}_${i}`;
      if (paranteUl.id !== 'ulLevel0') {
        li.append(deleteElement, editElement, appendElement, checkBox, todo);
      } else {
        li.append(deleteElement, editElement, appendElement, todo);
      }

      if (item.checked) li.classList.toggle('checked');

      paranteUl.appendChild(li);
      if (item.hasOwnProperty('childs')) {
        const newUl = document.createElement('ul');
        newUl.id = `ul${data.parentID}_${i}`;
        document.getElementById(li.id).appendChild(newUl);

        const dataForList = {
          ul: document.getElementById(`ul${data.parentID}_${i}`),
          parentID: `${data.parentID}_${i}`,
          elements: item.childs,
        };
        createList(dataForList);
      }
      i += 1;
    });
  };
  while (ul.firstChild) {
    ul.firstChild.remove();
  }
  const dataForList = {
    ul,
    parentID: '',
    elements: loadTodo(),
  };
  createList(dataForList);
};

export { watchToDoList };
