import { Observable } from 'rxjs';

function StateSubject(value) {
  this.observerList = [];
  this.value = value;
}
//将StateSubject的原型指向Observable，然后相当于对其的一个继承
StateSubject.prototype = Object.create(

  Observable.create(function(observer) {
    if (typeof this.value !== "undefined"){
      observer.next(this.value);
    } 
    //其实这部分目前来看，并没有什么用，这个list本身就是无用代码
    this.observerList.push(observer);
  })

);
//执行next对应使用这个值的都会遍历
StateSubject.prototype.next = function(val) {
  this.value = val;
  this.observerList.forEach(observer => {
    observer.next(val);
  });
};

export default StateSubject;
