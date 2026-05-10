import { useState, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoThumbnailProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
}

const VideoThumbnail = ({ src, alt = "", className = "" }: VideoThumbnailProps) => {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) {
      setFailed(true);
      return;
    }

    setThumbUrl(null);
    setFailed(false);

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    // Only fetch metadata + the bytes needed to seek to t=1s, not the whole video.
    video.preload = "metadata";
    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("seeked", () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbUrl(canvas.toDataURL("image/jpeg", 0.8));
        }
      } catch {
        setFailed(true);
      }
    }, { once: true });

    video.addEventListener("error", () => {
      if (!cancelled) setFailed(true);
    }, { once: true });

    video.addEventListener("loadeddata", () => {
      if (!cancelled) video.currentTime = 1;
    }, { once: true });

    video.src = src;

    return cleanup;
  }, [src]);

  if (thumbUrl) {
    return <img src={thumbUrl} alt={alt} className={className} loading="lazy" />;
  }

  if (failed) {
    return (
      <div className={`bg-secondary flex items-center justify-center ${className}`}>
        <Play size={24} className="text-muted-foreground" />
      </div>
    );
  }

  return <div className={`bg-secondary animate-pulse ${className}`} />;
};

export default VideoThumbnail;
