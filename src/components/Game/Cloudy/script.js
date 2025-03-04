import Cloudy from "./Cloudy";
console.log("script");
const cloudy = new Cloudy(document.getElementById("cloudy"));
let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    cloudy.update(delta);
  }
  lastTime = time;
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);
