import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BreakingNews } from "./BreakingNews";

export const Layout = ({ children, breaking = true }: { children: ReactNode; breaking?: boolean }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    {breaking && <BreakingNews />}
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
