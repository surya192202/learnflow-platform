interface VideoPlayerProps {
  src: string;
  title?: string;
}

const VideoPlayer = ({ src, title = "Video lesson" }: VideoPlayerProps) => (
  <div className="relative aspect-video bg-foreground rounded-2xl overflow-hidden shadow-elevated">
    <iframe
      src={src}
      title={title}
      className="absolute inset-0 w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export default VideoPlayer;
