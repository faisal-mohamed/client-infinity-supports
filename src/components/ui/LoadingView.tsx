"use client";

interface LoadingViewProps {
  title?: string;
  message?: string;
}

export default function LoadingView({ 
  title = "Loading View Form", 
  message = "Please wait..." 
}: LoadingViewProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
      <div className="flex justify-center items-center h-80">
        <div className="text-center">
          {/* Spinner */}
          <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

          {/* Text */}
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {title}
          </h3>
          <p className="text-slate-600 font-medium">
            {message}
          </p>

          {/* Bouncing dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}


