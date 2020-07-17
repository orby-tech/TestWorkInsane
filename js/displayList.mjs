import { loadTodo } from './fileSystem.mjs';
import {
  ul,
  searchSettings,
  listOfId,
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
  let tempList = []
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
      const deleteIMG = document.createElement('img');
      const editIcon = document.createElement('i');
      const editIMG = document.createElement('img');
      const appendIcon = document.createElement('i');
      const appendIMG = document.createElement('img');
      const settingsBlock = document.createElement('div');
      deleteIMG.src = './images/clickers/trash.png'
      deleteIcon.append(deleteIMG);
      deleteElement.append(deleteIcon);
      deleteElement.id = ('delete');

      editIMG.src = './images/clickers/pancel.png'
      editIcon.append(editIMG);
      editElement.append(editIcon);
      editElement.id = ('edit');

      appendIMG.src = './images/clickers/plus.png'
      appendIcon.append(appendIMG);
      appendElement.append(appendIcon);
      appendElement.id = ('append');
      tempList.push( `${data.parentID}_${i}`)
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
        settingsBlock.append(deleteElement, editElement, appendElement, checkBox);
      } else {
        settingsBlock.append(deleteElement, editElement, appendElement);
      }
      settingsBlock.classList.toggle('settingsBlock')
      li.append(settingsBlock, todo);
      if (item.checked) li.classList.toggle('checked');
      if (li.id === listOfId.selected) {
        const discriptionBox = document.createElement('div');
        const discription = document.createElement('textarea');
        discription.value = item.discription ? item.discription : ""
        discriptionBox.append(discription)
        discriptionBox.id = "discription"
        li.classList.toggle('selected')
        li.appendChild(discriptionBox)
      };
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
  listOfId.list = tempList
};

export { watchToDoList };
