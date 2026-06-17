// PCBforth — Blueprint Tech design: animated PCB trace background
import { useEffect, useRef } from "react";

export default function PcbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // PCB trace nodes
    const nodes: { x: number; y: number; r: number }[] = [];
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

    const generate = () => {
      nodes.length = 0;
      lines.length = 0;
      const cols = Math.ceil(canvas.width / 80) + 2;
      const rows = Math.ceil(canvas.height / 80) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jx = (Math.random() - 0.5) * 30;
          const jy = (Math.random() - 0.5) * 30;
          nodes.push({ x: c * 80 + jx, y: r * 80 + jy, r: Math.random() * 3 + 2 });
        }
      }
      // Horizontal and vertical traces
      for (let i = 0; i < nodes.length; i++) {
        if (Math.random() > 0.4 && i + 1 < nodes.length) {
          lines.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[i + 1].x, y2: nodes[i + 1].y });
        }
        const cols2 = Math.ceil(canvas.width / 80) + 2;
        if (Math.random() > 0.4 && i + cols2 < nodes.length) {
          lines.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[i + cols2].x, y2: nodes[i + cols2].y });
        }
      }
    };

    generate();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Traces
      ctx.strokeStyle = "rgba(30, 144, 255, 0.12)";
      ctx.lineWidth = 1;
      lines.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        // Right-angle routing
        const mx = (l.x1 + l.x2) / 2;
        ctx.lineTo(mx, l.y1);
        ctx.lineTo(mx, l.y2);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      });

      // Nodes (pads)
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 212, 255, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "rgba(30, 144, 255, 0.08)";
        ctx.fill();
      });

      // Animated flow particle
      const flowLen = lines.length;
      const idx = Math.floor(offset % flowLen);
      const l = lines[idx];
      if (l) {
        const prog = (offset % 1);
        const mx = (l.x1 + l.x2) / 2;
        // Interpolate along right-angle path
        let px: number, py: number;
        if (prog < 0.33) {
          px = l.x1 + (mx - l.x1) * (prog / 0.33);
          py = l.y1;
        } else if (prog < 0.66) {
          px = mx;
          py = l.y1 + (l.y2 - l.y1) * ((prog - 0.33) / 0.33);
        } else {
          px = mx + (l.x2 - mx) * ((prog - 0.66) / 0.34);
          py = l.y2;
        }
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grad.addColorStop(0, "rgba(0, 212, 255, 0.9)");
        grad.addColorStop(1, "rgba(0, 212, 255, 0)");
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      offset += 0.3;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
