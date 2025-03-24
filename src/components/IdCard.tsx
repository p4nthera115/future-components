import { useEffect, useRef, } from "react"

export default function IdCard() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoRef.current?.play();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="group text-xs font-mono rounded-3xl shadow-2xl overflow-hidden bg-[#979490] border-[#8a88845d] border-4 flex flex-col relative shadow-black">
      <div className="h-full w-full absolute flex flex-row p-3 z-20 justify-between">
        <div className="justify flex flex-col">
          <p>entity: </p>
          <p>3e3b3653618115</p>
          <br />
          {/* <p>
            captured:
          </p>
          <p className="">FALSE</p> */}
        </div>
        <div className="justify flex flex-col text-end">
          <p>
            threat-level:
          </p>
          <p className="text-md bg-white animate-pulse text-red-500 font-normal tracking-widest">HIGH</p>
          <br />
          <p>status:</p>
          <p>ACTIVE</p>
          <br />
          <p>location:</p>
          <p>UNKNOWN</p>
        </div>

      </div>
      {/* <div className="backdrop-blur h-20 w-full absolute bottom-0 z-50"></div> */}
      <div className="rounded-[1.19rem] overflow-hidden relative border bg-[#656361] border-black/20 h-75 flex">
        <div className="h-full w-full absolute bg-gradient-to-t from-black/40 z-50"></div>
        <video
          ref={videoRef}
          className="filter mix-blend-lighten flex w-xs rounded-2xl absolute"
          src="brainface-reversed.webm"
          muted
          loop
        ></video>
        <video
          className="filter absolute mix-blend-color-dodge flex w-xs rounded-2xl"
          src="brainface-reversed.webm"
          autoPlay
          muted
          loop
        ></video>
        <div className="h-full w-full bg-[#656361] border -z-10 rounded-[18px]"></div>
      </div>

      <div className="h-8 w-xs bg-[#979490] group-hover:h-48 transition-all duration-500 ease-in-out flex flex-row gap-4 px-3 py-4">
        <div className="flex w-1/2 flex-col gap-4">
          <div className="border border-neutral-300 p-2 gap-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition  duration-300">
            <div className="w-full flex flex-row gap-4 justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition delay-100 duration-300">
              <p>AGE: </p>
              <p>UNKNOWN</p>
            </div>
            <div className="w-full flex flex-row gap-4 justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition delay-200 duration-300">
              <p>HEIGHT: </p>
              <p>250cm</p>
            </div>
            <div className="w-full flex flex-row gap-4 justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition delay-250 duration-300">
              <p>WEIGHT: </p>
              <p>300kg</p>
            </div>
          </div>

          <div className="flex flex-row gap-1 px-1 opacity-0 group-hover:opacity-100 transition duration-300">
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className={`h-8 border w-1 bg-white animate-pulse ${i === 0 ? 'h-9' : i === 17 ? 'h-9' : 'h-8'}`}
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              >
              </div>
            ))}
          </div>
        </div>


        <div className="w-1/2 flex flex-col border border-neutral-300 mb-6 opacity-0 group-hover:opacity-100 transition duration-300 delay-100 overflow-hidden relative">
          <div className="h-33.5 w-34.5 border opacity-0 group-hover:opacity-100 delay-200 absolute noise"></div>
          <img className="camera opacity-70 aspect-auto scale-250 w-full translate-x-10  translate-y-8 group-hover:-translate-x-20 group-hover:-translate-y-0 duration-6000 transition" src="homeland.jpeg" alt="" />
        </div>

        <p className="flex w-full justify-between absolute pr-6 bottom-0 pb-1.5">
          REF:
          <span>
            3e3b3653618115_CEPHALON
          </span>
        </p>
      </div>

    </div >
  )
}
