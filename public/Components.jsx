// Components.jsx — Pickle Pixels primitives
const { useState, useEffect, useRef } = React;

function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.75 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = "";
      const svg = window.lucide.createElement(window.lucide.icons[name] || window.lucide.icons.Circle);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("stroke", color);
      svg.setAttribute("stroke-width", strokeWidth);
      ref.current.appendChild(svg);
    }
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", lineHeight: 0 }} />;
}

function Button({ variant = "primary", size = "md", leftIcon, rightIcon, children, onClick, disabled, type = "button", style }) {
  const sizes = {
    sm: { h: 32, px: 12, fs: 13 },
    md: { h: 40, px: 16, fs: 14 },
    lg: { h: 48, px: 20, fs: 16 },
  }[size];
  const variants = {
    primary:   { bg: "#1F4ED8", fg: "#fff", bd: "transparent", hover: "#0052B4" },
    secondary: { bg: "#2E7D32", fg: "#fff", bd: "transparent", hover: "#1B5E20" },
    danger:    { bg: "#DA0B0B", fg: "#fff", bd: "transparent", hover: "#A60808" },
    outline:   { bg: "#fff",     fg: "#0F1214", bd: "#DEE1E5",  hover: "#F4F5F6" },
    "outline-primary": { bg: "#fff", fg: "#1F4ED8", bd: "#1F4ED8", hover: "#EDF1FB" },
    subtle:    { bg: "#EDF1FB", fg: "#1F4ED8", bd: "transparent", hover: "#DCE5F8" },
    ghost:     { bg: "transparent", fg: "#1F4ED8", bd: "transparent", hover: "#EDF1FB" },
    "ghost-neutral": { bg: "transparent", fg: "#0F1214", bd: "transparent", hover: "#F4F5F6" },
  }[variant];
  const [hover, setHover] = useState(false);
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
        fontWeight: 500, letterSpacing: 0.1,
        background: hover && !disabled ? variants.hover : variants.bg,
        color: variants.fg,
        border: `1px solid ${variants.bd}`,
        borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 120ms ease-out, color 120ms ease-out",
        outline: "none",
        ...style,
      }}>
      {leftIcon && <Icon name={leftIcon} size={sizes.fs + 2} />}
      {children}
      {rightIcon && <Icon name={rightIcon} size={sizes.fs + 2} />}
    </button>
  );
}

function IconButton({ icon, onClick, label, size = "md", variant = "ghost-neutral" }) {
  return <Button variant={variant} size={size} onClick={onClick} style={{ width: size === "sm" ? 32 : 40, padding: 0 }} aria-label={label}><Icon name={icon} size={18} /></Button>;
}

function Input({ label, value, onChange, placeholder, type = "text", icon, error, help, style }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <span style={{ fontWeight: 500, fontSize: 14, color: "#0F1214", letterSpacing: 0.1 }}>{label}</span>}
      <span style={{
        position: "relative", display: "flex", alignItems: "center",
        height: 40, borderRadius: 6,
        border: `1px solid ${error ? "#DA0B0B" : focus ? "#1F4ED8" : "#DEE1E5"}`,
        boxShadow: focus ? "0 0 0 3px rgba(31,78,216,0.32)" : "none",
        background: "#fff", transition: "all 120ms",
      }}>
        {icon && <span style={{ paddingLeft: 12, color: "#858F8F", display: "inline-flex" }}><Icon name={icon} size={16} /></span>}
        <input type={type} value={value || ""} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ border: 0, outline: 0, background: "transparent", flex: 1, padding: icon ? "0 12px 0 8px" : "0 12px", fontSize: 14, color: "#0F1214", fontFamily: "inherit", height: "100%" }}/>
      </span>
      {(error || help) && <span style={{ fontSize: 13, letterSpacing: 0.2, color: error ? "#DA0B0B" : "#4B5052" }}>{error || help}</span>}
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <span style={{ fontWeight: 500, fontSize: 14, color: "#0F1214" }}>{label}</span>}
      <select value={value} onChange={onChange} style={{
        height: 40, padding: "0 12px", borderRadius: 6, border: "1px solid #DEE1E5",
        background: "#fff", fontFamily: "inherit", fontSize: 14, color: "#0F1214", outline: "none",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

const STATUS_COLORS = {
  primary: { bg: "#1F4ED8", fg: "#fff" },
  success: { bg: "#2E7D32", fg: "#fff" },
  error:   { bg: "#DA0B0B", fg: "#fff" },
  warning: { bg: "#FFDA44", fg: "#0F1214" },
  neutral: { bg: "#F4F5F6", fg: "#0F1214" },
  ink:     { bg: "#0F1214", fg: "#fff" },
};
function Badge({ status = "neutral", children }) {
  const c = STATUS_COLORS[status];
  return <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 8px", borderRadius: 999, background: c.bg, color: c.fg, fontWeight: 600, fontSize: 11, letterSpacing: 0.2, border: status === "neutral" ? "1px solid #DEE1E5" : "0" }}>{children}</span>;
}
function DotBadge({ status = "neutral", children }) {
  const dotColor = { success: "#2E7D32", warning: "#FFDA44", error: "#DA0B0B", primary: "#1F4ED8", neutral: "#858F8F" }[status];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#0F1214" }}>
    <span style={{ width: 8, height: 8, borderRadius: 999, background: dotColor }}/>{children}
  </span>;
}

const TINT_BG = { primary: "#EDF1FB", success: "#F1F7F0", error: "#FEECEC", warning: "#FFF8E1", neutral: "#F4F5F6" };
const TINT_FG = { primary: "#1F4ED8", success: "#2E7D32", error: "#DA0B0B", warning: "#5C4400", neutral: "#4B5052" };
function Tag({ status = "neutral", children }) {
  return <span style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 4, background: TINT_BG[status], color: TINT_FG[status], fontWeight: 500, fontSize: 12 }}>{children}</span>;
}

