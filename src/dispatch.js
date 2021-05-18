/* import eventBus from "./eventBus";
import { isCorrectVal } from "./utils"; */
import store from './store';
const stateMap = store.stateMap;

const dispatch = function(stateName, action) {
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
    const type = action;
    action = { type };
  }
  //dispatch里用到了StateMachine里定义的producer
  /* 整体实现思路就是这样
    function dispatch(action) {
        //定义是在producer
        stateMachine.producer(action);
    }
  */
  stateMap[stateName]["producer"](action);
}

export default dispatch;
