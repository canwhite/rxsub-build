# rxsub-build
通过babel构建适用于前端或者commonjs标准的工具，方便npm发布，主要是babel的使用

# run 
```
yarn install

yarn babel

```

# PS
如果想生成commonjs标准的工具  
请将.babelrc中的注释打开

# des
```
plugins
如果有配置项，需要用中括号包裹
[
    "@babel/plugin-proposal-decorators",
    {
        "legacy": true
    }
],

--------------------------------------------------
@babel/plugin-proposal-decorators 使用装饰器

装饰器用于增加或者修改类的功能，装饰器的返回值也是一个函数/类对象。 

它经常用于有切面需求的场景，比如：插入日志、性能测试、事务处理、缓存、权限校验等场景，装饰器是解决这类问题的绝佳设计。

用作装饰器的类或者方法，内部实现很多是闭包的实现方式
当然也有一般的实现

(1)类的装饰
class MyTestableClass {
  // ...
}
function testable(target) {
  target.isTestable = true;
}
MyTestableClass.isTestable // true

(2)方法的装饰

class Math {
    //相当于把log放在了add内部，
    //add执行的时候，log就能执行
    @log 
    add(a, b) {
        return a + b;
    }
}
function log(target, name, descriptor) {
  var oldValue = descriptor.value;
  descriptor.value = function() {
    //输出方法名和参数
    console.log(`Calling ${name} with`, arguments);
    //函数绑定执行
    return oldValue.apply(this, arguments);
  };
  //将函数返回
  return descriptor;
}
const math = new Math();
// passed parameters should get logged now
math.add(2, 4);

------------------------------------------------------
@babel/plugin-syntax-dynamic-import
import语法动态导入
需要注意动态导入最大的好处就是实现了懒加载，用到那个模块才会加载那个模块，可以提高SPA应用程序的首屏加载速度

------------------------------------------------------
@babel/preset-react
主要是应对react中专有的一些Syntax


```


# POST：
[base-babel基础使用](https://github.com/canwhite/qc-babel-test)
[阮一峰的装饰器讲解](https://www.bookstack.cn/read/es6-3rd/spilt.2.docs-decorator.md)

