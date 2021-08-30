import { SyncHook } from "tapable";
class Car {
  constructor() {
    this.hooks = {
      radioChanged: new SyncHook(["radioStation"]),
    };

    this.hooks.radioChanged.intercept({
      // 类似于 register  但是不可以更改 tapInfo 的值
      tap: (tapInfo) => {
        console.log(`${tapInfo.name} is getting called`);
	// 修改了 fn 也不管用
	// tapInfo.fn = ()=>{}
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
myCar.hooks.radioChanged.tap("SpeakerPlugin", (radioStation) => {
  console.log("Updating Speaker UI", radioStation);
});

myCar.setRadioStation("100.1");
// RadioPlugin is getting called
// Station was changed 100.1
// SpeakerPlugin is getting called
// Updating Speaker UI 100.1

myCar.setRadioStation("100.3");
// RadioPlugin is getting called
// Station was changed 100.3
// SpeakerPlugin is getting called
// Updating Speaker UI 100.3
