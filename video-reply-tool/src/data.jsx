/* Mock data + shared constants.
 *
 * No bundler here: each src/*.jsx file is an IIFE "module" that reads its
 * dependencies from the global `VR` namespace and writes its exports back.
 * index.html compiles + loads the files in dependency order. */
(function () {
  VR.BRAND = {
    name: "Maguire & Sons Furniture",
    tagline: "Handmade in Galway since 1962",
    accent: "#7c5e3c", // warm walnut
  };

  VR.CHANNELS = {
    whatsapp: { label: "WhatsApp", dot: "bg-green-500" },
    sms: { label: "SMS", dot: "bg-sky-500" },
  };

  const now = Date.now();
  const minsAgo = (m) => now - m * 60_000;

  VR.INITIAL_ENQUIRIES = [
    {
      id: "e1",
      customer: "Aoife Brennan",
      phone: "+353 87 555 0142",
      channel: "whatsapp",
      product: "Connemara 3-seat sofa",
      productEmoji: "🛋️",
      question:
        "Is the Connemara sofa available in the dark green linen, and how long is delivery to Cork?",
      receivedAt: minsAgo(8),
      status: "new", // new | answered
      clip: null, // { url, durationSec, recordedAt }
      sent: false,
      customerReply: null,
    },
    {
      id: "e2",
      customer: "Daniel O'Sullivan",
      phone: "+353 86 555 0199",
      channel: "sms",
      product: "Burren oak dining table",
      productEmoji: "🪵",
      question:
        "What are the exact dimensions of the extending oak table, and does it seat 8 when extended?",
      receivedAt: minsAgo(41),
      status: "new",
      clip: null,
      sent: false,
      customerReply: null,
    },
    {
      id: "e3",
      customer: "Niamh Kelly",
      phone: "+353 85 555 0177",
      channel: "whatsapp",
      product: "Atlantic velvet armchair",
      productEmoji: "💺",
      question:
        "How do I clean the velvet armchair if my kids spill on it? Worried about stains.",
      receivedAt: minsAgo(95),
      status: "new",
      clip: null,
      sent: false,
      customerReply: null,
    },
  ];
})();
