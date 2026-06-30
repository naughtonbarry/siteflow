/* One inbox row. */
(function () {
  const { Avatar, StatusBadge, ChannelTag, timeAgo } = VR;

  function EnquiryCard({ enquiry, active, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`w-full border-b border-stone-100 p-4 text-left transition hover:bg-stone-50 ${
          active ? "bg-stone-50" : "bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <Avatar name={enquiry.customer} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-stone-900">
                {enquiry.customer}
              </span>
              <span className="shrink-0 text-xs text-stone-400">
                {timeAgo(enquiry.receivedAt)}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
              <span>{enquiry.productEmoji}</span>
              <span className="truncate">{enquiry.product}</span>
            </div>
            <p className="mt-1 truncate text-sm text-stone-500">
              {enquiry.question}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={enquiry.status} sent={enquiry.sent} />
              <ChannelTag channel={enquiry.channel} />
            </div>
          </div>
        </div>
      </button>
    );
  }

  VR.EnquiryCard = EnquiryCard;
})();
