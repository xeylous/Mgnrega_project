export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-[#00416A] animate-pulse">
      <div className="w-8 h-8 border-4 border-[#00416A] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2">{text}</p>
    </div>
  );
}
