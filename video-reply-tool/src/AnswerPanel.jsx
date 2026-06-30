/* Record + send for a single enquiry. An answer is an ordered list of clips,
 * each either freshly recorded or attached from the saved-clips library. */
(function () {
  const { useState } = React;
  const { Avatar, ChannelTag, StatusBadge, DemoNote, Recorder, ClipPlayer, ClipLibrary, CHANNELS } = VR;

  // One attached clip, with remove + (for personal clips) save-to-library.
  function AttachedClip({ clip, locked, onRemove, onSave }) {
    const [naming, setNaming] = useState(false);
    const [title, setTitle] = useState("");
    const inLibrary = Boolean(clip.sourceClipId);

    return (
      <div>
        {clip.title && (
          <p className="mb-1 text-xs font-medium text-stone-500">{clip.title}</p>
        )}
        <ClipPlayer clip={clip} />
        {!locked && (
          <div className="mt-1.5 flex items-center gap-3">
            {inLibrary ? (
              <span className="text-xs text-green-600">✓ In library</span>
            ) : (
              !naming && (
                <button
                  onClick={() => setNaming(true)}
                  className="text-xs font-medium text-stone-500 hover:text-stone-700"
                >
                  ＋ Save to library
                </button>
              )
            )}
            <button
              onClick={onRemove}
              className="ml-auto text-xs text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
        {naming && (
          <div className="mt-2 flex items-center gap-2">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name this clip (e.g. Fabric care)"
              className="min-w-0 flex-1 rounded-md border border-stone-300 px-2 py-1 text-xs focus:border-stone-500 focus:outline-none"
            />
            <button
              disabled={!title.trim()}
              onClick={() => {
                onSave(title.trim());
                setNaming(false);
                setTitle("");
              }}
              className="shrink-0 rounded-md bg-stone-800 px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => {
                setNaming(false);
                setTitle("");
              }}
              className="shrink-0 text-xs text-stone-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  function AnswerPanel({
    enquiry,
    savedClips,
    onRecordClip,
    onAttachSaved,
    onRemoveClip,
    onSaveToLibrary,
    onSend,
    onPreviewCustomer,
  }) {
    const [tab, setTab] = useState("record"); // record | library
    const clips = enquiry.clips || [];

    return (
      <div className="flex h-full flex-col">
        {/* enquiry header */}
        <div className="border-b border-stone-200 p-5">
          <div className="flex items-start gap-3">
            <Avatar name={enquiry.customer} size={44} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-stone-900">{enquiry.customer}</h2>
                <ChannelTag channel={enquiry.channel} />
              </div>
              <p className="text-sm text-stone-500">{enquiry.phone}</p>
            </div>
            <StatusBadge status={enquiry.status} sent={enquiry.sent} />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm">
            <span className="text-lg">{enquiry.productEmoji}</span>
            <span className="font-medium text-stone-700">{enquiry.product}</span>
          </div>

          <p className="mt-3 rounded-xl rounded-tl-sm bg-stone-100 p-3 text-sm text-stone-700">
            “{enquiry.question}”
          </p>
        </div>

        {/* answer body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* attached clips */}
          {clips.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-stone-700">
                Your answer{" "}
                {enquiry.sent ? "(sent)" : `· ${clips.length} clip${clips.length > 1 ? "s" : ""}`}
              </h3>
              <div className="space-y-4">
                {clips.map((c) => (
                  <AttachedClip
                    key={c.id}
                    clip={c}
                    locked={enquiry.sent}
                    onRemove={() => onRemoveClip(enquiry.id, c.id)}
                    onSave={(title) => onSaveToLibrary(enquiry.id, c, title)}
                  />
                ))}
              </div>
            </div>
          )}

          {!enquiry.sent ? (
            <>
              <h3 className="mb-3 text-sm font-semibold text-stone-700">Add a clip</h3>
              <div className="rounded-xl border border-stone-200 p-4">
                <div className="mb-4 flex gap-1 rounded-lg bg-stone-100 p-1 text-sm">
                  <button
                    onClick={() => setTab("record")}
                    className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
                      tab === "record"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    🎥 Record
                  </button>
                  <button
                    onClick={() => setTab("library")}
                    className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
                      tab === "library"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    📚 Library
                  </button>
                </div>
                {tab === "record" ? (
                  <Recorder onClipReady={(clip) => onRecordClip(enquiry.id, clip)} />
                ) : (
                  <ClipLibrary
                    savedClips={savedClips}
                    onAttach={(saved) => onAttachSaved(enquiry.id, saved)}
                  />
                )}
              </div>

              <button
                disabled={clips.length === 0}
                onClick={() => onSend(enquiry.id)}
                className="mt-4 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send via {CHANNELS[enquiry.channel].label} →
              </button>
              {clips.length === 0 && (
                <p className="mt-2 text-center text-xs text-stone-400">
                  Add at least one clip to enable sending.
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-stone-200 bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                  {CHANNELS[enquiry.channel].label} preview
                </p>
                <div className="rounded-lg rounded-tr-sm bg-green-50 p-3 text-sm text-stone-700">
                  Hi {enquiry.customer.split(" ")[0]}, here's a quick video answer
                  to your question about the {enquiry.product} 👇
                  <br />
                  <span className="text-sky-600 underline">
                    https://vidreply.demo/v/{enquiry.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onPreviewCustomer(enquiry.id)}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Open the customer's page →
              </button>
              {enquiry.customerReply && (
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-stone-700">
                  <p className="mb-1 text-xs font-semibold text-sky-700">
                    {enquiry.customer} replied:
                  </p>
                  “{enquiry.customerReply}”
                </div>
              )}
              <DemoNote>
                No real message is sent. This is a simulated{" "}
                {CHANNELS[enquiry.channel].label} preview and a fake link.
              </DemoNote>
            </div>
          )}
        </div>
      </div>
    );
  }

  VR.AnswerPanel = AnswerPanel;
})();
