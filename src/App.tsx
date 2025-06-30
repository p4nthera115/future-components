import HumanTouch from "./components/human-touch"
import IdCard from "./components/IdCard"
import IdCardBlack from "./components/IdCardBlack"
// import IBot from "./components/iBot"
import IosToggle from "./components/ios-toggle"
import LiquidGlassTesting from "./components/liquid-glass/liquid-glass-testing"

export default function App() {
  return (
    <div className="w-screen relative flex flex-col justify-center items-center bg-linear-to-t from-[#676767] to-[#bdbdbd]">
      {/* <IdCard /> */}
      {/* <IdCardBlack /> */}
      {/* <LiquidGlassTesting /> */}
      {/* <IBot /> */}
      {/* <IosToggle /> */}
      <HumanTouch />
    </div>
  )
}
