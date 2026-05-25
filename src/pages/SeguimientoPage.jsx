import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";


async function fetchAsesores() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre")
    .eq("rol", "asesor")
    .order("nombre");

  console.log("asesores data:", data); // ← agrega esto
  console.log("asesores error:", error); // ← y esto

  if (error) throw error;
  return data;
}

async function fetchProspectos(asesorId) {
  const { data, error } = await supabase
    .from("prospectos")
    .select(
      `
      id, nombre, telefono,
      seguimientos ( respuesta, cotizacion, cita, seguimiento )
    `,
    )
    .eq("asignado_a", asesorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function upsertSeguimiento({ prospectoId, asesorId, campo, valor }) {
  // Primero obtenemos el seguimiento actual
  const { data: actual } = await supabase
    .from("seguimientos")
    .select("*")
    .eq("prospecto_id", prospectoId)
    .single();

  const payload = {
    prospecto_id: prospectoId,
    asesor_id: asesorId,
    respuesta: actual?.respuesta ?? false,
    cotizacion: actual?.cotizacion ?? false,
    cita: actual?.cita ?? false,
    seguimiento: actual?.seguimiento ?? false,
    [campo]: valor,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("seguimientos")
    .upsert(payload, { onConflict: "prospecto_id" });

  if (error) throw error;
}

/* ── Componentes ─────────────────────────────────────────── */

const CHECKS = [
  { key: "respuesta", label: "Respuesta" },
  { key: "cotizacion", label: "Cotización" },
  { key: "cita", label: "Cita" },
  { key: "seguimiento", label: "Seguimiento" },
];

function CheckCircle({ checked, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`check-circle transition-all ${checked ? "checked" : ""} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {checked && (
        <svg
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fff"
          strokeWidth={3}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

function ProspectoCard({ prospecto, asesorId }) {
  const queryClient = useQueryClient();
  const seg = prospecto.seguimientos?.[0] ?? {};

  const { mutate, isPending } = useMutation({
    mutationFn: upsertSeguimiento,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["prospectos", asesorId] }),
  });

  const avance = CHECKS.filter((c) => seg[c.key]).length;

  function toggle(campo) {
    mutate({
      prospectoId: prospecto.id,
      asesorId,
      campo,
      valor: !seg[campo],
    });
  }

  return (
    <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <div className="min-w-0">
        <p className="font-medium text-ink text-sm truncate">
          {prospecto.nombre}
        </p>
        <p className="text-ink-muted text-xs mt-0.5">{prospecto.telefono}</p>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-5 flex-wrap">
        {CHECKS.map((c) => (
          <div key={c.key} className="flex flex-col items-center gap-1.5">
            <CheckCircle
              checked={!!seg[c.key]}
              onClick={() => toggle(c.key)}
              disabled={isPending}
            />
            <span className="text-ink-muted text-[10px]">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Barra de avance */}
      <div className="flex items-center gap-2 w-full sm:w-28">
        <div className="progress-track flex-1">
          <div
            className={`progress-fill ${avance === 4 ? "complete" : ""}`}
            style={{ width: `${(avance / 4) * 100}%` }}
          />
        </div>
        <span className="text-ink-muted text-xs">{avance}/4</span>
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────────── */

export default function SeguimientoPage() {
  const [asesorId, setAsesorId] = useState("");

  const { data: asesores = [], isLoading: loadingAsesores } = useQuery({
    queryKey: ["asesores-publico"],
    queryFn: fetchAsesores,
  });

  const { data: prospectos = [], isLoading: loadingProspectos } = useQuery({
    queryKey: ["prospectos", asesorId],
    queryFn: () => fetchProspectos(asesorId),
    enabled: !!asesorId,
  });

  const asesorNombre = asesores.find((a) => a.id === asesorId)?.nombre ?? "";

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header
        className="bg-bg-sidebar border-b"
        style={{ borderColor: "var(--color-line)" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          <div
            className="text-white text-[10px] font-display font-bold tracking-widest px-2 py-0.5"
            style={{ background: "var(--color-toyota)", borderRadius: 2 }}
          >
            TOYOTA
          </div>
          <span className="font-display font-semibold text-ink tracking-wide">
            Seguimiento de prospectos
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        {/* Select de asesor */}
        <div className="card space-y-3">
          <div>
            <label className="text-ink-muted text-xs font-medium tracking-widest uppercase">
              ¿Quién eres?
            </label>
            <p className="text-ink-muted text-xs mt-0.5">
              Selecciona tu nombre para ver tus prospectos
            </p>
          </div>

          {loadingAsesores ? (
            <div className="flex items-center gap-2 text-ink-muted text-sm">
              <Spinner /> Cargando asesores...
            </div>
          ) : (
            <select
              className="input"
              value={asesorId}
              onChange={(e) => setAsesorId(e.target.value)}
            >
              <option value="">-- Selecciona tu nombre --</option>
              {asesores.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Lista de prospectos */}
        {asesorId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink tracking-wide">
                Prospectos de {asesorNombre}
              </h2>
              {!loadingProspectos && (
                <span className="text-ink-muted text-xs">
                  {prospectos.length} prospecto
                  {prospectos.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loadingProspectos ? (
              <div className="flex items-center gap-2 text-ink-muted text-sm py-6 justify-center">
                <Spinner /> Cargando...
              </div>
            ) : prospectos.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-ink-muted text-sm">
                  No tienes prospectos asignados aún.
                </p>
              </div>
            ) : (
              prospectos.map((p) => (
                <ProspectoCard key={p.id} prospecto={p} asesorId={asesorId} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
