"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { riskSummary } from "@/lib/data";
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const cards = [
  {
    label: "TOTAL TRANSACTIONS",
    value: riskSummary.total,
    sub: "monitored today",
    icon: Activity,
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.12)",
  },
  {
    label: "FLAGGED",
    value: riskSummary.flagged,
    sub: "pending review",
    icon: AlertTriangle,
    color: "#f97316",
    glow: "rgba(249,115,22,0.12)",
  },
  {
    label: "HIGH RISK",
    value: riskSummary.high,
    sub: "review required",
    icon: TrendingUp,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.1)",
  },
  {
    label: "CRITICAL",
    value: riskSummary.critical,
    sub: "immediate action",
    icon: Shield,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.15)",
  },
];

export function StatCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );

    cards.forEach((card, i) => {
      const el = containerRef.current?.querySelector(`[data-value="${i}"]`);
      if (!el) return;
      const proxy = { count: 0 };
      gsap.to(proxy, {
        count: card.value,
        duration: 1.4,
        delay: i * 0.1 + 0.1,
        ease: "power2.out",
        onUpdate() {
          el.textContent = Math.round(proxy.count).toString();
        },
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, color, glow }, i) => (
        <Card
          key={label}
          className="transition-all duration-300 hover:scale-[1.02] cursor-default"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 0,
          }}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span
              className="font-mono text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-3)" }}
            >
              {label}
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: glow }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color }} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              data-value={i}
              className="font-mono font-bold"
              style={{ fontSize: 32, lineHeight: 1, color }}
            >
              0
            </div>
            <p className="font-mono mt-2" style={{ fontSize: 10, color: "var(--text-3)" }}>
              {sub}
            </p>
            <div
              className="mt-3 h-0.5 rounded-full w-1/3"
              style={{ background: color, opacity: 0.35 }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
