import { SyncHook } from "tapable";

class Car {
  constructor() {
    this.hooks = {
      carStarted: new SyncHook(),
      // 可以约定接收的参数
      radioChanged: new SyncHook(["radioStation"]),
    };
  }
  turnOn() {
    this.hooks.carStarted.call();
  }

  setRadioStation() {
    // 可以从这里把参数给进去
    this.hooks.radioChanged.call("1");
  }
}
const myCar = new Car();

// 注册一个事件
// 第一个参数是你的插件的名字
myCar.hooks.carStarted.tap("test", () => {
  console.log("nihao");
});

// 调用 call 就可以执行之前所有注册的事件了
myCar.turnOn();

// 可以接收参数
myCar.hooks.radioChanged.tap("second", (radioStation) => {
  console.log(radioStation);
});

myCar.setRadioStation();
