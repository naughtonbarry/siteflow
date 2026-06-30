/* Pure formatting helpers. */
(function () {
  VR.timeAgo = function timeAgo(ts) {
    const mins = Math.round((Date.now() - ts) / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.round(mins / 60);
    return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  };

  VR.fmtDuration = function fmtDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };
})();
