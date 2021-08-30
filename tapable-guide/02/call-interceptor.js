import { SyncHook } from "tapable";
class Car {
  constructor() {
    this.hooks = {
      radioChanged: new SyncHook(["radioStation"]),
    };

    this.hooks.radioChanged.intercept({
      // 可以通过 call 拦截器来获取 事件函数的参数
      // 拦截器都是先会被调用的
      call: (radioStation) => {
        console.log("Looking for signal...");
        console.log(`Signal found for ${radioStation}`);
      },
    });
  }

  setRadioStation(radioStation) {
    this.hooks.radioChanged.call(radioStation);
  }
}

const myCar = new Car();
myCar.hooks.radioChanged.tap("RadioPlugin", (radioStation) => {
  console.log("Station was changed", radioStation);
});

myCar.setRadioStation("100.1");
// Looking for signal...
// Signal found for 100.1
// Station was changed 100.1

myCar.setRadioStation("100.3");
// Looking for signal...
// Signal found for 100.3
// Station was changed 100.3
