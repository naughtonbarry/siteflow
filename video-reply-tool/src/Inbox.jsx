/* Inbox list. */
(function () {
  const { EnquiryCard } = VR;

  function Inbox({ enquiries, selectedId, onSelect }) {
    const newCount = enquiries.filter((e) => e.status === "new").length;
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-stone-200 p-4">
          <h1 className="text-lg font-semibold text-stone-900">Enquiries</h1>
          <p className="text-sm text-stone-500">{newCount} awaiting an answer</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {enquiries.map((e) => (
            <EnquiryCard
              key={e.id}
              enquiry={e}
              active={e.id === selectedId}
              onClick={() => onSelect(e.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  VR.Inbox = Inbox;
})();
