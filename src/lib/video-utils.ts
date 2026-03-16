/** Extract YouTube video ID from a URL. Returns null for non-YouTube URLs or nullish input. */
export const getYoutubeId = (url?: string | null): string | null => {
  const value = url?.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.replace(/^www\./i, "");

    if (host === "youtu.be") {
      const shortId = parsed.pathname.split("/").filter(Boolean)[0];
      if (shortId && /^[a-zA-Z0-9_-]{11}$/.test(shortId)) return shortId;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const fromQuery = parsed.searchParams.get("v") || parsed.searchParams.get("vi");
      if (fromQuery && /^[a-zA-Z0-9_-]{11}$/.test(fromQuery)) return fromQuery;

      const parts = parsed.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((p) => ["embed", "shorts", "v", "live"].includes(p));
      const fromPath = marker >= 0 ? parts[marker + 1] : null;
      if (fromPath && /^[a-zA-Z0-9_-]{11}$/.test(fromPath)) return fromPath;
    }
  } catch {
    // fallback regex below
  }

  const fallback = value.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?.*?[?&]v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/i,
  );

  return fallback ? fallback[1] : null;
};

/** Get YouTube thumbnail URL, or null. */
export const getYoutubeThumbnail = (url?: string | null): string | null => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

/** Get YouTube embed URL. Returns null if not a YouTube URL. */
export const getYoutubeEmbedUrl = (url?: string | null): string | null => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : null;
};

/** Resolve the actual playable video source from a galeria item (video_url or imagen_url). */
export const resolveVideoSource = (item: { video_url?: string | null; imagen_url?: string | null }): string | null => {
  return item.video_url || item.imagen_url || null;
};

/** Check if a URL points to a direct video file by extension. */
export const isDirectVideoFile = (url?: string | null): boolean => {
  const value = url?.trim();
  if (!value) return false;
  if (getYoutubeId(value)) return false;
  return /\.(mp4|webm|mov|ogg|m4v)([?#].*)?$/i.test(value);
};

/** Check if URL is a video (YouTube or direct file). */
export const isVideoUrl = (url?: string | null): boolean => {
  const value = url?.trim();
  if (!value) return false;
  return !!getYoutubeId(value) || isDirectVideoFile(value);
};
