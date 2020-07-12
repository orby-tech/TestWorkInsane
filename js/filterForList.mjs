/* eslint-disable no-param-reassign */
/* eslint-disable no-alert */
/* eslint-disable import/extensions */
import {
  saveTodo, loadTodo,
} from './fileSystem.mjs';

/**
 * @author Timur Bondarenko
 * @param id { Number }
 * @returns some element of list, getted by id { Obgect }
 * @version 1.0
 */
const getElement = (id) => {
  const listCounter = (indexes, elements) => {
    if (indexes.length === 1) {
      return elements[Number(indexes[0])];
    }
    return listCounter(indexes.slice(1), elements[indexes[0]].childs);
  };
  let tempArrayOfIndexes = id.split('_');
  tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
  return listCounter(tempArrayOfIndexes, loadTodo());
};

/**
 * @author Timur Bondarenko
 * @param value {String}, id { Number }
 * @returns new List { Obgect }
 * @version 1.0
 */

const elementValueUpdate = (value, id) => {
  /**
   * @author Timur Bondarenko
   * creater new list of obgects
   * @param indexes(splited id) {Array}, elements (old list) {Obgect}
   * @returns new List { Obgect }
   * @version 1.0
   */
  const listCounter = (indexes, elements) => {
    if (indexes.length === 1) {
      elements[Number(indexes[0])].value = value;
      elements[Number(indexes[0])].edit = false;
      return elements;
    }
    return [
      ...elements.splice(0, indexes[0]),
      {
        value: elements[0].value,
        checked: elements[0].checked,
        childs: listCounter(indexes.slice(1), elements[0].childs),
      },
      ...elements.slice(1),
    ];
  };
  let tempArrayOfIndexes = id.split('_');
  tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
  saveTodo(listCounter(tempArrayOfIndexes, loadTodo()));
};
/**
 * @author Timur Bondarenko
 * @param indexes(splited id) {Array}, elements (old list) {Obgect}, element {Obgect}
 * @returns new List { Obgect }
 * @version 1.0
 */
const elementAppend = (indexes, elements, element) => {
  if (!element || !element.hasOwnProperty('value')) {
    element = { value: '', checked: false, edit: true };
  }
  if (indexes.length === 1) {
    if (elements[indexes[0]].hasOwnProperty('childs')) {
      elements[indexes[0]].childs.unshift(element);
    } else {
      elements[indexes[0]].childs = ([element]);
    }

    return elements;
  }
  const tempElements = [
    ...elements.splice(0, indexes[0]),
    {
      value: elements[0].value,
      checked: elements[0].checked,
      childs: elementAppend(indexes.slice(1), elements[0].childs, element),
    },
    ...elements.slice(1),
  ];

  return tempElements;
};
/**
 * @author Timur Bondarenko
 * @param indexes(splited id) {Array}, elements (old list) {Obgect}, element {Obgect}
 * @returns new List { Obgect }
 * @version 1.0
 */
const elementAppendByIndex = (indexes, elements, element) => {
  if (indexes.length === 1) {
    return [
      ...elements.splice(0, indexes[0]),
      element,
      ...elements,
    ];
  }
  const tempElements = [
    ...elements.splice(0, indexes[0]),
    {
      value: elements[0].value,
      checked: elements[0].checked,
      childs: elementAppend(indexes.slice(1), elements[0].childs, element),
    },
    ...elements.slice(1),
  ];

  return tempElements;
};
/**
 * @author Timur Bondarenko
 * @param id { Number }, element {Obgect},
 * @returns new List { Obgect }
 * @version 1.0
 */
const elementFromClipboard = (id, element) => {
  /**
   * @author Timur Bondarenko
   * @param indexes(splited id) {Array}, elements (old list) {Obgect}, element {Obgect}
   * @returns new List { Obgect }
   * @version 1.0
   */
  const listCounter = (indexes, elements, element) => {
    if (indexes.length === 1) {
      if (elements[indexes[0]].hasOwnProperty('childs')) {
        elements[indexes[0]].childs.unshift(element);
      } else {
        elements[indexes[0]].childs = ([element]);
      }
      return elements;
    }
    const tempElements = [
      ...elements.splice(0, indexes[0]),
      {
        value: elements[0].value,
        checked: elements[0].checked,
        childs: elementAppend(indexes.slice(1), elements[0].childs, element),
      },
      ...elements.slice(1),
    ];
    return tempElements;
  };
  let tempArrayOfIndexes = id.split('_');
  tempArrayOfIndexes = tempArrayOfIndexes.filter((item) => item !== '');
  saveTodo(listCounter(tempArrayOfIndexes, loadTodo(), element));
};
/**
 * @author Timur Bondarenko
 * @param indexes { Array }, elements {Obgect},
 * @returns new List { Obgect }
 * @version 1.0
 */
const elementDelete = (indexes, elements) => {
  if (indexes.length === 1) {
    elements = [
      ...elements.splice(0, indexes[0]),
      ...elements.slice(1),
    ];
    return elements;
  }
  const tempElements = [
    ...elements.splice(0, indexes[0]),
    {
      value: elements[0].value,
      checked: elements[0].checked,
      childs: elementDelete(indexes.slice(1), elements[0].childs),
    },
    ...elements.slice(1),
  ];

  return tempElements;
};
/**
 * @author Timur Bondarenko
 * @param indexes { Array }, elements {Obgect},
 * @returns new List { Obgect }
 * @version 1.0
 */
const elementEdit = (indexes, elements) => {
  if (indexes.length === 1) {
    elements[Number(indexes[0])].edit = true;
    return elements;
  }
  const tempElements = [
    ...elements.splice(0, indexes[0]),
    {
      value: elements[0].value,
      checked: elements[0].checked,
      childs: elementDelete(indexes.slice(1), elements[0].childs),
    },
    ...elements.slice(1),
  ];

  return tempElements;
};

export {
  elementDelete,
  elementAppendByIndex,
  elementAppend,
  elementValueUpdate,
  elementEdit,
  getElement,
  elementFromClipboard,
};
