/* Shared UI atoms: Avatar, ChannelTag, StatusBadge, DemoNote. */
(function () {
  const { CHANNELS } = VR;

  function Avatar({ name, size = 40 }) {
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
    return (
      <div
        className="flex items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }

  function ChannelTag({ channel }) {
    const c = CHANNELS[channel];
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
        <span className={`h-2 w-2 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  }

  function StatusBadge({ status, sent }) {
    if (sent)
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          Sent
        </span>
      );
    if (status === "answered")
      return (
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          Recorded
        </span>
      );
    return (
      <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
        New
      </span>
    );
  }

  function DemoNote({ children }) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-500">
        <span className="mt-0.5">⚠️</span>
        <span>{children}</span>
      </div>
    );
  }

  Object.assign(VR, { Avatar, ChannelTag, StatusBadge, DemoNote });
})();
