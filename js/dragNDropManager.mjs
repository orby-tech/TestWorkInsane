/* eslint-disable no-alert */
/* eslint-disable import/extensions */
import { saveTodo, loadTodo } from './fileSystem.mjs';
import { watchToDoList } from './displayList.mjs';
import {
  elementDelete,
  elementAppendByIndex,
  elementAppend,
} from './filterForList.mjs';

/**
 * @author Timur Bondarenko
 * Must listen and drag and drop emulation for toDo list
 * @version 1.0
 */
export default () => (function () {
  let dragObject = {};
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function findDropPoint(event) {
    dragObject.avatar.hidden = true;
    let elem;
    if (event.changedTouches) {
      elem = document.elementFromPoint(event.changedTouches[0].clientX,
        event.changedTouches[0].clientY);
    } else {
      elem = document.elementFromPoint(event.clientX, event.clientY);
    }

    dragObject.avatar.hidden = false;

    if (elem == null) {
      return null;
    }
    elem = elem.closest('li');
    let data;
    if (elem && elem.getBoundingClientRect().top - event.clientY) {
      data = {
        position: elem.getBoundingClientRect().top - event.clientY,
        id: elem.id,
      };
    }
    return data;
  }
  /**
   * @author Timur Bondarenko
   * @param elem {Obgect}
   * @returns coords {Obgect}
   * @version 1.0
   */
  const getCoords = (elem) => {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  };
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function finishDrag(e) {
    const dropElem = findDropPoint(e);
    if (!dropElem) {
      onDragCancel(dragObject);
    } else {
      onDragEnd(dropElem);
    }
  }
  /**
   * @author Timur Bondarenko
   * creater psevdoelement by alfa element
   * @version 1.0
   */
  function createAvatar() {
    const avatar = dragObject.elem;
    const old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || '',
    };
    avatar.rollback = () => {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex;
    };

    return avatar;
  }
  /**
   * @author Timur Bondarenko
   * inject avatar to DOM
   * @version 1.0
   */
  function startDrag() {
    const { avatar } = dragObject;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
    avatar.classList.add('dragIn');
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onMouseDown(e) {
    if (e.target.tagName !== 'LI') return;
    if (!e.touches && e.which !== 1) return;

    const elem = e.target.closest('li');
    if (!elem) return;

    dragObject.elem = elem;

    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onMouseMove(e) {
    if (!dragObject.elem) return;
    e.stopPropagation();
    if (!dragObject.avatar) {
      const moveX = e.pageX - dragObject.downX;
      const moveY = e.pageY - dragObject.downY;
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }
      dragObject.avatar = createAvatar(e);
      if (!dragObject.avatar) {
        dragObject = {};
        return;
      }
      const coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e);
    }
    dragObject.avatar.style.left = `${e.pageX - dragObject.shiftX}px`;
    dragObject.avatar.style.top = `${e.pageY - dragObject.shiftY}px`;
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onTouchDown(e) {
    if (!e.target.closest('li')) return;
    const elem = e.target.closest('li');
    dragObject.elem = elem;
    dragObject.downX = e.changedTouches[0].pageX;
    dragObject.downY = e.changedTouches[0].pageY;
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onTouchMove(e) {
    if (!dragObject.elem) return;
    document.body.style.overflow = 'hidden';
    if (!dragObject.avatar) {
      const moveX = e.changedTouches[0].pageX - dragObject.downX;
      const moveY = e.changedTouches[0].pageY - dragObject.downY;
      if (Math.abs(moveX) < 2 && Math.abs(moveY) < 2) {
        return;
      }

      dragObject.avatar = createAvatar(e);
      if (!dragObject.avatar) {
        dragObject = {};
        return;
      }
      const coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e);
    }
    dragObject.avatar.style.left = `${e.changedTouches[0].pageX - dragObject.shiftX}px`;
    dragObject.avatar.style.top = `${e.changedTouches[0].pageY - dragObject.shiftY}px`;
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onMouseUp(e) {
    if (dragObject.avatar) {
      finishDrag(e);
    }
    dragObject = {};
  }
  /**
   * @author Timur Bondarenko
   * @param event {Obgect},
   * @version 1.0
   */
  function onTouchUp(e) {
    if (dragObject.avatar) {
      finishDrag(e.changedTouches[0]);
      document.body.style.overflow = 'auto';
    }
    dragObject = {};
  }
  /**
   * @author Timur Bondarenko
   * splitter by device
   * @version 1.0
   */
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    document.addEventListener('touchstart', onTouchDown);
    document.addEventListener('touchend', onTouchUp, true);
    document.addEventListener('touchmove', onTouchMove, false);
  } else {
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;
  }
  const onDragCancel = () => {
    document.getElementById(dragObject.elem.id).remove();
    dragObject = {};
    watchToDoList();
  };
  /**
   * @author Timur Bondarenko
   * @param dropElem {Obgect},
   * @version 1.0
   */
  const onDragEnd = (dropElem) => {
    let element;
    const deleteID = dragObject.elem.id.split('_').filter((item) => item !== '');
    const parentID = dropElem.id.split('_').filter((item) => item !== '');

    const copyElement = (indexes, elements) => {
      if (indexes.length === 1) {
        element = elements[indexes[0]];
      } else {
        copyElement(indexes.slice(1), elements[indexes[0]].childs);
      }
    };
    copyElement(deleteID, loadTodo());
    let temp;
    if (dropElem.position >= -15) {
      temp = elementDelete(deleteID, loadTodo());
      saveTodo(elementAppendByIndex(parentID, temp, element));
    } else if (dropElem.position >= -45) {
      if (deleteID.length <= parentID.length) {
        if (deleteID[deleteID.length - 1] < parentID[deleteID.length - 1]) {
          parentID[deleteID.length - 1] -= 1;
        }
      }

      temp = elementDelete(deleteID, loadTodo());
      saveTodo(elementAppend(parentID, temp, element));
    } else if (dropElem.position >= -60) {
      parentID[parentID.length - 1] += 1;
      temp = elementDelete(deleteID, loadTodo());
      saveTodo(elementAppendByIndex(parentID, temp, element));
    }
    onDragCancel();
  };
}());
