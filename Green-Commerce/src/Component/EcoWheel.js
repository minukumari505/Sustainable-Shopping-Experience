import React, { useEffect, useRef } from 'react';

export default function EcoWheel({ grade }) {
    const canvasRef = useRef();

    const segments = [
        { label: 'A+', color: '#1B5E20' },
        { label: 'A', color: '#388E3C' },
        { label: 'B+', color: '#AFB42B' },
        { label: 'B', color: '#FBC02D' },
        { label: 'C', color: '#F57C00' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const thickness = 40;
        const center = size / 2;
        const radius = center - thickness;
        // for outside labels
        const labelRadius = radius + thickness / 2 + 15;
        const sliceAngle = (2 * Math.PI) / segments.length;
        const targetIndex = segments.findIndex(s => s.label === grade);

        let startTime;
        let animId;

        function drawFrame(timestamp) {
            if (!startTime) startTime = timestamp;
            const t = (timestamp - startTime) / 1000;
            const pulse = 1 + 0.2 * Math.sin(t * 2 * Math.PI);

            ctx.clearRect(0, 0, size, size);

            // 1) draw slices + their labels
            let startAng = -Math.PI / 2;
            segments.forEach(seg => {
                // slice
                ctx.beginPath();
                ctx.arc(center, center, radius, startAng, startAng + sliceAngle);
                ctx.lineWidth = thickness;
                ctx.strokeStyle = seg.color;
                ctx.stroke();

                // outside label
                const midAng = startAng + sliceAngle / 2;
                const lx = center + Math.cos(midAng) * labelRadius;
                const ly = center + Math.sin(midAng) * labelRadius;
                ctx.font = 'bold 14px sans-serif';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(seg.label, lx, ly);

                startAng += sliceAngle;
            });

            // 2) pulsing highlight on active slice
            if (targetIndex >= 0) {
                const highlightRadius = radius * pulse;
                const highThickness = thickness * pulse + 4;
                const highStart = -Math.PI / 2 + targetIndex * sliceAngle;

                ctx.beginPath();
                ctx.arc(center, center, highlightRadius, highStart, highStart + sliceAngle);
                ctx.lineWidth = highThickness;
                ctx.strokeStyle = '#2E7D32';
                ctx.stroke();
            }

            // 3) mask out the interior
            const innerRadius = radius - thickness / 2;
            ctx.beginPath();
            ctx.arc(center, center, innerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // 4) center text
            ctx.font = 'bold 15px sans-serif';
            ctx.fillStyle = '#2E7D32';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Eco Rating', center, center);

            animId = requestAnimationFrame(drawFrame);
        }

        animId = requestAnimationFrame(drawFrame);
        return () => cancelAnimationFrame(animId);
    }, [grade]);

    return (
        <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{ display: 'block', margin: 'auto' }}
        />
    );
}
