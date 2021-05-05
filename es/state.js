import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { isCorrectVal, isObject } from './utils';
import { isObservable, defer, of, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import eventBus from './eventBus';
import fromAction from './fromAction';
import StateSubject from "./stateSubject";
import store from './store';
var stateMap = store.stateMap;

var StateMachine = /*#__PURE__*/function () {
  function StateMachine(state$, options) {
    var _this = this;

    _classCallCheck(this, StateMachine);

    _defineProperty(this, "value", null);

    this.name = options.name;

    if (isCorrectVal(stateMap[this.name])) {
      throw new Error("\u540D\u4E3A'".concat(this.name, "'\u7684\u72B6\u6001\u6570\u636E\u5DF2\u5B58\u5728\uFF0C\u4E0D\u80FD\u91CD\u590D\u521B\u5EFA\uFF01"));
    }

    this.defaultValue = options.defaultValue;
    this.value = options.defaultValue;
    this.initial$ = isObservable(options.initial) ? options.initial : of(this.value);

    if (isCorrectVal(options.producer)) {
      this._producer = options.producer;

      var observableFactory = function observableFactory(action) {
        if (!isObject(action)) {
          return of(action);
        } else if (isObject(action) && isCorrectVal(action.type)) {
          return defer(function () {
            var _result = action.result;
            return isObservable(_result) ? _result : of(_result);
          });
        }
      };

      this.subscription = merge(this.initial$, fromAction(this.name)).pipe(switchMap(observableFactory)).subscribe(function (val) {
        _this.value = val;
        state$.next(val);
      }, function (err) {
        return state$.error(err);
      });
    } else {
      this.initial$.subscribe(function (val) {
        _this.value = val;
        state$.next(val);
      }, function (err) {
        return state$.error(err);
      });
    }
  }

  _createClass(StateMachine, [{
    key: "producer",
    value: function producer(action) {
      var _this2 = this;

      this._producer(function (result) {
        eventBus.next(_defineProperty({}, _this2.name, Object.assign({}, action, {
          type: _this2.name,
          result: result
        })));
      }, this.value, action);
    }
  }]);

  return StateMachine;
}();

function state(options) {
  var state$ = new StateSubject();
  var stateMachine = new StateMachine(state$, options);
  stateMap[options.name] = stateMachine;
  return state$;
}

export default state;