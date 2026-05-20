// EventRegistration.jsx — Team-event registration flow.
// One stateful screen: edit dates, add players/guests, swap with family, assign partner,
// then a follow-up "Additional info" step. Mobile + Desktop.

const { useState: useStateER, useMemo: useMemoER } = React;

// ---- sample roster data ----
const LEAD_USER = { id: "u-jer", name: "Jerame Barriga", email: "jer@courtreserve.com", avatar: "JB", color: "#2E5D52", isLead: true };
const FAMILY = [
  { id: "u-jor", name: "Jordan Barriga", relation: "Family · Guardian of", email: "jordan@courtreserve.com", avatar: "JR", color: "#8E5BE8" },
  { id: "u-mia", name: "Mia Barriga",    relation: "Family · Spouse",       email: "mia@courtreserve.com",    avatar: "MB", color: "#D6573B" },
];
const FAVORITES = [
  { id: "u-josh", name: "Josh Weese",       tag: "member", email: "josh@oldcoast.com",  avatar: "JW", color: "#4B5052" },
  { id: "u-neil", name: "Neil Christensen", tag: "member", email: "neil@oldcoast.com",  avatar: "NC", color: "#1F4ED8" },
  { id: "u-jd1",  name: "John Doe",         tag: "family", email: "johnd@missing.com",  avatar: "JD", color: "#F2A93B" },
  { id: "u-jd2",  name: "Jane Doe",         tag: "family", email: "janed@missing.com",  avatar: "JD", color: "#E84D6A" },
];

// ---- shared bits ----
function Pill({ children, on, ...rest }) {
  return (
    <button {...rest} style={{
      display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 10px",
      borderRadius: 8, border: on ? "1px solid #0F1214" : "1px solid #E9EBEC",
      background: on ? "#0F1214" : "#fff", color: on ? "#fff" : "#0F1214",
      fontFamily: "inherit", fontSize: 11, fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

function MiniAvatar({ p, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: p.color || "#0F1214", color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
    }}>{p.avatar}</div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", marginBottom: 8 }}>
      {children}{required && <span style={{ color: "#E11D2A" }}> *</span>}
    </div>
  );
}

function TextField({ value, onChange, placeholder, prefixIcon }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 14px",
      background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
    }}>
      {prefixIcon && <Icon name={prefixIcon} size={15} color="#858F8F" />}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 14, color: "#0F1214" }} />
    </div>
  );
}

function PartnerDropdown({ value, onChange, options }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        appearance: "none", WebkitAppearance: "none",
        width: "100%", height: 44, padding: "0 36px 0 14px",
        background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
        fontFamily: "inherit", fontSize: 14, color: "#0F1214", cursor: "pointer",
      }}>
        <option value="">Assign Partner</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#858F8F" }}>
        <Icon name="ChevronDown" size={14} strokeWidth={2.2} />
      </span>
    </div>
  );
}

