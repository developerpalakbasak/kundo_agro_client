export default function Loader({ size = "md", text = null }) {
const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }[size] || "w-3 h-3";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <span className={`${dotSizes} rounded-full bg-[#4c9a52] animate-bounce [animation-delay:-0.3s]`} />
        <span className={`${dotSizes} rounded-full bg-[#4c9a52] animate-bounce [animation-delay:-0.15s]`} />
        <span className={`${dotSizes} rounded-full bg-[#4c9a52] animate-bounce`} />
      </div>
      {text && <span className="text-sm font-medium text-gray-600">{text}</span>}
    </div>
  );
}