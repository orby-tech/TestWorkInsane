import { watchToDoList } from './displayList.mjs';
import initDragManager from './dragNDropManager.mjs';
import initEventListeners from './eventListeners.mjs';
import initAppPage from './initApp.mjs';

/**
 * @author Timur Bondarenko
 * Entry point
 * @version 1.0
 */

/**
 * @author Timur Bondarenko
 * listener to service Worker
 */
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service worker successfully registered', registration);
      })
      .catch((error) => {
        console.log('Service worker registration failed', error);
      });
  }
});
initEventListeners();
initAppPage();
watchToDoList();
initDragManager();
