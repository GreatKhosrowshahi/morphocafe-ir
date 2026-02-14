const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-primary-900">
            {/* Deep Gradient Background with noise texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#050a1f] to-[#010413]" />

            {/* Subsurface Noise for premium feel without heavy JS */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            {/* Slow Floating Glow 1 - Pure CSS */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-morho-royal/10 blur-[100px] animate-float-slow" />

            {/* Slow Floating Glow 2 - Pure CSS */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-morho-violet/10 blur-[90px] animate-float-slower" />

            {/* Grid Overlay (Subtle Texture) */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    33% { transform: translate(30px, -20px) scale(1.1); opacity: 0.5; }
                    66% { transform: translate(-10px, 40px) scale(0.9); opacity: 0.3; }
                }
                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                    50% { transform: translate(-40px, -50px) scale(1.2); opacity: 0.4; }
                }
                .animate-float-slow {
                    animation: float-slow 25s ease-in-out infinite;
                }
                .animate-float-slower {
                    animation: float-slower 35s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AnimatedBackground;
