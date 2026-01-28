import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Users,
  Calendar,
  Shield,
  Lock,
  LogOut,
  Save,
  ArrowUpCircle,
  Edit,
  X,
  Search,
  FileText,
  MapPin,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Building2,
  Calculator,
  Plus,
} from "lucide-react";

// --- CONFIGURACIÓN MAESTRA ---
const CONFIG = {
  points: {
    "3ra": {
      campeon: 1000,
      finalista: 600,
      semi: 360,
      cuartos: 180,
      grupos: 45,
    },
    "4ta": { campeon: 500, finalista: 300, semi: 180, cuartos: 90, grupos: 20 },
    "5ta": { campeon: 250, finalista: 150, semi: 90, cuartos: 45, grupos: 10 },
    "6ta": { campeon: 125, finalista: 75, semi: 45, cuartos: 20, grupos: 5 },
    A: { campeon: 1000, finalista: 600, semi: 360, cuartos: 180, grupos: 45 },
    B: { campeon: 500, finalista: 300, semi: 180, cuartos: 90, grupos: 20 },
    C: { campeon: 250, finalista: 150, semi: 90, cuartos: 45, grupos: 10 },
    D: { campeon: 125, finalista: 75, semi: 45, cuartos: 20, grupos: 5 },
  },
  promotion: {
    "6ta": { target: 500, next: "5ta" },
    "5ta": { target: 1000, next: "4ta" },
    "4ta": { target: 2000, next: "3ra" },
    "3ra": { target: 5000, next: "PRO" },
    D: { target: 500, next: "C" },
    C: { target: 1000, next: "B" },
    B: { target: 2000, next: "A" },
    A: { target: 5000, next: "PRO" },
  },
};

// --- DATOS INICIALES ---
const INITIAL_CLUBS = [
  "Match Padel",
  "North Padel",
  "One Padel",
  "Niza Padel",
  "Pro Padel",
  "Padel Club",
  "Ares Padel",
  "Lego Padel",
  "Pinar Padel Club",
  "Total Padel",
  "Nona Pepa",
  "Bet Padel",
];

const INITIAL_PLAYERS = [
  {
    id: "CUC-M-01",
    name: "Santiago Martínez",
    division: "Masculina",
    category: "3ra",
    club: "Match Padel",
    active: true,
  },
  {
    id: "CUC-M-02",
    name: "Felipe Gómez",
    division: "Masculina",
    category: "3ra",
    club: "North Padel",
    active: true,
  },
  {
    id: "CUC-M-03",
    name: "Andrés Pérez",
    division: "Masculina",
    category: "4ta",
    club: "Niza Padel",
    active: true,
  },
  {
    id: "CUC-F-01",
    name: "María Paula García",
    division: "Femenina",
    category: "A",
    club: "One Padel",
    active: true,
  },
  {
    id: "CUC-F-02",
    name: "Andrea Torres",
    division: "Femenina",
    category: "B",
    club: "Padel Club",
    active: true,
  },
  {
    id: "CUC-X-01",
    name: "Juan Carlos (Mix)",
    division: "Mixta",
    category: "A",
    club: "North Padel",
    active: true,
  },
  {
    id: "CUC-X-02",
    name: "Laura Restrepo (Mix)",
    division: "Mixta",
    category: "A",
    club: "North Padel",
    active: true,
  },
  {
    id: "CUC-X-03",
    name: "Pedro Díaz (Mix)",
    division: "Mixta",
    category: "B",
    club: "Ares Padel",
    active: true,
  },
];

const INITIAL_TOURNAMENTS = [
  {
    id: 90,
    name: "Open Apertura 2025",
    club: "Match Padel",
    date: "2025-11-15",
    status: "Finalizado",
    isFederated: true,
  },
  {
    id: 91,
    name: "Master Fin de Año",
    club: "North Padel",
    date: "2025-12-20",
    status: "Finalizado",
    isFederated: true,
  },
  {
    id: 100,
    name: "Torneo de Reyes",
    club: "One Padel",
    date: "2026-01-15",
    status: "Finalizado",
    isFederated: true,
  },
  {
    id: 101,
    name: "Torneo Amor & Amistad",
    club: "Nona Pepa",
    date: "2026-02-14",
    status: "Inscripciones",
    isFederated: true,
  },
];

