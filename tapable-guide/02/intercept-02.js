import { SyncHook } from "tapable";
class Car {
  constructor() {
    this.hooks = {
      carStarted: new SyncHook(),
    };

    this.hooks.carStarted.intercept({
      register: (tapInfo) => {
        if (tapInfo.name === "NitroPlugin") {
          console.log(`🚫 ${tapInfo.name} is banned 🚫`);

          // 基于拦截器 ，就可以随意的修改每一个事件的函数了
          tapInfo.fn = () => {
            console.log(`🚨 Police are on their way 🚨`);
          };
        } else {
          console.log(`${tapInfo.name} is registered`);
        }

        return tapInfo;
      },
    });
  }

  turnOn() {
    this.hooks.carStarted.call();
  }
}

const myCar = new Car();
myCar.hooks.carStarted.tap("EngineLampPlugin", () => {
  console.log("Car started!");
});
// EngineLampPlugin is registered
myCar.hooks.carStarted.tap("NitroPlugin", () => {
  console.log("🏎 lets go fast");
});
// 🚫 NitroPlugin is banned 🚫

myCar.turnOn();
// Car started!
// 🚨 Police are on their way 🚨
