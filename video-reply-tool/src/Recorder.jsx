/* The one genuinely-real piece: webcam capture + MediaRecorder. */
(function () {
  const { useState, useRef, useEffect, useCallback } = React;
  const { fmtDuration, DemoNote } = VR;

  function Recorder({ onClipReady }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const [state, setState] = useState("idle"); // idle | live | recording | error
    const [seconds, setSeconds] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const stopStream = useCallback(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }, []);

    useEffect(() => () => stopStream(), [stopStream]); // cleanup on unmount

    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        setState("live");
      } catch (err) {
        setErrorMsg(err && err.message ? err.message : "Camera unavailable");
        setState("error");
      }
    }

    function startRecording() {
      if (!streamRef.current) return;
      chunksRef.current = [];
      const rec = new MediaRecorder(streamRef.current);
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob); // FAKED hosting: in-memory only
        onClipReady({ url, durationSec: seconds, recordedAt: Date.now() });
      };
      recorderRef.current = rec;
      rec.start();
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setState("recording");
    }

    function stopRecording() {
      clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      stopStream();
      setState("idle");
    }

    // Fallback for when there's no camera/permission — keeps the demo flow usable.
    function useSimulatedClip() {
      onClipReady({ url: null, durationSec: 12, recordedAt: Date.now(), simulated: true });
    }

    return (
      <div>
        <div className="relative overflow-hidden rounded-xl bg-stone-900 aspect-video">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
          />
          {state === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-300">
              <span className="text-4xl">🎥</span>
              <button
                onClick={enableCamera}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Enable camera
              </button>
            </div>
          )}
          {state === "recording" && (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              {fmtDuration(seconds)}
            </div>
          )}
          {state === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-stone-300">
              <span className="text-3xl">📷</span>
              <p className="text-sm">Camera unavailable: {errorMsg}</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {state === "live" && (
            <button
              onClick={startRecording}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              ● Start recording
            </button>
          )}
          {state === "recording" && (
            <button
              onClick={stopRecording}
              className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-900"
            >
              ■ Stop & attach
            </button>
          )}
          {(state === "idle" || state === "error") && (
            <button
              onClick={useSimulatedClip}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Use a simulated clip
            </button>
          )}
        </div>

        <div className="mt-3">
          <DemoNote>
            Recording is real and uses your webcam, but the clip is held only in
            this browser tab (in-memory). There is no upload or video hosting yet.
          </DemoNote>
        </div>
      </div>
    );
  }

  VR.Recorder = Recorder;
})();
