
import type { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
    <div>
        <Header/>
        <main>
            <div className="px-8 py-6 text-gray-100  bg-gray-700 min-h-screen">
            {children}
            </div>
        </main>
    </div>);
}