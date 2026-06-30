/* Record + send for a single enquiry. An answer is an ordered list of clips. */
(function () {
  const { Avatar, ChannelTag, StatusBadge, DemoNote, Recorder, ClipPlayer, CHANNELS } = VR;

  function AnswerPanel({ enquiry, onRecordClip, onRemoveClip, onSend, onPreviewCustomer }) {
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
                  <div key={c.id}>
                    {c.title && (
                      <p className="mb-1 text-xs font-medium text-stone-500">{c.title}</p>
                    )}
                    <ClipPlayer clip={c} />
                    {!enquiry.sent && (
                      <div className="mt-1.5 flex">
                        <button
                          onClick={() => onRemoveClip(enquiry.id, c.id)}
                          className="ml-auto text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!enquiry.sent ? (
            <>
              <h3 className="mb-3 text-sm font-semibold text-stone-700">
                {clips.length ? "Add another clip" : "Record your video answer"}
              </h3>
              <Recorder onClipReady={(clip) => onRecordClip(enquiry.id, clip)} />

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
