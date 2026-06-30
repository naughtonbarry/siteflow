/* Saved-clips library: canned answers the retailer reuses across enquiries. */
(function () {
  const { fmtDuration } = VR;

  function ClipLibrary({ savedClips, onAttach }) {
    if (!savedClips.length) {
      return (
        <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-xs text-stone-500">
          No saved clips yet. Record an answer and “Save to library” to reuse it
          on future enquiries.
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {savedClips.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-lg border border-stone-200 p-2.5"
          >
            <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded bg-stone-800 text-sm text-stone-300">
              ▶
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-700">{c.title}</p>
              <p className="text-xs text-stone-400">
                {fmtDuration(c.durationSec)}
                {c.simulated ? " · simulated" : ""}
              </p>
            </div>
            <button
              onClick={() => onAttach(c)}
              className="shrink-0 rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Attach
            </button>
          </div>
        ))}
      </div>
    );
  }

  VR.ClipLibrary = ClipLibrary;
})();
