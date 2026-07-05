import { useAuth } from "@/_core/hooks";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Zap } from "lucide-react";
import { useState } from "react";
import type { BrandProject } from "@/pages/Dashboard";

interface DashboardHeaderProps {
    user?: any;
    currentProject?: BrandProject | null;
    briefing?: any;
    isGenerating?: boolean;
    onGenerate?: () => void;
    onProjectsOpen?: () => void;
    onMenuClick?: () => void;
}

export default function DashboardHeader({
    user,
    currentProject,
    briefing,
    isGenerating,
    onGenerate,
    onProjectsOpen,
    onMenuClick,
}: DashboardHeaderProps) {
    const auth = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const currentUser = user || auth?.user;

    return (
        <header className="sticky top-0 z-40 border-b border-glass bg-glass/10 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-4">
                    <button onClick={onMenuClick} className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                            Brand Identity
                        </h1>
                        {currentProject?.name && (
                            <p className="text-xs text-muted-foreground">{currentProject.name}</p>
                        )}
                    </div>
                </div>

                {/* Center: Actions */}
                <div className="flex items-center gap-4">
                    {briefing && (
                        <Button
                            onClick={onProjectsOpen}
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex"
                        >
                            Mis Proyectos
                        </Button>
                    )}
                    {isGenerating && (
                        <div className="flex items-center gap-2 text-orange-500">
                            <Zap className="h-4 w-4 animate-pulse" />
                            <span className="text-sm font-medium">Generando...</span>
                        </div>
                    )}
                    {onGenerate && !isGenerating && (
                        <Button
                            onClick={onGenerate}
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        >
                            Generar Marca
                        </Button>
                    )}
                </div>

                {/* Right: User Menu */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-glass/20 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                                {currentUser?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">
                                {currentUser?.name || "Usuario"}
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-glass rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b border-glass">
                                    <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                                    <p className="text-xs text-gray-400">{currentUser?.email}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        auth?.logout?.();
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-glass/20 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => auth?.logout?.()}
                    >
                        Salir
                    </Button>
                </div>
            </div>
        </header>
    );
}
