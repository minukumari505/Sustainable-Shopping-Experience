import { useState } from "react";

export default function EcoCapsule({ onClick }) {
    const [checked, setChecked] = useState(false);

    const handleClick = () => {
        setChecked(true);
        if (onClick) onClick();
        // setTimeout(() => setChecked(false), 900); // Optional: untick after modal
    };

    return (
        <button
            onClick={handleClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "linear-gradient(90deg, #44c455 65%, #2ecc71 100%)",
                border: "none",
                borderRadius: 32,
                boxShadow: "0 2px 8px #b4eed94c",
                padding: "16px 26px 14px 22px",
                minWidth: 270,
                maxWidth: 350,
                position: "relative",
                cursor: "pointer",
                transition: "box-shadow 0.18s",
                height: 90,
            }}
        >
            {/* Text block */}
            <div style={{ textAlign: "left", flex: 1 }}>
                <div
                    style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 20,
                        letterSpacing: "0.01em",
                        marginBottom: 3,
                        lineHeight: 1.12,
                    }}
                >
                    Enable Sustainable Packaging
                </div>
                {/* <div style={{ color: "#e4ffe9", fontWeight: 400, fontSize: 15, marginBottom: 0 }}>
                    Recyclable, minimal, or biodegradable materials
                </div>
                <div style={{ color: "#c3ffce", fontSize: 13, marginTop: 1 }}>
                    (~2.8 kg CO<sub style={{ fontSize: 11 }}>2</sub> saved)
                </div> */}
            </div>
            {/* Tick Circle */}
            <span
                style={{
                    minWidth: 38,
                    minHeight: 38,
                    background: "#e2f7e8",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: checked ? "0 0 0 2px #81e6a5" : "0 1px 6px #b4eed94c",
                    transition: "box-shadow 0.19s",
                }}
            >
                {/* Animate SVG tick */}
                <svg width="28" height="28" viewBox="0 0 38 38">
                    <circle
                        cx="19"
                        cy="19"
                        r="16"
                        fill="none"
                        stroke={checked ? "#38b24d" : "#b7dbc1"}
                        strokeWidth="2.2"
                    />
                    <polyline
                        points="11,20 17,27 27,13"
                        fill="none"
                        stroke={checked ? "#38b24d" : "#bbb"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transition: "stroke 0.19s",
                            strokeDasharray: 28,
                            strokeDashoffset: checked ? 0 : 28,
                            transitionProperty: "stroke,stroke-dashoffset",
                            transitionDuration: checked ? "0.3s" : "0.2s",
                        }}
                    />
                </svg>
            </span>
        </button>
    );
}
