import React from "react";

function Cartempty() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(transparent, #f3f9f4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    maxWidth: 450,
                    width: "100%",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.99)",
                    borderRadius: 26,
                    boxShadow: "0 10px 40px #bbe9db49, 0 2px 12px #81e6d944",
                    padding: "54px 28px 44px 28px",
                    position: "relative",
                }}
            >
                {/* Animated Sad Cart SVG */}
                <div
                    style={{
                        marginBottom: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 92,
                    }}
                >
                    <svg
                        width="86"
                        height="86"
                        viewBox="0 0 86 86"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            display: "block",
                            margin: "0 auto",
                            opacity: 0.95,
                            filter: "drop-shadow(0 2px 8px #44d7a826)",
                            animation: "cartPop 1.4s cubic-bezier(0.47,1.64,0.41,0.8) both",
                        }}
                    >
                        <defs>
                            <linearGradient id="g1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#dbfff5" />
                                <stop offset="1" stopColor="#a7efdb" />
                            </linearGradient>
                        </defs>
                        <circle cx="43" cy="43" r="42" fill="url(#g1)" />
                        <g>
                            <rect x="25" y="33" width="36" height="19" rx="4.5" fill="#44d7a8" stroke="#137a4f" strokeWidth="2.5" />
                            <ellipse cx="34.7" cy="56" rx="4.1" ry="4.1" fill="#137a4f" />
                            <ellipse cx="51.5" cy="56" rx="4.1" ry="4.1" fill="#137a4f" />
                            {/* Sad Face */}
                            <path d="M37 43 q6 7 12 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                            <ellipse cx="33.6" cy="40" rx="1.2" ry="1.6" fill="#fff" />
                            <ellipse cx="52.3" cy="40" rx="1.2" ry="1.6" fill="#fff" />
                        </g>
                    </svg>
                </div>
                <h2
                    style={{
                        fontSize: 34,
                        fontWeight: 800,
                        color: "#16a085",
                        marginBottom: 9,
                        letterSpacing: "0.01em",
                    }}
                >
                    Nothing in your cart!
                </h2>
                <div style={{ color: "#4c5d55", fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
                    Oops! Your shopping cart is empty.<br />
                    Browse our products and add something green!
                </div>
                <button
                    style={{
                        padding: "15px 36px",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(91deg, #44d7a8 70%, #137a4f 100%)",
                        fontWeight: 700,
                        fontSize: 22,
                        color: "#fff",
                        boxShadow: "0 3px 12px #44d7a833",
                        cursor: "pointer",
                        outline: "none",
                        letterSpacing: "0.04em",
                        marginTop: 8,
                        transition: "transform 0.17s, box-shadow 0.22s",
                    }}
                    onClick={() => (window.location.href = "/green")}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                    Shop Now
                </button>
                {/* Inline keyframes for the SVG pop animation */}
                <style>
                    {`
          @keyframes cartPop {
            0% { transform: scale(0.85) translateY(18px);}
            54% { transform: scale(1.08) translateY(-7px);}
            90% { transform: scale(1) translateY(0);}
            100% { transform: scale(1) translateY(0);}
          }
        `}
                </style>
            </div>
        </div>
    );
}

export default Cartempty;
