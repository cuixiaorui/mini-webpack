import { SyncHook } from "tapable";

class Car {
  constructor() {
    this.hooks = {
      carStarted: new SyncHook(),
    };

    // 会先触发 intercept 然后再会调用 tap 给到的函数
    this.hooks.carStarted.intercept({
      register: (tapInfo) => {
        console.log(`${tapInfo.name} is registered`);
	console.log(tapInfo)
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
myCar.hooks.carStarted.tap("BluetoothPlugin", () => {
  console.log("Bluetooth enabled");
});
// BluetoothPlugin is registered

myCar.turnOn();
// Car started!
// Bluetooth enabled
