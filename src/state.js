import { isCorrectVal, isObject } from './utils';
import { isObservable, defer, of, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import eventBus from './eventBus';//提供一个hot observable
import fromAction from './fromAction';//
import StateSubject from "./stateSubject";//创建一个壳，用于管理observable
import store from './store';
const stateMap = store.stateMap;//store里边的stateMap，提供全局容器
/* 

const {BehaviorSubject} = require("rxjs");
class StateMachine{
  constructor(subject,value){
      //这个subject就是我们现在定义的stateSubject
      //主要使用他的next生产值
      this.subject = subject;
      this.value = value;
  }

  //
  //现在又搞了一个EventBus作传递实在是增加心智成本
  //在订阅前经历了EventBus=>formAction处理=>subscribe
  //异步的时候在fromAction之前是先用nitial$的值

  producer(action){
      let oldValue = this.value;
      let newValue;
      switch (action.type) {
          case 'plus':
            newValue = ++oldValue;
            this.value = newValue;//将新值给this.value
            this.subject.next(newValue);
            break;
          case 'toDouble':
            newValue = oldValue * 2;
            this.value = newValue;
            this.subject.next(newValue);
            break;
        }
  }

} */

class StateMachine {
  value = null;
  //构造函数，state$是作履带的
  constructor(state$, options) {
    this.name = options.name;
    if (isCorrectVal(stateMap[this.name])) {
      throw new Error(`名为'${this.name}'的状态数据已存在，不能重复创建！`);
    }

    this.defaultValue = options.defaultValue;
    this.value = options.defaultValue;
    //异步的initial也可以给普通初始值，这里会自己包裹
    this.initial$ = isObservable(options.initial) ? options.initial : of(this.value);
    

    if (isCorrectVal(options.producer)) {
      this._producer = options.producer;

      //需要action参数
      const observableFactory = action => {
        //如果action不是一个obj
        if (!isObject(action)) {
          return of(action);
        } 
        //如果是个obj，且给了type值
        else if (isObject(action) && isCorrectVal(action.type)) {
          //defer调用一个 Observable 工厂以为每个新的 Observer 创建 Observable
          return defer(() => {
            const _result = action.result;
            return isObservable(_result) ? _result : of(_result);
          });
        }
      };

      /*-------------------------------------------
      这部分是提前作好订阅工作，以便触发的时候能拿到值
      --------------------------------------------*/
      //fromAction将evnetBus中的event又包装了下
      //生成processEvent$
      //然后processEvent$在这里提前订阅，有值的时候就更新
      //hot observable订阅的越早，得到的值越完全，所以放到这里
      //闭环的最后一步
      //监听，流水线终点
      /* count$.subscribe(val => {
        console.log(val);
      }); */
      //触发在dispatch里

  
      this.subscription = merge(this.initial$, fromAction(this.name))
        .pipe(switchMap(observableFactory))
        .subscribe(
          val => {
            //eventBus=>processEvent$订阅之后拿到新值再用
            //subject传递，这样才算走完之前例子里的流程
            //然后subscription.js中在定义这个值，
            //用HOC将订阅的值用组件包裹一下返回            
            this.value = val;
            state$.next(val);
          },
          err => state$.error(err)
        );
    } else {
      //如果没有producer
      this.initial$.subscribe(
        val => {
          this.value = val;
          state$.next(val);
        },
        err => state$.error(err)
      );
    }
  }

  producer(action) {
    this._producer(
      result => {
        //evnetBus只是作了一个事件的传递
        //evnetBus是起点observable，
        //还要经过处理之后再生成processEvent$并返回
        //然后订阅的是fromAction返回的processEvent$
        //evnetBus是运输层
        eventBus.next({
          [this.name]: Object.assign({}, action, { type: this.name, result })
        });
      },
      this.value,
      action
    );
  };
}

function state(options) {

  //创建了一个state类，用于subject的管理
  const state$ = new StateSubject();

  //然后就生成的subject
  const stateMachine = new StateMachine(state$, options);
  
  //用stateMap对实例进行管理
  stateMap[options.name] = stateMachine;

  return state$;



}

export default state;
