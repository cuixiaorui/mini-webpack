import { SyncHook, AsyncParallelHook } from "tapable";

class Car {
  constructor() {
    this.hooks = {
      // 加速
      accelerate: new SyncHook(["newSpeed"]),
      // 刹车
      brake: new SyncHook(),
      // 计算路线
      calculateRoutes: new AsyncParallelHook([
        "source",
        "target",
        "routesList",
      ]),
    };
  }
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = [];
    return this.hooks.calculateRoutes
      .promise(source, target, routesList)
      .then((res) => {
        // res is undefined for AsyncParallelHook
        return routesList;
      });
  }

  useNavigationSystemAsync(source, target, callback) {
    //     const routesList = new List();
    const routesList = [];
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err) => {
      if (err) return callback(err);
      callback(null, routesList);
    });
  }
}

const myCar = new Car();
// Use the tap method to add a consument
// 没有参数
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
// 有参数
myCar.hooks.accelerate.tap("LoggerPlugin", (newSpeed) =>
  console.log(`Accelerating to ${newSpeed}`)
);
// 异步的
// tapPromise 允许返回一个 promise
myCar.hooks.calculateRoutes.tapPromise(
  "GoogleMapsPlugin",
  (source, target, routesList) => {
    // return a promise
    const route = {
      source,
      target,
    };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        routesList.push(route);
        resolve();
      }, 1000);
    });
    //     return google.maps.findRoute(source, target).then((route) => {
    //       routesList.add(route);
    //     });
  }
);
// tabAsync 是需要通过 callback 来处理
myCar.hooks.calculateRoutes.tapAsync(
  "BingMapsPlugin",
  (source, target, routesList, callback) => {
    //     bing.findRoute(source, target, (err, route) => {
    //       if (err) return callback(err);
    //       routesList.add(route);
    //       // call the callback
    //       callback();
    //     });

    const route = {
      source,
      target,
    };
    routesList.push(route);
    // call the callback
    callback();
  }
);

// You can still use sync plugins
myCar.hooks.calculateRoutes.tap(
  "CachedRoutesPlugin",
  (source, target, routesList) => {
    //     const cachedRoute = cache.get(source, target);
    //     if (cachedRoute) routesList.push(cachedRoute);
    routesList.push("sync plugin router");
  }
);

// 先调用 promise
// 会先触发 promise 然后触发 callback  最后是同步的
// const result = await myCar.useNavigationSystemPromise("北京", "上海");
// console.log(result);

// 调用的流程和上面的一样
// 先调用 promise
// 会先触发 promise 然后触发 callback  最后是同步的
myCar.useNavigationSystemAsync("北京", "上海", (result) => {
  console.log(result);
});

// 那么也就是说
// callAsync 和 promise 的调用方式就是 promise 和 callback 的区别
// 而且这个是并行的，不等待

// 那么现在的使用方式
// 主流程里面调用方法
// 这个方法触发 tap ，（可以把数据容器通过参数给到各个 tap fn 内）
// 在 tap fn 内基于数据容器来处理数据
// 最后这一圈 tap fn 都处理完，继续厚道主流程里面，然后获取到值，或者现在数据容器里面的数据已经被修改了
// 然后继续后面的流程

// 参考自： https://github.com/webpack/tapable
