import { useEffect } from "react";

export default function AnimatedPopup({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-indigo-500",
    };

    const icons = {
        success: "✅",
        error: "⚠️",
        info: "ℹ️",
    };

    return (
        <div className="fixed top-24 right-6 z-50 animate-bounce-in">
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px] border border-white/10 backdrop-blur-md`}>
                <span className="text-2xl bg-white/20 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    {icons[type]}
                </span>
                <div>
                    <h4 className="font-bold text-lg capitalize">{type}</h4>
                    <p className="font-medium opacity-90">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-auto text-white/60 hover:text-white font-bold text-xl"
                >
                    ×
                </button>
            </div>

            <style jsx>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateX(100px); }
          50% { transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
        </div>
    );
}
