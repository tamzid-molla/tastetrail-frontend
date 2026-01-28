import React from "react";

const GlobalLoader = ({ message = "Loading...", size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-20 h-20 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-background ${className}`}>
      <div className="text-center space-y-6">
        {/* Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-card rounded-2xl p-6 shadow-lg border border-border">
            <div className="w-16 h-16 mx-auto">
              {/* Simplified logo representation */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-2xl font-bold text-primary">TT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border border-border border-t-primary rounded-full animate-spin mx-auto`}
            role="status"
            aria-label="Loading">
            <span className="sr-only">Loading...</span>
          </div>

          {/* Inner pulse effect */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-30"></div>
        </div>

        {/* Message */}
        {message && (
          <div className="space-y-2">
            <p className="text-foreground font-medium text-lg animate-pulse">{message}</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}

        {/* Brand name */}
        <p className="text-muted-foreground text-sm tracking-wider font-medium">TASTE TRAIL</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
