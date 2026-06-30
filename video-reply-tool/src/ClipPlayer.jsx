/* Clip playback, shared by AnswerPanel and CustomerView. */
(function () {
  const { fmtDuration } = VR;

  function ClipPlayer({ clip, rounded = "rounded-xl" }) {
    if (clip.simulated || !clip.url) {
      return (
        <div className={`flex aspect-video flex-col items-center justify-center gap-2 bg-stone-800 text-stone-300 ${rounded}`}>
          <span className="text-4xl">▶️</span>
          <span className="text-sm">Simulated clip · {fmtDuration(clip.durationSec)}</span>
        </div>
      );
    }
    return (
      <video
        src={clip.url}
        controls
        className={`aspect-video w-full bg-black object-cover ${rounded}`}
      />
    );
  }

  VR.ClipPlayer = ClipPlayer;
})();
