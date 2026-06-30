/* The branded page the customer opens from the link. */
(function () {
  const { useState } = React;
  const { ClipPlayer, DemoNote, BRAND } = VR;

  function CustomerView({ enquiry, onReply, onBack }) {
    const [draft, setDraft] = useState("");
    const [sent, setSent] = useState(Boolean(enquiry.customerReply));

    return (
      <div className="min-h-screen bg-stone-100">
        {/* faux browser chrome / back to retailer */}
        <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 text-xs text-stone-300">
          <button onClick={onBack} className="hover:text-white">
            ← Back to retailer view
          </button>
          <span className="ml-auto opacity-60">
            customer view · vidreply.demo/v/{enquiry.id}
          </span>
        </div>

        <div className="mx-auto max-w-md p-4">
          {/* brand header */}
          <div
            className="rounded-t-2xl px-5 py-4 text-white"
            style={{ backgroundColor: BRAND.accent }}
          >
            <p className="text-lg font-bold">{BRAND.name}</p>
            <p className="text-sm opacity-80">{BRAND.tagline}</p>
          </div>

          <div className="rounded-b-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm text-stone-600">
              Hi {enquiry.customer.split(" ")[0]} — here's a personal video answer
              about the <span className="font-medium">{enquiry.product}</span>:
            </p>

            {enquiry.clip ? (
              <ClipPlayer clip={enquiry.clip} rounded="rounded-xl" />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                No clip attached
              </div>
            )}

            {/* call to action */}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-4 block rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: BRAND.accent }}
            >
              Book a showroom visit
            </a>

            {/* reply */}
            <div className="mt-5 border-t border-stone-100 pt-4">
              {sent ? (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  ✓ Thanks! Your reply was sent to {BRAND.name}.
                </p>
              ) : (
                <>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Reply to this answer
                  </label>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    placeholder="Type your reply…"
                    className="w-full resize-none rounded-lg border border-stone-300 p-2.5 text-sm focus:border-stone-500 focus:outline-none"
                  />
                  <button
                    disabled={!draft.trim()}
                    onClick={() => {
                      onReply(enquiry.id, draft.trim());
                      setSent(true);
                    }}
                    className="mt-2 w-full rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Send reply
                  </button>
                </>
              )}
            </div>

            <div className="mt-4">
              <DemoNote>
                Branded customer page. The CTA is inert and the reply is stored
                in-memory only — nothing is actually delivered.
              </DemoNote>
            </div>
          </div>
        </div>
      </div>
    );
  }

  VR.CustomerView = CustomerView;
})();
