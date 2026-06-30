/* Root app — holds state and switches between retailer / customer view.
 *
 * Loaded LAST (see index.html): every other VR.* module is registered by the
 * time this file runs, so it can pull them off the namespace and then mount. */
(function () {
  const { useState } = React;
  const { Inbox, AnswerPanel, CustomerView, BRAND, INITIAL_ENQUIRIES } = VR;

  let _uid = 0;
  const uid = (p) => `${p}-${Date.now().toString(36)}-${_uid++}`;

  function App() {
    const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
    const [selectedId, setSelectedId] = useState(INITIAL_ENQUIRIES[0].id);
    const [view, setView] = useState("retailer"); // retailer | customer
    const [customerId, setCustomerId] = useState(null);

    const selected = enquiries.find((e) => e.id === selectedId) || null;

    const patchEnquiry = (id, patch) =>
      setEnquiries((list) =>
        list.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );

    // Mutate an enquiry's clip list and keep `status` in sync with it.
    const setClips = (id, fn) =>
      setEnquiries((list) =>
        list.map((e) => {
          if (e.id !== id) return e;
          const clips = fn(e.clips);
          return { ...e, clips, status: clips.length ? "answered" : "new" };
        })
      );

    const handleRecordClip = (id, clip) =>
      setClips(id, (cs) => [...cs, { id: uid("clip"), ...clip }]);

    const handleRemoveClip = (id, clipId) =>
      setClips(id, (cs) => cs.filter((c) => c.id !== clipId));

    const handleSend = (id) => patchEnquiry(id, { sent: true });

    const handlePreviewCustomer = (id) => {
      setCustomerId(id);
      setView("customer");
    };

    const handleCustomerReply = (id, text) =>
      patchEnquiry(id, { customerReply: text });

    if (view === "customer" && customerId) {
      const cust = enquiries.find((e) => e.id === customerId);
      return (
        <CustomerView
          enquiry={cust}
          onReply={handleCustomerReply}
          onBack={() => setView("retailer")}
        />
      );
    }

    return (
      <div className="mx-auto flex h-screen max-w-6xl flex-col">
        {/* top bar */}
        <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-5 py-3">
          <span className="text-xl">🎬</span>
          <div>
            <p className="font-semibold text-stone-900">VidReply</p>
            <p className="text-xs text-stone-500">{BRAND.name} · retailer inbox</p>
          </div>
          <span className="ml-auto rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-500">
            Demo — webcam real · delivery & hosting simulated
          </span>
        </header>

        {/* inbox + answer panel */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[360px_1fr]">
          <aside className="hidden border-r border-stone-200 bg-white md:block">
            <Inbox
              enquiries={enquiries}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </aside>
          <main className="overflow-hidden bg-white">
            {selected ? (
              <AnswerPanel
                key={selected.id}
                enquiry={selected}
                onRecordClip={handleRecordClip}
                onRemoveClip={handleRemoveClip}
                onSend={handleSend}
                onPreviewCustomer={handlePreviewCustomer}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">
                Select an enquiry
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
