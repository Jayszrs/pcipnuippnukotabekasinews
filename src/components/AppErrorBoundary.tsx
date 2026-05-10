import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-3">
            <h1 className="font-display text-2xl font-black">Halaman gagal dimuat</h1>
            <p className="text-sm text-muted-foreground">
              Silakan muat ulang halaman. Jika masih terjadi, periksa konfigurasi environment di Vercel.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
