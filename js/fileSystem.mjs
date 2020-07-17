import {
  inputHeader,
  defaultListOfElements,
} from './variables.mjs';
import { watchToDoList } from './displayList.mjs';
/**
 * @author Timur Bondarenko
 * File system Worker
 * @version 1.0
 */
const saveTodo = (elements) => {
  sessionStorage.setItem('todoList', JSON.stringify(elements));
};
const loadTodo = () => {
  let todoListAnswer = defaultListOfElements;
  if (sessionStorage.getItem('todoList')) {
    todoListAnswer = JSON.parse(sessionStorage.getItem('todoList'));
  }
  return (todoListAnswer);
};
const saveSearch = (elements) => {
  sessionStorage.setItem('searchSettings', JSON.stringify(elements));
};
const loadSearch = () => {
  let todoListAnswer = defaultListOfElements;
  if (sessionStorage.getItem('searchSettings')) {
    todoListAnswer = JSON.parse(sessionStorage.getItem('searchSettings'));
  }
  return (todoListAnswer);
};
const exportDocument = () => {
  const data = JSON.stringify(loadTodo());
  const filename = `${document.title}.txt`;
  const type = 'plain text';
  const file = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};
const importDocument = (input) => {
  const file = input.files[0];
  let { name } = input.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  if (name.substring(name.length - 3, name.length) === 'txt') {
    reader.onload = () => {
      saveTodo(JSON.parse(reader.result));
      name = name.substring(0, name.length - 4);
      document.title = name;
      inputHeader.value = name;
      watchToDoList();
      sessionStorage.setItem('info', JSON.stringify(name));
    };

    reader.onerror = () => {
      alert('Какие то проблемы с файлом');
    };
  } else {
    (
      alert('Пожалуйста, попробуйте .txt')
    );
  }
};

export {
  saveTodo,
  loadTodo,
  exportDocument,
  importDocument,
  saveSearch,
  loadSearch,
};
