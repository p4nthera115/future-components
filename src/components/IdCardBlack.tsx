import { motion } from "framer-motion"
import { useState } from "react"

export default function IdCardBlack() {
  const [hover, setHover] = useState(false)
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <motion.div
        className="group  ursor-default text-xs font-oxanium rounded-3xl shadow-2xl overflow-hidden bg-[#e4e4e4] border-[#c9cccd] border-4 flex flex-col relative shadow-black"
        initial={false}
      >
        <motion.div
          className="rounded-[1.19rem] overflow-hidden relative size-75 flex justify-end flex-col"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileHover={{ width: "35rem", height: "35rem" }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            type: "tween",
            height: {
              delay: hover ? 0 : 0.4,
              duration: 0.4,
              ease: "easeInOut",
            },
          }}
        >
          <video
            src="mannequindroid.mp4"
            className="rounded-2xl absolute opacity-0 group-hover:rounded-2xl transition-all duration-500 group-hover:delay-400 group-hover:opacity-50"
            muted
            loop
            autoPlay
          />
          <div className="h-full w-full bg-gray-200/20 absolute"></div>
          <div className="h-full w-full bg-white/50 absolute scale-95 rounded-2xl blur-lg"></div>

          <section className="h-75 w-full relative justify-between flex -mt-1.5">
            <div className="w-1/2 p-6 text-black absolute"></div>
            <UiCard />
            <div className="ml-auto right-0 absolute">
              <p className="text-black text-xl m-3 mt-4 font-oxanium absolute right-0 group-hover:scale-80 group-hover:m-7 group-hover:delay-400 duration-500 transition-all">
                PCA-15
              </p>
              <video
                src="mannequindroid.mp4"
                className="mix-blend-hard-light rounded-2xl max-w-75 group-hover:scale-85 group-hover:rounded-2xl transition-all duration-500 group-hover:delay-400 group-hover:opacity-80 group-hover:shadow-xl shadow-black/40 outline"
                muted
                loop
                autoPlay
              />
            </div>
            <div className="bg-linear-to-b from-black/10 h-1/2 w-full absolute z-10 group-hover:opacity-0 group-hover:delay-400 duration-400"></div>
            <div className="bg-linear-to-r left-0 from-black/5 h-full w-1/2 absolute z-10 group-hover:opacity-0 group-hover:delay-400 duration-400"></div>
            <div className="bg-linear-to-l right-0 from-black/5 h-full w-1/2 absolute z-10 group-hover:opacity-0 group-hover:delay-400 duration-400"></div>
          </section>

          <section className="flex w-full h-1/4 group-hover:h-1/2 rounded-2xl transition-all duration-500 p-3 backdrop-blur rounded-t-0">
            <p className="pointer-events-none cursor-default absolute text-black font-oxanium z-50 left-1/2 text-xl top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tight group-hover:-translate-y-3/4 group-hover:opacity-0 group-hover:duration-500 delay-300 group-hover:delay-0 transition-all">
              learn more
            </p>

            <div className="h-full w-full relative flex flex-col justify-center bg-black/10 backdrop-blur-md p-3 rounded-lg group-hover:rounded-2xl group-hover:bg-black/40 group-hover:delay-400 transition-all duration-400 group-hover:border-5 border-black/8">
              <div className="w-[96%] h-0 group-hover:h-full absolute top-0.5 transition-all group-hover:delay-500 flex flex-row">
                <div className="bg-white animate-pulse rounded-full min-w-5 size-5 mt-3 scale-0 group-hover:scale-100 duration-200 group-hover:delay-600 "></div>
                <ChatText />
              </div>

              <input
                type="text"
                placeholder="talk to PCA-15"
                className="z-30 w-[95%] h-0 absolute bg-black/30 border-black/4 border-3 rounded-xl bottom-3 opacity-0 transition-all group-hover:opacity-100 group-hover:h-12 duration-300 group-hover:delay-500 outline-none p-3 text-lg"
              />
            </div>

            <div className="h-full w-full pointer-events-none bg-white/100 absolute scale-70 group-hover:opacity-0 transition duration-500 rounded-2xl blur-2xl"></div>
          </section>
        </motion.div>
      </motion.div>
    </div>
  )
}

const UiCard = () => {
  return (
    <div className="cursor-default text-black size-5 z-30 backdrop-blur-xs rounded-3xl drop-shadow-md shadow-md scale-97 border-white border-7 absolute top-0 m-3 mt-5 group-hover:size-65 group-hover:rounded-2xl group-hover:delay-400 group-hover:border group-hover:animate-none group-hover:duration-420 group-hover:shadow-xl group-hover:drop-shadow-none duration-420 ease-in-out flex justify-center items-center">
      <div className="h-full w-full bg-neutral-200/30 backdrop-blur absolute rounded-2xl"></div>
      <div className="h-full w-full bg-white/80 absolute scale-70 rounded-2xl blur-2xl"></div>

      <div className="overflow-scroll h-full w-full p-4 z-10 text-lg flex flex-col opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:duration-700 group-hover:delay-750 transition-all">
        <p>Personal Crisis Assistant</p>

        <p className="text-[0.85rem] leading-4.5 opacity-90 pt-2 pb-3">
          Help when you need it most. <br /> Your crisis companion for every
          situation.
        </p>
        <hr className="pb-4 opacity-30" />

        <div className="w-full flex flex-col gap-2 text-xs opacity-70">
          <div className="flex flex-row justify-between">
            <span>height :</span>
            <span>165cm</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>weight:</span>
            <span>60kg</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>AI Personality :</span>
            <span>friendly</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>power source :</span>
            <span>kinetic, solar</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>battery life :</span>
            <span>self-sustaining</span>
          </div>
          <div className="flex flex-row justify-between">
            <span>connectivity :</span>
            <span>neural link</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatText = () => {
  const text =
    "Hi! I'm PCA-15, your new personal crisis assistant. Do you have any questions for me?"

  return (
    <motion.div className="" initial="hidden" whileHover="visible">
      <motion.p
        className=" w-full text-white rounded-xl outline-none p-3 text-base -mt-0.5 z-50"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delay: 0.3,
              staggerChildren: 0.015,
            },
          },
        }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.p>
    </motion.div>
  )
}
