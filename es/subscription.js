import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from "react";
import store from "./store";
var eventLog = store.eventLog;
import { isObject, isCorrectVal } from "./utils";
/**
 * observable与react组件的集成(将observable转换为组件属性)
 * @param {object} observablesMap - 可观察对象集合
 * @param {object} inputOptions - 选项
 * @param {object} inputOptions.defaultProps - 组件的默认属性
*/

var subscription = function subscription(observablesMap, inputOptions) {
  var options = inputOptions || {};
  /*
  这部分是一个HOC，返回的也是一个组件，
  复杂逻辑自己实现了
  在这里主要是为了把值订阅了给到组件
  */

  var handler = function handler(Comp) {
    if (!isObject(observablesMap)) throw new TypeError("\u65B9\u6CD5subscription()\u7684\u53C2\u6570observablesMap\u5FC5\u987B\u662Fobject\u7C7B\u578B");

    var Permeate = /*#__PURE__*/function (_React$PureComponent) {
      _inherits(Permeate, _React$PureComponent);

      var _super = _createSuper(Permeate);

      function Permeate() {
        var _this;

        _classCallCheck(this, Permeate);

        _this = _super.call(this);
        _this.state = {};
        _this.subscriptionArr = [];
        _this.suspendedObservableKeys = Object.keys(observablesMap);
        _this._suspendedObservables = [];
        _this._innerObservableMaps = {};

        if (_this.suspendedObservableKeys.length > 0) {
          _this.suspendedObservableKeys.forEach(function (key) {
            _this._suspendedObservables.push(observablesMap[key]);
          });
        } else {
          throw new TypeError("\u65B9\u6CD5subscription()\u7684\u53C2\u6570observablesMap\u4E0D\u5141\u8BB8\u4F20\u4E00\u4E2A\u7A7A\u7684object");
        }

        _this.state = Object.assign({}, _this._innerObservableMaps, isCorrectVal(options.defaultProps) ? options.defaultProps : {});
        return _this;
      }

      _createClass(Permeate, [{
        key: "componentWillMount",
        value: function componentWillMount() {
          var _this2 = this;

          var obsArr = this._suspendedObservables,
              len = obsArr.length;

          var _loop = function _loop(i) {
            var subscription = obsArr[i].subscribe(function (data) {
              // const type = obsArr[i]["__type__"];
              // const pushHeaders = eventLog.pushHeadersMap[type];
              if (_this2.state[_this2.suspendedObservableKeys[i]] !== data) {
                // if (isCorrectVal(pushHeaders))  console.log(pushHeaders);
                _this2.setState(_defineProperty({}, _this2.suspendedObservableKeys[i], data));
              }
            });

            _this2.subscriptionArr.push(subscription);
          };

          for (var i = 0; i < len; i++) {
            _loop(i);
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.subscriptionArr.forEach(function (subscription) {
            subscription.unsubscribe();
          });
        }
      }, {
        key: "render",
        value: function render() {
          return /*#__PURE__*/React.createElement(Comp, _extends({}, this.props, this.state));
        }
      }]);

      return Permeate;
    }(React.PureComponent);

    Permeate.displayName = "Permeate(".concat(Comp.displayName || Comp.name || "Component", ")");
    return Permeate;
  };

  return handler;
};

export default subscription;