// ---- Dates block (type-aware) — unified accordion ----
function DatesBlock({ event, type, hybridSelected, toggleHybrid, hybridExpanded, setHybridExpanded, dropInPick, setDropInPick }) {
  const [open, setOpen] = useStateER(false);

  // Title + chip(s) shown collapsed; expanded shows picker.
  let title, chips, expandable = false, picker = null;

  if (type === "single") {
    const d = event.single;
    title = "Date";
    chips = [`${d.date} · ${d.time}`];
    expandable = true;
    picker = (
      <div style={{ marginTop: 14, padding: "16px 18px", background: "#F4F5F6", border: "1px solid #E9EBEC", borderRadius: 8 }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 18, color: "#0F1214", letterSpacing: -0.3 }}>{d.date}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: "#4B5052", fontWeight: 500 }}>{d.time}</div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#858F8F", fontWeight: 500 }}>This event meets once — date is fixed.</div>
      </div>
    );
  } else if (type === "series") {
    const sessions = event.series.sessions;
    title = `Full series · ${sessions.length} sessions`;
    chips = sessions.map(s => s.label);
    // Series isn't editable, but show first 3 + "show all"
    expandable = chips.length > 3;
  } else if (type === "dropin") {
    const dates = event.dropIn.dates;
    const picked = dates.find(d => d.id === dropInPick);
    title = "Date";
    chips = picked ? [`${picked.label} · ${picked.sub}`] : [];
    expandable = true;
    picker = (
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
        {dates.map(d => {
          const on = dropInPick === d.id;
          return (
            <button key={d.id} onClick={() => { setDropInPick(d.id); setOpen(false); }} style={{
              textAlign: "left", padding: "12px 14px",
              background: on ? "#0F1214" : "#fff", color: on ? "#fff" : "#0F1214",
              border: on ? "1px solid #0F1214" : "1px solid #E9EBEC",
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit", position: "relative",
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: on ? "rgba(255,255,255,.6)" : "#858F8F" }}>{d.label}</div>
              <div style={{ marginTop: 2, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>{d.sub}</div>
              {on && (
                <span style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderRadius: 999, background: "#fff", color: "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Check" size={8} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  } else {
    // Hybrid — keep its existing inline-expand chips component
    return <DatesRow event={event} selected={hybridSelected} toggle={toggleHybrid} expanded={hybridExpanded} setExpanded={setHybridExpanded} />;
  }

  return (
    <div style={{ borderTop: "1px solid #E9EBEC", borderBottom: "1px solid #E9EBEC", padding: "20px 0" }}>
      <button onClick={() => expandable && setOpen(!open)} disabled={!expandable} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent", border: 0, padding: 0, cursor: expandable ? "pointer" : "default", fontFamily: "inherit",
      }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 17, color: "#0F1214", letterSpacing: -0.3 }}>{title}</div>
        {expandable && <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} strokeWidth={2.2} />}
      </button>
      {!open && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {chips.slice(0, type === "series" ? 6 : chips.length).map((c, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", height: 26, padding: "0 10px",
              background: "#F4F5F6", border: "1px solid #E9EBEC", borderRadius: 8,
              fontSize: 12, fontWeight: 500, color: "#0F1214",
            }}>{c}</span>
          ))}
          {type === "series" && chips.length > 6 && (
            <span style={{ alignSelf: "center", fontSize: 12, fontWeight: 500, color: "#4B5052" }}>+{chips.length - 6} more</span>
          )}
        </div>
      )}
      {open && picker}
    </div>
  );
}

// ---- Dates row (hybrid inline expand) ----
function DatesRow({ event, selected, toggle, expanded, setExpanded }) {
  const all = event.hybrid.dates;
  const selectedList = all.filter(d => selected.has(d.id));
  return (
    <div style={{ borderTop: "1px solid #E9EBEC", borderBottom: "1px solid #E9EBEC", padding: "20px 0" }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent", border: 0, padding: 0, cursor: "pointer", fontFamily: "inherit",
      }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 17, color: "#0F1214", letterSpacing: -0.3 }}>
          {selectedList.length} dates selected
        </div>
        <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={16} strokeWidth={2.2} />
      </button>

      {!expanded && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {selectedList.map(d => (
            <span key={d.id} style={{
              display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 4px 0 10px",
              background: "#F4F5F6", border: "1px solid #E9EBEC", borderRadius: 8,
              fontSize: 12, fontWeight: 500, color: "#0F1214",
            }}>
              Fri, {d.date.replace("MAR ", "Mar ").replace("APR ", "Apr ")}
              <button onClick={(e) => { e.stopPropagation(); toggle(d.id); }} style={{
                width: 18, height: 18, borderRadius: 999, border: 0, background: "transparent",
                display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Icon name="X" size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginBottom: 10 }}>
            Pick & choose · {event.hybrid.pricePerSession} each, or {event.hybrid.bundlePrice} for all {all.length}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
            {all.map(d => {
              const on = selected.has(d.id);
              return (
                <button key={d.id} onClick={() => toggle(d.id)} style={{
                  textAlign: "left", padding: "12px 14px",
                  background: on ? "#0F1214" : "#fff",
                  color: on ? "#fff" : "#0F1214",
                  border: on ? "1px solid #0F1214" : "1px solid #E9EBEC",
                  borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                  position: "relative",
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: on ? "rgba(255,255,255,.6)" : "#858F8F" }}>{d.weekday}</div>
                  <div style={{ marginTop: 2, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>{d.date}</div>
                  {on && (
                    <span style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderRadius: 999, background: "#fff", color: "#0F1214", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="Check" size={8} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Player row ----
function PlayerRow({ player, lead, onSwap, onRemove, onAssignPartner, partnerOptions, isLead, isPending, onUpdate, desktop, swapOptions, onSwapPick }) {
  const [swapOpen, setSwapOpen] = useStateER(false);
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid #F4F5F6", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MiniAvatar p={player} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F1214", letterSpacing: -0.2 }}>
              {player.name}{isLead ? " (you)" : player.relation ? ` (G)` : ""}
            </span>
            <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F1214" }}>· $5</span>
          </div>
          <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{player.email}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {isLead && (
            <button onClick={() => desktop ? setSwapOpen(v => !v) : onSwap()} aria-label="Swap with family"
              style={{ width: 32, height: 32, borderRadius: 999, border: 0, background: swapOpen ? "#F4F5F6" : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="RefreshCw" size={14} strokeWidth={2.2} />
            </button>
          )}
          {!isLead && !isPending && (
            <button onClick={onRemove} aria-label="Remove"
              style={{ width: 32, height: 32, borderRadius: 999, border: 0, background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="X" size={14} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>

      {/* Inline guest fields when pending */}
      {isPending && (
        <div style={{ marginTop: 14, display: "grid", gap: 12, paddingLeft: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <FieldLabel required>First name</FieldLabel>
              <TextField value={player.first || ""} onChange={(v) => onUpdate({ first: v })} placeholder="Jane" />
            </div>
            <div>
              <FieldLabel required>Last name</FieldLabel>
              <TextField value={player.last || ""} onChange={(v) => onUpdate({ last: v })} placeholder="Doe" />
            </div>
          </div>
          <div>
            <FieldLabel required>Email</FieldLabel>
            <TextField value={player.email || ""} onChange={(v) => onUpdate({ email: v })} placeholder="jane@email.com" prefixIcon="Mail" />
          </div>
        </div>
      )}

      {/* Assign Partner — lead user only */}
      {isLead && (
        <div style={{ marginTop: 12, paddingLeft: 48, position: "relative" }}>
          <PartnerDropdown
            value={player.partnerId || ""}
            onChange={onAssignPartner}
            options={partnerOptions}
          />
          {/* Desktop swap dropdown — anchored beneath partner field */}
          {desktop && isLead && swapOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
              boxShadow: "0 10px 30px rgba(15,18,20,.12), 0 2px 6px rgba(15,18,20,.06)",
              zIndex: 5, padding: 6,
            }}>
              <div style={{ padding: "6px 10px", fontSize: 11, color: "#858F8F", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Register a family member instead</div>
              {(swapOptions || []).map(o => (
                <button key={o.id} onClick={() => { onSwapPick && onSwapPick(o); setSwapOpen(false); }} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 10px", background: "transparent", border: 0, cursor: "pointer",
                  borderRadius: 8, fontFamily: "inherit", textAlign: "left",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F4F5F6"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <MiniAvatar p={o} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F1214" }}>{o.name}</div>
                    <div style={{ fontSize: 11, color: "#4B5052", fontWeight: 500, marginTop: 1 }}>{o.relation}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Swap sheet (family) ----
function SwapSheet({ open, onClose, options, onPick }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(15,18,20,.4)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 220ms", zIndex: 3,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, background: "#fff",
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 320ms cubic-bezier(.2,.8,.2,1)", zIndex: 4,
        padding: "8px 0 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "#DEE1E5" }} />
        </div>
        <div style={{ padding: "8px 20px 16px" }}>
          <h3 style={{ margin: 0, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: -0.6 }}>Register a family member instead.</h3>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#4B5052", fontWeight: 500 }}>You'll be removed from this lineup and replaced.</p>
        </div>
        <div style={{ padding: "0 8px" }}>
          {options.map(o => (
            <button key={o.id} onClick={() => { onPick(o); onClose(); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "12px 12px", margin: 0, background: "transparent", border: 0, cursor: "pointer",
              borderRadius: 8, fontFamily: "inherit",
            }}>
              <MiniAvatar p={o} size={40} />
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F1214" }}>{o.name}</div>
                <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{o.relation}</div>
              </div>
              <Icon name="ChevronRight" size={16} color="#858F8F" />
            </button>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

// ---- Cart ----
function Cart({ players, perPlayer = 5, baseFee = 20, taxRate = 0.1075 }) {
  const regFee = baseFee;
  const subtotal = perPlayer * players.length * 2 + regFee; // rough mirror of mock
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const fmt = (n) => `$${n.toFixed(2)}`;
  return (
    <div style={{ background: "#F4F5F6", borderRadius: 8, padding: "16px 18px", marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#0F1214" }}>
        <span>Registration fees</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(regFee)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#0F1214" }}>
        <span>Subtotal</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(subtotal)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#4B5052" }}>
        <span>Tax ({(taxRate * 100).toFixed(2)}%)</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(tax)}</span>
      </div>
      <div style={{ height: 1, background: "#E9EBEC", margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 14, color: "#0F1214" }}>Total Due</span>
        <span style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 18, color: "#0F1214", fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
      </div>
    </div>
  );
}

// ---- Additional info step ----
function AdditionalInfoBlock({ player, isLead, value, onChange }) {
  return (
    <div style={{ paddingTop: 20, borderTop: "1px solid #E9EBEC" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <MiniAvatar p={player} size={44} />
        <div>
          <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F1214", letterSpacing: -0.2 }}>
            {player.name} {isLead ? "(you)" : "(player)"}
          </div>
          <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 2 }}>{player.email}</div>
        </div>
      </div>
      <FieldLabel required>Skill level self-assessment</FieldLabel>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <select value={value.skill || ""} onChange={(e) => onChange({ skill: e.target.value })} style={{
          appearance: "none", WebkitAppearance: "none", width: "100%", height: 44, padding: "0 36px 0 14px",
          background: "#fff", border: "1px solid #E9EBEC", borderRadius: 8,
          fontFamily: "inherit", fontSize: 14, color: value.skill ? "#0F1214" : "#858F8F", cursor: "pointer",
        }}>
          <option value="">Select your level</option>
          <option value="2.5">2.5</option>
          <option value="3.0">3.0</option>
          <option value="3.5">3.5</option>
          <option value="4.0">4.0</option>
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#858F8F" }}>
          <Icon name="ChevronDown" size={14} strokeWidth={2.2} />
        </span>
      </div>
      <FieldLabel>Anything the instructor should know?</FieldLabel>
      <textarea value={value.notes || ""} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Injuries, areas you want to work on, etc."
        style={{ width: "100%", minHeight: 80, padding: 14, border: "1px solid #E9EBEC", borderRadius: 8, fontFamily: "inherit", fontSize: 14, color: "#0F1214", resize: "vertical", background: "#fff" }} />
    </div>
  );
}

// ---- Main component ----
function EventRegistration({ viewport = "mobile", type = "hybrid", onBack }) {
  const event = window.DETAIL_EVENT;
  const desktop = viewport === "desktop";

  // Step 1: players selection, Step 2: additional info
  const [step, setStep] = useStateER(1);

  // Lead is initially the user, may be swapped for a family member.
  const [lead, setLead] = useStateER(LEAD_USER);
  // Added players (not the lead). Each: { id, name, email, color, avatar, isGuest, isPending, first, last }
  const [extras, setExtras] = useStateER([
    { ...FAVORITES[2], isGuest: false, isPending: false }, // John Doe pre-added (matches mock)
  ]);
  const [partnerId, setPartnerId] = useStateER(""); // lead's assigned partner
  const [additional, setAdditional] = useStateER({}); // { playerId: { skill, notes } }

  const [dropInPick, setDropInPick] = useStateER(event.dropIn.dates[0].id);

  // Dates from hybrid event — preselect all 5
  const [selectedDates, setSelectedDates] = useStateER(new Set(event.hybrid.dates.map(d => d.id)));
  const [datesOpen, setDatesOpen] = useStateER(false);
  const toggleDate = (id) => setSelectedDates(prev => {
    const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });

  const [swapOpen, setSwapOpen] = useStateER(false);

  const allPlayers = [lead, ...extras];
  const partnerOptions = allPlayers.filter(p => p.id !== lead.id).map(p => ({ id: p.id, label: `${p.name}${p.isGuest ? " (guest)" : ""}` }));

  const addGuest = () => {
    const id = `guest-${Date.now()}`;
    setExtras(prev => [...prev, {
      id, name: "New guest", email: "", first: "", last: "",
      avatar: "?", color: "#858F8F", isGuest: true, isPending: true,
    }]);
  };
  const updateExtra = (id, patch) => setExtras(prev => prev.map(p => p.id === id ? {
    ...p, ...patch,
    name: (patch.first || p.first || "") + ((patch.last || p.last) ? ` ${patch.last || p.last}` : "") || p.name,
    avatar: ((patch.first || p.first || "")[0] || "?").toUpperCase() + ((patch.last || p.last || "")[0] || "").toUpperCase(),
  } : p));
  const removeExtra = (id) => setExtras(prev => prev.filter(p => p.id !== id));

  // Body
  const stepOne = (
    <React.Fragment>
      {/* Event summary block */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #0F1214" }}>Registering for</div>
        <h1 style={{
          margin: 0, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800,
          fontSize: desktop ? 36 : 24, lineHeight: 1.05, letterSpacing: desktop ? -1 : -0.6, color: "#0F1214",
        }}>{event.name}.</h1>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#4B5052", fontWeight: 500 }}>
          <span>{event.openSpots}/{event.totalSpots} open</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1", alignSelf: "center" }} />
          <span>{
            type === "single" ? `Single session · ${event.single.price}` :
            type === "dropin" ? `Drop-in · ${event.dropIn.pricePerSession}` :
            type === "series" ? `Full series · ${event.series.totalPrice} for ${event.series.totalSessions}` :
            `Drop-in & Series · ${event.hybrid.pricePerSession} each`
          }</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: "#BBBFC1", alignSelf: "center" }} />
          <span>{event.sport} · {event.surface}</span>
        </div>
      </div>

      {/* Dates block */}
      <div style={{ marginTop: 24 }}>
        <DatesBlock event={event} type={type}
          hybridSelected={selectedDates} toggleHybrid={toggleDate}
          hybridExpanded={datesOpen} setHybridExpanded={setDatesOpen}
          dropInPick={dropInPick} setDropInPick={setDropInPick} />
      </div>

      {/* Who's attending */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 17, color: "#0F1214", letterSpacing: -0.3, marginBottom: 8 }}>
          Who's attending? <span style={{ color: "#E11D2A" }}>*</span>
        </div>
        <div>
          <PlayerRow player={{ ...lead, partnerId }} isLead={true}
            desktop={desktop}
            onSwap={() => setSwapOpen(true)}
            swapOptions={FAMILY}
            onSwapPick={(o) => setLead({ ...o, isLead: true })}
            onAssignPartner={setPartnerId}
            partnerOptions={partnerOptions} />
          {extras.map(p => (
            <PlayerRow key={p.id} player={p} isLead={false}
              isPending={p.isPending}
              onRemove={() => removeExtra(p.id)}
              onUpdate={(patch) => updateExtra(p.id, patch)} />
          ))}
        </div>
      </div>

      {/* Add guest button only — main CTA lives in sidebar (desktop) / sticky bar (mobile) */}
      <div style={{ marginTop: 14 }}>
        <button onClick={addGuest} style={{
          height: 40, padding: "0 16px", borderRadius: 8,
          background: "#fff", color: "#0F1214", border: "1px solid #DEE1E5",
          fontFamily: "inherit", fontWeight: 600, fontSize: 13, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <Icon name="Plus" size={13} strokeWidth={2.4} /> Add Guest
        </button>
      </div>
    </React.Fragment>
  );

  const stepTwo = (
    <React.Fragment>
      <div style={{ paddingTop: 4 }}>
        <button onClick={() => setStep(1)} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: 0, padding: 0, cursor: "pointer",
          color: "#4B5052", fontFamily: "inherit", fontSize: 12, fontWeight: 600, marginBottom: 14,
        }}>
          <Icon name="ChevronLeft" size={14} strokeWidth={2.2} /> Back to players
        </button>
        <h2 style={{
          margin: 0, fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800,
          fontSize: desktop ? 32 : 22, lineHeight: 1.1, letterSpacing: desktop ? -0.8 : -0.5, color: "#0F1214",
        }}>Additional information.</h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#4B5052", fontWeight: 500 }}>
          One block per player — required for {event.sport.toLowerCase()} clinics.
        </p>
      </div>

      <div style={{ marginTop: 24 }}>
        {allPlayers.map(p => (
          <AdditionalInfoBlock key={p.id} player={p} isLead={p.id === lead.id}
            value={additional[p.id] || {}}
            onChange={(patch) => setAdditional(prev => ({ ...prev, [p.id]: { ...prev[p.id], ...patch } }))} />
        ))}
      </div>
    </React.Fragment>
  );

  // ---------- shared layout ----------
  const totalLabel = step === 1 ? "Confirm Players" : "Continue to Payment";

  const cartAndCta = (
    <React.Fragment>
      <Cart players={allPlayers} />
      {desktop && (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => step === 1 ? setStep(2) : null} style={{
            width: "100%", height: 52, padding: "0 20px", borderRadius: 8, background: "#0F1214", color: "#fff",
            border: 0, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {step === 1 ? "Confirm Players" : "Continue to Payment"}
            <Icon name="ArrowRight" size={14} color="#fff" strokeWidth={2.5} />
          </button>
          <div style={{ marginTop: 10, fontSize: 11, color: "#4B5052", textAlign: "center" }}>
            Cancel up to 4 hours before start time
          </div>
        </div>
      )}
    </React.Fragment>
  );

  // ---------- Desktop ----------
  if (desktop) {
    return (
      <div style={{ background: "#fff", minHeight: 2000, fontFamily: "Inter, system-ui, sans-serif" }}>
        <TopBar />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 96px" }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: 0,
            padding: 0, cursor: "pointer", color: "#858F8F", fontFamily: "inherit", fontSize: 12, fontWeight: 500, marginBottom: 24,
          }}>
            <Icon name="ArrowLeft" size={12} strokeWidth={2} color="#858F8F" /> Back to event
          </button>

          {/* Stepper removed */}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "flex-start" }}>
            <div>{step === 1 ? stepOne : stepTwo}</div>
            <aside style={{ position: "sticky", top: 88, background: "#fff", padding: 0 }}>
              <div style={{ fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", color: "#0F1214", marginBottom: 6, paddingBottom: 12, borderBottom: "1px solid #0F1214" }}>Order summary</div>
              <div style={{ fontSize: 12, color: "#4B5052", fontWeight: 500, marginTop: 8 }}>{allPlayers.length} player{allPlayers.length !== 1 ? "s" : ""} · {selectedDates.size} session{selectedDates.size !== 1 ? "s" : ""}</div>
              {cartAndCta}
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Mobile ----------
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "#fff", borderBottom: "1px solid #E9EBEC",
        height: 52, display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      }}>
        <button onClick={onBack} style={{ background: "transparent", border: 0, padding: 8, marginLeft: -8, cursor: "pointer", display: "inline-flex" }}>
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div style={{ flex: 1, textAlign: "center", fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 0.4 }}>
          {step === 1 ? "Register" : "Additional info"}
        </div>
        <div style={{ display: "inline-flex", gap: 4 }}>
          <span style={{ width: 16, height: 4, borderRadius: 999, background: "#0F1214" }} />
          <span style={{ width: 16, height: 4, borderRadius: 999, background: step >= 2 ? "#0F1214" : "#E9EBEC" }} />
          <span style={{ width: 16, height: 4, borderRadius: 999, background: "#E9EBEC" }} />
        </div>
      </div>

      <div style={{ padding: "20px 20px 24px" }}>
        {step === 1 ? stepOne : stepTwo}
        <Cart players={allPlayers} />
        <div style={{ height: 100 }} />
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        background: "#fff", borderTop: "1px solid #E9EBEC", padding: "12px 16px 18px",
      }}>
        <button onClick={() => step === 1 ? setStep(2) : null} style={{
          width: "100%", height: 54, border: 0, borderRadius: 8,
          background: "#0F1214", color: "#fff",
          fontFamily: "inherit", fontWeight: 600, fontSize: 15,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer",
        }}>
          {totalLabel}
          <Icon name="ArrowRight" size={16} color="#fff" strokeWidth={2.5} />
        </button>
      </div>

      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} options={FAMILY}
        onPick={(o) => setLead({ ...o, isLead: true })} />
    </div>
  );
}

function StepDot({ n, active, done, label, muted }) {
  const bg = done ? "#0F1214" : active ? "#0F1214" : "#fff";
  const fg = done || active ? "#fff" : "#858F8F";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: muted ? 0.5 : 1 }}>
      <span style={{
        width: 22, height: 22, borderRadius: 999, background: bg, color: fg,
        border: active || done ? "0" : "1px solid #DEE1E5",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Axiforma, Inter, system-ui, sans-serif", fontWeight: 800, fontSize: 11,
      }}>{done ? <Icon name="Check" size={11} color="#fff" strokeWidth={3} /> : n}</span>
      <span style={{ color: muted ? "#858F8F" : "#0F1214", fontSize: 12, fontWeight: 600 }}>{label}</span>
    </div>
  );
}
function StepLine({ muted }) {
  return <span style={{ flex: 1, height: 1, background: muted ? "#E9EBEC" : "#0F1214", maxWidth: 40 }} />;
}

Object.assign(window, { EventRegistration });
