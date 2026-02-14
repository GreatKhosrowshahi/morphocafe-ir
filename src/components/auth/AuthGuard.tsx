import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";
import { toast } from "sonner";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setAuthenticated(false);
                navigate(requireAdmin ? "/admin" : "/login");
                return;
            }

            if (requireAdmin) {
                // Strictly check for 'admin' role in metadata
                const isAdmin = session.user.user_metadata?.role === 'admin';

                if (!isAdmin) {
                    setAuthenticated(false);
                    toast.error("خطا: شما دسترسی مدیریت ندارید");
                    navigate("/admin");
                    return;
                }
            }

            setAuthenticated(true);
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setAuthenticated(false);
                navigate(requireAdmin ? "/admin" : "/login");
            } else {
                setAuthenticated(true);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, requireAdmin]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return authenticated ? <>{children}</> : null;
};

export default AuthGuard;
