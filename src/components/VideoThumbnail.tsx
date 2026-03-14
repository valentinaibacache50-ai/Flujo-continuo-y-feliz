import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

interface VideoThumbnailProps {
  src: string;
  alt?: string;
  className?: string;
}

const VideoThumbnail = ({ src, alt = "", className = "" }: VideoThumbnailProps) => {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "auto";

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("seeked", () => {
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
      cleanup();
    }, { once: true });

    video.addEventListener("error", () => {
      setFailed(true);
      cleanup();
    }, { once: true });

    video.src = src;
    video.addEventListener("loadeddata", () => {
      video.currentTime = 1;
    }, { once: true });

    return () => cleanup();
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

  // Loading placeholder
  return <div className={`bg-secondary animate-pulse ${className}`} />;
};

export default VideoThumbnail;
