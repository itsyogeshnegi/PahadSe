import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-6 text-center border border-dashed border-destructive/30 bg-destructive/5 rounded-2xl max-w-lg mx-auto my-8 animate-in fade-in">
          <h3 className="text-lg font-bold text-destructive">Something went wrong</h3>
          <p className="text-xs text-muted-foreground mt-2">
            {this.state.error?.message || "Failed to load this section."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground text-xs font-semibold rounded-lg hover:bg-destructive/90 transition-colors cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
