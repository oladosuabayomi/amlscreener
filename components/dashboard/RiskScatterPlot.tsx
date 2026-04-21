"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { transactions } from "@/lib/data";
import { Transaction, RiskLevel } from "@/types/transaction";
import { useAMLStore } from "@/lib/store";

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW:      "#22c55e",
  MEDIUM:   "#eab308",
  HIGH:     "#f97316",
  CRITICAL: "#ef4444",
};

export function RiskScatterPlot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { setSelectedTransaction } = useAMLStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const container = svgRef.current.parentElement!;
    const width = container.clientWidth;
    const height = 360;
    const margin = { top: 28, right: 40, bottom: 58, left: 72 };
    const innerWidth  = width  - margin.left - margin.right;
    const innerHeight = height - margin.top  - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ── Scales ──────────────────────────────────────────────────────
    const xMax = d3.max(transactions, (d) => d.velocity)! + 3;
    const yMax = d3.max(transactions, (d) => d.amount)!  * 1.12;
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);
    const rScale = d3.scaleSqrt().domain([0, 100]).range([3.5, 18]);

    // ── Grid ────────────────────────────────────────────────────────
    const gridColor = "rgba(255,255,255,0.04)";
    g.append("g")
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ""))
      .attr("transform", `translate(0,${innerHeight})`)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("line").attr("stroke", gridColor).attr("stroke-dasharray", "4,4"));

    g.append("g")
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll("line").attr("stroke", gridColor).attr("stroke-dasharray", "4,4"));

    // ── Axes ────────────────────────────────────────────────────────
    const axisStyle = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
      sel.select(".domain").attr("stroke", "rgba(255,255,255,0.1)");
      sel.selectAll("text").attr("fill", "#525C6E").attr("font-size", "11px").attr("font-family", "monospace");
      sel.selectAll("line").attr("stroke", "rgba(255,255,255,0.1)");
    };

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .call(axisStyle);

    g.append("g")
      .call(
        d3.axisLeft(yScale).ticks(6).tickFormat((d) => {
          const n = +d;
          if (n >= 1_000_000) return `₦${n / 1_000_000}M`;
          if (n >= 1000)      return `₦${n / 1000}K`;
          return `₦${n}`;
        })
      )
      .call(axisStyle);

    // ── Axis labels ─────────────────────────────────────────────────
    g.append("text")
      .attr("x", innerWidth / 2).attr("y", innerHeight + 48)
      .attr("text-anchor", "middle").attr("fill", "#525C6E")
      .attr("font-size", "11px").attr("font-family", "monospace")
      .text("TRANSACTION VELOCITY (txns/hr)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2).attr("y", -58)
      .attr("text-anchor", "middle").attr("fill", "#525C6E")
      .attr("font-size", "11px").attr("font-family", "monospace")
      .text("TRANSACTION AMOUNT (NGN)");

    // ── Glow filter ─────────────────────────────────────────────────
    const defs   = svg.append("defs");
    const filter = defs.append("filter").attr("id", "node-glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // ── Tooltip ─────────────────────────────────────────────────────
    d3.selectAll(".d3-tooltip").remove();
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background", "#0D1117")
      .style("border", "1px solid #1E2638")
      .style("border-radius", "8px")
      .style("padding", "11px 15px")
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .style("color", "#F0F4FF")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 9999)
      .style("max-width", "240px")
      .style("line-height", "1.65");

    // ── Pulsing rings (flagged only) ─────────────────────────────────
    g.selectAll(".pulse-ring")
      .data(transactions.filter((d) => d.flagged))
      .enter()
      .append("circle")
      .attr("class", "pulse-ring")
      .attr("cx", (d) => xScale(d.velocity))
      .attr("cy", (d) => yScale(d.amount))
      .attr("r",  (d) => rScale(d.riskScore) + 6)
      .attr("fill", "none")
      .attr("stroke", (d) => RISK_COLORS[d.riskLevel])
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.55)
      .attr("stroke-dasharray", "5 3");

    // ── Data dots ───────────────────────────────────────────────────
    g.selectAll("circle.dot")
      .data(transactions)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.velocity))
      .attr("cy", (d) => yScale(d.amount))
      .attr("fill", (d) => RISK_COLORS[d.riskLevel])
      .attr("fill-opacity", (d) => (d.flagged ? 0.92 : 0.28))
      .attr("stroke", (d) => (d.flagged ? RISK_COLORS[d.riskLevel] : "transparent"))
      .attr("stroke-width", 1.5)
      .attr("filter", (d) => (d.flagged ? "url(#node-glow)" : "none"))
      .style("cursor", (d) => (d.flagged ? "pointer" : "default"))
      .attr("r", 0)
      .transition()
      .delay((_, i) => i * 7)
      .duration(480)
      .attr("r", (d) => rScale(d.riskScore))
      .selection()
      .on("mouseover", function (event, d: Transaction) {
        d3.select(this).transition().duration(80).attr("fill-opacity", d.flagged ? 1 : 0.65);
        tooltip.style("opacity", 1).html(
          `<div style="color:#525C6E;margin-bottom:6px;font-size:10px;letter-spacing:0.08em">${d.id}</div>
           <div style="margin-bottom:2px">Amount: <b style="color:#F0F4FF">₦${d.amount.toLocaleString("en-NG")}</b></div>
           <div style="margin-bottom:2px">Velocity: <b style="color:#F0F4FF">${d.velocity}/hr</b></div>
           <div style="margin-bottom:2px">Risk: <b style="color:${RISK_COLORS[d.riskLevel]}">${d.riskScore}/100 · ${d.riskLevel}</b></div>
           ${d.anomalyType ? `<div style="margin-top:6px;color:${RISK_COLORS[d.riskLevel]};font-size:10px;letter-spacing:0.06em">⚠ ${d.anomalyType}</div>` : ""}
           ${d.flagged ? `<div style="margin-top:6px;font-size:10px;color:#3b82f6">↗ Click to analyse</div>` : ""}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 18 + "px")
          .style("top",  event.pageY - 36 + "px");
      })
      .on("mouseout", function (_, d: Transaction) {
        d3.select(this).transition().duration(80).attr("fill-opacity", d.flagged ? 0.92 : 0.28);
        tooltip.style("opacity", 0);
      })
      .on("click", (_, d: Transaction) => {
        if (d.flagged) setSelectedTransaction(d);
      });

    return () => { d3.selectAll(".d3-tooltip").remove(); };
  }, [setSelectedTransaction]);

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}
      >
        <div>
          <h2
            className="font-mono font-bold tracking-widest text-[11px]"
            style={{ color: "var(--text-1)" }}
          >
            RISK CLUSTER MAP
          </h2>
          <p className="font-mono text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>
            Velocity vs. Volume — click glowing nodes to open AI analysis
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: RISK_COLORS[level] }}
              />
              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--text-3)" }}
              >
                {level}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pl-2" style={{ borderLeft: "1px solid var(--border)" }}>
            <span className="w-2 h-2 rounded-full border border-red-400" />
            <span className="font-mono text-[10px]" style={{ color: "var(--text-3)" }}>
              FLAGGED
            </span>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable on small screens */}
      <div
        className="p-2 overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: 540 }}>
          <svg ref={svgRef} className="w-full" />
        </div>
      </div>
    </div>
  );
}