function Avatar({ name, size = 32, src }) {
  const initials = (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["#1F4ED8", "#2E7D32", "#DA0B0B", "#0F1214", "#4B5052"];
  const c = colors[(name || "").charCodeAt(0) % colors.length];
  return <span style={{ width: size, height: size, borderRadius: 999, background: src ? "transparent" : c, color: "#fff", fontWeight: 600, fontSize: size * 0.36, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{initials}</span>;
}

function Card({ children, padding = 20, style }) {
  return <div style={{ background: "#fff", border: "0.5px solid #E9EBEC", borderRadius: 8, padding, boxShadow: "0 1px 2px rgba(15,18,20,.06)", ...style }}>{children}</div>;
}

function Alert({ status = "info", title, children, onClose }) {
  const map = {
    success: { bg: "#F1F7F0", bd: "#C6E3C8", fg: "#1B5E20", icon: "CheckCircle2", iconBg: "#2E7D32" },
    error:   { bg: "#FEECEC", bd: "#F4C1C1", fg: "#A60808", icon: "AlertCircle", iconBg: "#DA0B0B" },
    warning: { bg: "#FFF8E1", bd: "#FFE69C", fg: "#5C4400", icon: "AlertTriangle", iconBg: "#FFDA44" },
    info:    { bg: "#EDF1FB", bd: "#C6D2EE", fg: "#143A9C", icon: "Info", iconBg: "#1F4ED8" },
  }[status];
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 6, background: map.bg, border: `0.5px solid ${map.bd}`, color: map.fg }}>
      <span style={{ width: 20, height: 20, borderRadius: 999, background: map.iconBg, color: status === "warning" ? "#0F1214" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon name={map.icon} size={12} strokeWidth={2.5} />
      </span>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, lineHeight: "20px", letterSpacing: 0.1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>}
        {children}
      </div>
      {onClose && <button onClick={onClose} style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer", padding: 0 }}><Icon name="X" size={16} /></button>}
    </div>
  );
}

function Modal({ open, onClose, title, children, footer, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width, maxWidth: "90vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 16px 48px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.08)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "0.5px solid #E9EBEC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#0F1214", fontFamily: "Inter, system-ui, sans-serif" }}>{title}</h3>
          <IconButton icon="X" onClick={onClose} label="Close" size="sm" />
        </div>
        <div style={{ padding: "20px 24px", overflow: "auto", flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "0.5px solid #E9EBEC", display: "flex", justifyContent: "flex-end", gap: 8, background: "#F4F5F6" }}>{footer}</div>}
      </div>
    </div>
  );
}

// Shared "club" reference — a small marker pairing a location pin with
// the club name. Two visual variants:
//   variant="inline" (default) — bare icon + text, sits within a meta
//   line alongside other dot-separated bits.
//   variant="tag" — same icon + text wrapped in a soft pill so the club
//   stands out on its own line (used on UpcomingCards / MyUpcomingList).
// `tone="dark"` flips both variants for dark backgrounds.
function ClubTag({ club, color = "#0F1214", tone = "light", size = "md", variant = "inline", style }) {
  if (!club) return null;
  const dims = size === "sm"
    ? { iconSize: 11, fs: 11, gap: 5, h: 22, px: 8 }
    : { iconSize: 12, fs: 11, gap: 6, h: 22, px: 10 };
  const looksHex = typeof color === "string" && color.startsWith("#") && color.length === 7;
  const isTag = variant === "tag";
  const bg = isTag
    ? (tone === "dark" ? "rgba(255,255,255,.12)" : (looksHex ? color + "14" : "rgba(15,18,20,.06)"))
    : "transparent";
  const fg = tone === "dark" ? (isTag ? "#fff" : "rgba(255,255,255,.85)") : color;
  const iconColor = tone === "dark" ? "rgba(255,255,255,.75)" : color;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: dims.gap,
      ...(isTag ? { height: dims.h, padding: `0 ${dims.px}px`, borderRadius: 999, background: bg } : null),
      color: fg,
      fontFamily: "Axiforma, Inter, sans-serif",
      fontWeight: isTag ? 700 : 600,
      fontSize: dims.fs, letterSpacing: isTag ? 0.2 : 0.1,
      maxWidth: "100%", overflow: "hidden",
      ...style,
    }}>
      <Icon name="MapPin" size={dims.iconSize} color={iconColor} strokeWidth={2} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{club}</span>
    </span>
  );
}

Object.assign(window, { Icon, Button, IconButton, Input, Select, Badge, DotBadge, Tag, ClubTag, Avatar, Card, Alert, Modal });
