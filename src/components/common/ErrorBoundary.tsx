import { Component, type ErrorInfo, type ReactNode } from "react";

// 1. defines what kind of properties (props) the error limit can accept
interface Props {
  children: ReactNode; // Allows for other components to be enclosed inside
  fallback?: ReactNode; // Optional: Allows us to include a custom design from an external source
}

// 2. defines exactly which value the error state holds in memory
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // Executes automatically during a crash to set the state to hasError: true
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  // Captures the crash and logs the details to the developer console (F12)
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Uncaught rendering exception detected by boundary:",
      error,
      errorInfo,
    );
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // If provided with a custom design from an external source, we use it.
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // GRACEFUL DEGRADATION: The lesson's standard screen!
      return (
        <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">⚠️</span>
            <h1 className="text-xl font-bold text-red-800">
              Oops! Something went wrong.
            </h1>
            <p className="text-sm text-red-600 max-w-md">
              Sorry for the inconvenience. An unexpected rendering error
              occurred while displaying this page..
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition shadow-sm"
            >
              🔄 Reload the page
            </button>

            {/* Displays technical details during local development for debugging immediately! */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-4 w-full text-left bg-white p-4 border rounded-lg text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap">
                <summary className="cursor-pointer font-sans font-semibold text-gray-500 hover:text-gray-800">
                  Technical error details (Visible only in development)
                </summary>
                <p className="text-red-700 mt-2 font-bold">
                  {this.state.error?.toString()}
                </p>
                <p className="mt-1 text-gray-500">
                  {this.state.errorInfo.componentStack}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
