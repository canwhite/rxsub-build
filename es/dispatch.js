/* import eventBus from "./eventBus";
import { isCorrectVal } from "./utils"; */
import store from './store';
var stateMap = store.stateMap;

var dispatch = function dispatch(stateName, action) {
  /* if (!Array.isArray(actions)) {
    actions = [actions];
  }
  const map = {};
  actions.forEach(action => {
    if (typeof action === "string") {
      const type = action;
      action = { type };
    }
    action.type = `${stateName}#${action.type}`;
      map[action.type] = action;
  });
  eventBus.next(map); */
  if (typeof action === "string") {
    var type = action;
    action = {
      type: type
    };
  }

  stateMap[stateName]["producer"](action);
};

export default dispatch;