const INITIAL_RESULTS = [
  {
    id: 1,
    tournamentId: 90,
    playerId: "CUC-M-01",
    category: "3ra",
    round: "campeon",
    points: 1000,
    date: "2025-11-15",
  },
  {
    id: 2,
    tournamentId: 90,
    playerId: "CUC-M-02",
    category: "3ra",
    round: "finalista",
    points: 600,
    date: "2025-11-15",
  },
  {
    id: 3,
    tournamentId: 91,
    playerId: "CUC-X-01",
    category: "A",
    round: "campeon",
    points: 1000,
    date: "2025-12-20",
  },
  {
    id: 4,
    tournamentId: 91,
    playerId: "CUC-X-02",
    category: "A",
    round: "campeon",
    points: 1000,
    date: "2025-12-20",
  },
  {
    id: 5,
    tournamentId: 91,
    playerId: "CUC-X-03",
    category: "B",
    round: "finalista",
    points: 300,
    date: "2025-12-20",
  },
];

const CircuitoPadelCucutaApp = () => {
  // --- ESTADOS ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("ranking");

  // --- DATOS ---
  const [players, setPlayers] = useState(
    INITIAL_PLAYERS.map((p) => ({ ...p, points: 0 }))
  );
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);

  // --- UI STATES ---
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null);

  // FILTROS
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("Masculina");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  // ADMIN TOOLS
  const [calculatorPlayers, setCalculatorPlayers] = useState({
    p1: "",
    p2: "",
  });
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [resultForm, setResultForm] = useState({
    playerId: "",
    round: "grupos",
  });
  const [newPlayerForm, setNewPlayerForm] = useState({
    name: "",
    division: "Masculina",
    category: "6ta",
    club: "",
    active: true,
  });
  const [newTournamentForm, setNewTournamentForm] = useState({
    name: "",
    club: "",
    date: "",
    isFederated: true,
  });

  // --- ENGINE ---
  useEffect(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const updatedPlayers = players.map((p) => {
      const activeResults = results.filter((r) => {
        const tDate = new Date(r.date);
        const tournament = tournaments.find((t) => t.id === r.tournamentId);
        return (
          r.playerId === p.id &&
          tDate >= oneYearAgo &&
          (tournament ? tournament.isFederated : true)
        );
      });
      const totalPoints = activeResults.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      return { ...p, points: totalPoints };
    });

    if (
      JSON.stringify(players.map((p) => p.points)) !==
      JSON.stringify(updatedPlayers.map((p) => p.points))
    ) {
      setPlayers(updatedPlayers);
    }
  }, [results, tournaments]);

  const clubRanking = useMemo(() => {
    return INITIAL_CLUBS.map((clubName) => {
      const clubPlayers = players.filter(
        (p) => p.club === clubName && p.active
      );
      const totalPoints = clubPlayers.reduce(
        (acc, curr) => acc + curr.points,
        0
      );
      return {
        name: clubName,
        points: totalPoints,
        count: clubPlayers.length,
        mvp: clubPlayers.sort((a, b) => b.points - a.points)[0],
      };
    }).sort((a, b) => b.points - a.points);
  }, [players]);

  const getCategoriesForDivision = (division) => {
    if (division === "Masculina") return ["3ra", "4ta", "5ta", "6ta"];
    return ["A", "B", "C", "D"];
  };

  // --- HANDLERS ---
  const handleLogin = () => {
    setIsAdmin(true);
    setActiveTab("admin_players");
  };
  const handleLogout = () => {
    setIsAdmin(false);
    setActiveTab("ranking");
  };
  const generateID = (division) => {
    const prefix =
      division === "Masculina" ? "M" : division === "Femenina" ? "F" : "X";
    return `CUC-${prefix}-${(players.length + 1).toString().padStart(2, "0")}`;
  };

  const handleCreatePlayer = (e) => {
    e.preventDefault();
    if (!newPlayerForm.club) {
      alert("Seleccione Club");
      return;
    }
    const newID = generateID(newPlayerForm.division);
    setPlayers([...players, { id: newID, ...newPlayerForm, points: 0 }]);
    alert(`Jugador Creado: ${newID}`);
  };

  const handleCreateTournament = (e) => {
    e.preventDefault();
    setTournaments([
      ...tournaments,
      { id: Date.now(), ...newTournamentForm, status: "Próximamente" },
    ]);
    setNewTournamentForm({ name: "", club: "", date: "", isFederated: true });
    alert("Torneo creado exitosamente");
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    if (!selectedTournament || !resultForm.playerId) return;
    const p = players.find((player) => player.id === resultForm.playerId);

    if (!p.active) {
      if (!window.confirm(`⚠️ ${p.name} está INACTIVO. ¿Desea cargar puntos?`))
        return;
    }

    const points = selectedTournament.isFederated
      ? CONFIG.points[p.category][resultForm.round]
      : 0;
    setResults([
      ...results,
      {
        id: Date.now(),
        tournamentId: selectedTournament.id,
        playerId: p.id,
        category: p.category,
        round: resultForm.round,
        points,
        date: selectedTournament.date,
      },
    ]);
    alert("Resultado guardado");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setPlayers(
      players.map((p) =>
        p.id === editingPlayer.id
          ? {
              ...p,
              name: fd.get("name"),
              category: fd.get("category"),
              division: fd.get("division"),
              club: fd.get("club"),
              active: fd.get("active") === "on",
            }
          : p
      )
    );
    setEditingPlayer(null);
  };

  // --- VISTA LOGIN ---
  if (activeTab === "login") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center shadow-2xl border-t-4 border-blue-600">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2 text-slate-800 uppercase">
            Federación Cúcuta
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            Acceso Administrativo Seguro
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition"
          >
            Ingresar
          </button>
          <button
            onClick={() => setActiveTab("ranking")}
            className="mt-4 text-slate-400 hover:text-slate-600 text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside
        className={`w-full md:w-64 flex-shrink-0 flex flex-col ${
          isAdmin
            ? "bg-slate-900 text-white"
            : "bg-white border-r border-slate-200 shadow-sm"
        }`}
      >
        <div className="p-6">
          <h1 className="font-black text-xl flex items-center gap-2 leading-tight">
            <Trophy className={isAdmin ? "text-yellow-400" : "text-blue-600"} />
            <div>
              CIRCUITO <br />
              <span className="text-sm font-medium opacity-80">
                CÚCUTA 2026
              </span>
            </div>
          </h1>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <p className="px-4 py-2 text-[10px] font-bold uppercase opacity-50">
            Menú Principal
          </p>
          <MenuBtn
            id="ranking"
            icon={Users}
            label="Ranking Oficial"
            active={activeTab}
            set={setActiveTab}
            admin={isAdmin}
          />
          <MenuBtn
            id="clubs"
            icon={Building2}
            label="Copa de Clubes"
            active={activeTab}
            set={setActiveTab}
            admin={isAdmin}
          />
          <MenuBtn
            id="calendar"
            icon={Calendar}
            label="Calendario"
            active={activeTab}
            set={setActiveTab}
            admin={isAdmin}
          />

          {isAdmin && (
            <>
              <p className="px-4 py-2 mt-4 text-[10px] font-bold uppercase opacity-50 text-yellow-500">
                Gestión
              </p>
              <MenuBtn
                id="admin_players"
                icon={CreditCard}
                label="Fichas y Pagos"
                active={activeTab}
                set={setActiveTab}
                admin={isAdmin}
              />
              <MenuBtn
                id="admin_tournaments"
                icon={Calendar}
                label="Crear Torneo"
                active={activeTab}
                set={setActiveTab}
                admin={isAdmin}
              />
              <MenuBtn
                id="admin_results"
                icon={Save}
                label="Cargar Resultados"
                active={activeTab}
                set={setActiveTab}
                admin={isAdmin}
              />
              <MenuBtn
                id="admin_calculator"
                icon={Calculator}
                label="Calculadora Parejas"
                active={activeTab}
                set={setActiveTab}
                admin={isAdmin}
              />
            </>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-700/10">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 w-full text-red-300 hover:text-red-400"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("login")}
              className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 w-full text-slate-500 hover:text-blue-600"
            >
              <Lock size={16} /> Soy Organizador
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative bg-slate-50">
        {/* MODAL EDITAR */}
        {editingPlayer && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h3 className="text-xl font-bold">Editar Ficha</h3>
                <button onClick={() => setEditingPlayer(null)}>
                  <X size={24} className="text-slate-400 hover:text-red-500" />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="bg-slate-100 p-2 rounded text-center font-mono font-bold text-slate-600">
                  {editingPlayer.id}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Nombre
                  </label>
                  <input
                    name="name"
                    defaultValue={editingPlayer.name}
                    className="w-full p-2 border rounded font-medium"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      División
                    </label>
                    <select
                      name="division"
                      defaultValue={editingPlayer.division}
                      className="w-full p-2 border rounded bg-white"
                    >
                      <option value="Masculina">Masculina</option>
                      <option value="Femenina">Femenina</option>
                      <option value="Mixta">Mixta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Categoría
                    </label>
                    <select
                      name="category"
                      defaultValue={editingPlayer.category}
                      className="w-full p-2 border rounded bg-white"
                    >
                      {Object.keys(CONFIG.points).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Club
                  </label>
                  <select
                    name="club"
                    defaultValue={editingPlayer.club}
                    className="w-full p-2 border rounded bg-white"
                  >
                    {INITIAL_CLUBS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={`flex items-center gap-3 p-3 border rounded ${
                    editingPlayer.active
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingPlayer.active}
                    className="w-5 h-5 rounded"
                  />
                  <div>
                    <div className="font-bold text-sm">Estado Pago</div>
                    <div className="text-xs text-slate-500">Check = Activo</div>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded shadow mt-2">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 1. RANKING */}
        {activeTab === "ranking" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-slate-900 uppercase">
                Ranking Cúcuta
              </h2>
              <p className="text-slate-500 text-sm">
                Sistema Individual (52 Semanas)
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Rama
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {["Masculina", "Femenina", "Mixta"].map((div) => (
                    <button
                      key={div}
                      onClick={() => {
                        setDivisionFilter(div);
                        setCategoryFilter("Todas");
                      }}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
                        divisionFilter === div
                          ? "bg-white text-blue-600 shadow"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Categoría
                </label>
                <select
                  className="w-full p-2.5 border rounded-lg bg-white font-bold text-slate-700 outline-none"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="Todas">Todas</option>
                  {getCategoriesForDivision(divisionFilter).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                  Jugador
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-8 p-2.5 border rounded-lg text-sm outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4 w-16 text-center">#</th>
                    <th className="p-4">Jugador</th>
                    <th className="p-4 text-center hidden sm:table-cell">
                      Club
                    </th>
                    <th className="p-4 text-center">Cat.</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {players
                    .filter(
                      (p) =>
                        p.division === divisionFilter &&
                        (categoryFilter === "Todas" ||
                          p.category === categoryFilter) &&
                        p.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .sort((a, b) => b.points - a.points)
                    .map((p, i) => (
                      <tr
                        key={p.id}
                        className={`hover:bg-blue-50/30 transition-colors ${
                          !p.active ? "bg-red-50/50" : ""
                        }`}
                      >
                        <td className="p-4 text-center font-bold text-slate-400 text-xl">
                          {i + 1}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800 text-lg">
                            {p.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {p.id}
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm text-slate-600 hidden sm:table-cell">
                          {p.club}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-white border px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {p.active ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold border border-green-200 inline-flex items-center gap-1">
                              <CheckCircle size={10} /> ACTIVO
                            </span>
                          ) : (
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold border border-red-200 inline-flex items-center gap-1">
                              <AlertTriangle size={10} /> MORA
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right font-black text-2xl text-blue-600">
                          {p.points}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. COPA CLUBES */}
        {activeTab === "clubs" && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                  <Trophy className="text-yellow-400" /> Copa de Clubes
                </h2>
                <p className="text-blue-100 text-sm">
                  Puntos totales acumulados.
                </p>
              </div>
              <Building2 size={48} className="text-white opacity-30" />
            </div>
            <div className="grid gap-3">
              {clubRanking
                .filter((c) => c.points > 0)
                .map((club, index) => (
                  <div
                    key={club.name}
                    className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 relative overflow-hidden"
                  >
                    <div
                      className={`font-black text-3xl w-10 text-center ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-slate-400"
                          : index === 2
                          ? "text-orange-400"
                          : "text-slate-200"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 z-10">
                      <h3 className="font-bold text-lg text-slate-800">
                        {club.name}
                      </h3>
                      {club.mvp && (
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          MVP:{" "}
                          <span className="text-blue-600 font-bold">
                            {club.mvp.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right z-10">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Puntos
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {club.points.toLocaleString()}
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-blue-600"
                      style={{
                        width: `${
                          (club.points / clubRanking[0].points) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 3. CALENDARIO */}
        {activeTab === "calendar" && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-black mb-6 text-slate-900 uppercase">
              Calendario 2026
            </h2>
            <div className="grid gap-4">
              {tournaments
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center group hover:border-blue-400 transition"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`p-4 rounded-xl text-center min-w-[80px] ${
                          t.isFederated
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <div className="text-xs uppercase font-bold opacity-80">
                          {new Date(t.date).toLocaleString("es", {
                            month: "short",
                          })}
                        </div>
                        <div className="text-2xl font-black">
                          {new Date(t.date).getDate() + 1}
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                            <MapPin size={12} /> {t.club}
                          </span>
                          {t.isFederated ? (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 rounded font-bold border border-green-200">
                              OFICIAL
                            </span>
                          ) : (
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 rounded font-bold border border-orange-200">
                              SOCIAL
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">
                          {t.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                          {t.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 4. ADMIN: PLAYERS */}
        {isAdmin && activeTab === "admin_players" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                <CreditCard size={20} className="text-green-600" /> Alta de
                Jugador
              </h3>
              <form
                onSubmit={handleCreatePlayer}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <input
                  value={newPlayerForm.name}
                  onChange={(e) =>
                    setNewPlayerForm({ ...newPlayerForm, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded outline-none"
                  placeholder="Nombre Completo"
                  required
                />
                <select
                  value={newPlayerForm.division}
                  onChange={(e) =>
                    setNewPlayerForm({
                      ...newPlayerForm,
                      division: e.target.value,
                    })
                  }
                  className="w-full md:w-32 p-2 border rounded bg-white outline-none"
                >
                  <option value="Masculina">Masculina</option>
                  <option value="Femenina">Femenina</option>
                  <option value="Mixta">Mixta</option>
                </select>
                <select
                  value={newPlayerForm.category}
                  onChange={(e) =>
                    setNewPlayerForm({
                      ...newPlayerForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full md:w-32 p-2 border rounded bg-white outline-none"
                >
                  {getCategoriesForDivision(newPlayerForm.division).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={newPlayerForm.club}
                  onChange={(e) =>
                    setNewPlayerForm({ ...newPlayerForm, club: e.target.value })
                  }
                  className="w-full md:w-48 p-2 border rounded bg-white outline-none"
                >
                  <option value="">Club...</option>
                  {INITIAL_CLUBS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow w-full md:w-auto">
                  Crear
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-slate-700">
                  Base de Datos ({players.length})
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-9 p-2 border rounded text-sm w-48 outline-none"
                    onChange={(e) =>
                      setSearchQuery(e.target.value.toLowerCase())
                    }
                  />
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Div</th>
                    <th className="p-3 text-center">Cat.</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {players
                    .filter((p) => p.name.toLowerCase().includes(searchQuery))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400 text-xs">
                          {p.id}
                        </td>
                        <td className="p-3 font-bold text-slate-700">
                          {p.name}
                        </td>
                        <td className="p-3 text-xs">{p.division}</td>
                        <td className="p-3 text-center">{p.category}</td>
                        <td className="p-3 text-center">
                          {p.active ? (
                            <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-0.5 rounded">
                              OK
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-0.5 rounded">
                              MORA
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right flex justify-end gap-2">
                          <button
                            onClick={() => setViewingHistory(p)}
                            className="p-1.5 bg-slate-100 rounded hover:bg-blue-100 text-slate-500"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            onClick={() => setEditingPlayer(p)}
                            className="px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border bg-white text-slate-600 hover:text-blue-600 hover:border-blue-600"
                          >
                            <Edit size={12} /> EDITAR
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ADMIN: CREAR TORNEO (RESTAURADO) */}
        {isAdmin && activeTab === "admin_tournaments" && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                <Calendar className="text-blue-600" /> Crear Nuevo Torneo
              </h3>
              <form onSubmit={handleCreateTournament} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Nombre
                  </label>
                  <input
                    value={newTournamentForm.name}
                    onChange={(e) =>
                      setNewTournamentForm({
                        ...newTournamentForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg bg-slate-50 outline-none"
                    placeholder="Ej: Master 2026"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      Sede
                    </label>
                    <select
                      value={newTournamentForm.club}
                      onChange={(e) =>
                        setNewTournamentForm({
                          ...newTournamentForm,
                          club: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg bg-white outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {INITIAL_CLUBS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={newTournamentForm.date}
                      onChange={(e) =>
                        setNewTournamentForm({
                          ...newTournamentForm,
                          date: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-lg bg-white outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                  <input
                    type="checkbox"
                    checked={newTournamentForm.isFederated}
                    onChange={(e) =>
                      setNewTournamentForm({
                        ...newTournamentForm,
                        isFederated: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-blue-600 rounded"
                  />
                  <div className="font-bold text-slate-800">
                    Torneo Federado (Suma Puntos)
                  </div>
                </div>
                <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 shadow-xl">
                  Publicar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. ADMIN: CARGAR RESULTADOS (RESTAURADO) */}
        {isAdmin && activeTab === "admin_results" && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Save className="text-blue-600" /> Cargar Puntos
            </h2>
            {!selectedTournament ? (
              <div className="space-y-4">
                <p className="text-slate-500 text-sm font-bold uppercase">
                  Selecciona torneo:
                </p>
                {tournaments.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTournament(t)}
                    className="w-full bg-white p-5 rounded-xl shadow-sm border hover:border-blue-500 flex justify-between items-center text-left group"
                  >
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-blue-600">
                        {t.name}
                      </h3>
                      <p className="text-sm text-slate-400">{t.date}</p>
                    </div>
                    <Search className="text-slate-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedTournament.name}
                    </h3>
                    <p className="text-sm text-slate-500">Cargando puntos</p>
                  </div>
                  <button
                    onClick={() => setSelectedTournament(null)}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase"
                  >
                    Cambiar
                  </button>
                </div>
                <form onSubmit={handleAddResult} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
                      Jugador
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg bg-slate-50 outline-none"
                      onChange={(e) =>
                        setResultForm({
                          ...resultForm,
                          playerId: e.target.value,
                        })
                      }
                    >
                      <option value="">Buscar jugador...</option>
                      {players
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.division})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
                      Instancia
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-1">
                      {[
                        "campeon",
                        "finalista",
                        "semi",
                        "cuartos",
                        "grupos",
                      ].map((r) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() =>
                            setResultForm({ ...resultForm, round: r })
                          }
                          className={`p-3 rounded-lg border text-xs capitalize font-bold transition-all ${
                            resultForm.round === r
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700">
                    Confirmar
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 7. ADMIN: CALCULADORA (NUEVO) */}
        {isAdmin && activeTab === "admin_calculator" && (
          <div className="max-w-xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
              <h2 className="text-2xl font-black mb-6 flex items-center justify-center gap-2 text-slate-800">
                <Calculator className="text-blue-600" /> Calculadora de Pareja
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Selecciona dos jugadores para ver su puntaje combinado.
              </p>
              <div className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Jugador 1
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg bg-slate-50"
                    onChange={(e) =>
                      setCalculatorPlayers({
                        ...calculatorPlayers,
                        p1: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar...</option>
                    {players
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.points} pts)
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex justify-center">
                  <Plus className="text-slate-300" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Jugador 2
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg bg-slate-50"
                    onChange={(e) =>
                      setCalculatorPlayers({
                        ...calculatorPlayers,
                        p2: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar...</option>
                    {players
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.points} pts)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {calculatorPlayers.p1 && calculatorPlayers.p2 && (
                <div className="mt-8 bg-blue-600 text-white p-6 rounded-xl animate-in zoom-in duration-300">
                  <div className="text-sm font-bold opacity-80 uppercase">
                    Puntos Totales
                  </div>
                  <div className="text-5xl font-black mt-2">
                    {(players.find((p) => p.id === calculatorPlayers.p1)
                      ?.points || 0) +
                      (players.find((p) => p.id === calculatorPlayers.p2)
                        ?.points || 0)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MenuBtn = ({ id, icon: Icon, label, active, set, admin }) => (
  <button
    onClick={() => set(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active === id
        ? admin
          ? "bg-slate-800 text-white shadow-lg"
          : "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
        : "text-slate-500 hover:bg-slate-100"
    }`}
  >
    <Icon
      size={18}
      className={active === id && !admin ? "text-blue-600" : ""}
    />{" "}
    {label}
  </button>
);

export default CircuitoPadelCucutaApp;
