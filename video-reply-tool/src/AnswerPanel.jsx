/* Record + send for a single enquiry. */
(function () {
  const { Avatar, ChannelTag, StatusBadge, DemoNote, Recorder, ClipPlayer, CHANNELS } = VR;

  function AnswerPanel({ enquiry, onClipReady, onSend, onPreviewCustomer }) {
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

        {/* record / sent state */}
        <div className="flex-1 overflow-y-auto p-5">
          {!enquiry.clip ? (
            <>
              <h3 className="mb-3 text-sm font-semibold text-stone-700">
                Record your video answer
              </h3>
              <Recorder onClipReady={(clip) => onClipReady(enquiry.id, clip)} />
            </>
          ) : (
            <>
              <h3 className="mb-3 text-sm font-semibold text-stone-700">
                Your answer {enquiry.sent ? "(sent)" : "(ready to send)"}
              </h3>
              <ClipPlayer clip={enquiry.clip} />

              {!enquiry.sent ? (
                <button
                  onClick={() => onSend(enquiry.id)}
                  className="mt-4 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Send via {CHANNELS[enquiry.channel].label} →
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                      {CHANNELS[enquiry.channel].label} preview
                    </p>
                    <div className="rounded-lg rounded-tr-sm bg-green-50 p-3 text-sm text-stone-700">
                      Hi {enquiry.customer.split(" ")[0]}, here's a quick video
                      answer to your question about the {enquiry.product} 👇
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
            </>
          )}
        </div>
      </div>
    );
  }

  VR.AnswerPanel = AnswerPanel;
})();
