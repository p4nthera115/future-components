import IdCard from "./components/IdCard"
import IdCardBlack from "./components/IdCardBlack"
import BirdCard from "./components/bird-card"
// import LiquidGlassTesting from "./components/liquid-glass/liquid-glass-testing"

export default function App() {
  return (
    <div className="w-screen relative flex flex-col justify-center items-center bg-linear-to-t from-[#c2c2c2] to-[#ffffff]">
      <IdCard />
      <IdCardBlack />
      {/* <LiquidGlassTesting /> */}
      <BirdCard />
    </div>
  )
}
