import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Info,
  Settings,
  Zap,
  Star,
  Image as ImageIcon,
  PlusCircle,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
  Name: "",
  Engine: "",
  Speed: "",
  FuelType: "Gasoline",
  MaxEngineTorque: "",
  FrontBrakes: "",
  RearBrakes: "",
  Transmission: "",
  Drivetrain: "",
  brand: "",
  price: "",
  knowMore: "",
  Horsepower: "",
  mph: "",
  mainImg: "",
  intImg: "",
  frontImg: "",
  rearImg: "",
  speed_mark: "8",
  comfort_mark: "6",
  safety_mark: "4",
};

/* ---------------- REDUCER ---------------- */
function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const AddCar = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  /* ---------------- VALIDATION ---------------- */
  const isValid = () => {
    for (let key in state) {
      if (["intImg", "frontImg", "rearImg"].includes(key)) continue;
      if (!state[key]) return false;
    }
    return true;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      setModal({
        status: 400,
        message: "Please fill all required fields.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...state,
      images: [
        state.mainImg,
        state.intImg,
        state.frontImg,
        state.rearImg,
      ].filter(Boolean),
      u_id: "ADMIN_01",
      u_Name: "AutoZoneX_Admin",
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_backendapi}/add_car_detail`,
        payload
      );

      setModal({
        status: res.status,
        message: res.data.message || "Vehicle added successfully",
      });

      if (res.status === 201) dispatch({ type: "RESET" });
    } catch (err) {
      setModal({
        status: err.response?.status || 500,
        message: err.response?.data?.error || "Server error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = modal?.status >= 200 && modal?.status < 300;

  return (
    <>
      {/* ---------------- MODAL ---------------- */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#101c22] border border-[#223c49] rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#223c49]">
              <span className={`text-sm font-bold ${isSuccess ? "text-green-400" : "text-red-400"}`}>
                STATUS : {modal.status}
              </span>
              <button onClick={() => setModal(null)}><XCircle className="text-slate-500 hover:text-white" /></button>
            </div>
            <div className="p-6 text-center">
              {isSuccess ? <CheckCircle2 className="mx-auto text-green-400 mb-4" size={56} /> : <AlertCircle className="mx-auto text-red-400 mb-4" size={56} />}
              <p className="text-slate-300 text-sm mb-6">{modal.message}</p>
              <button
                onClick={() => (isSuccess ? navigate("/admin") : setModal(null))}
                className={`w-full py-3 rounded-xl font-bold ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
              >
                {isSuccess ? "Go to Dashboard" : "Fix Errors"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FORM ---------------- */}
      <div className="max-w-5xl mx-auto text-white p-2">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          
          <Section title="Basic Info" icon={<Info className="mb-2" />}>
            <Grid>
              <Input label="Vehicle Name" name="Name" state={state} dispatch={dispatch} placeholder="e.g. Model S Plaid" />
              <Select
                label="Brand"
                value={state.brand}
                onChange={(e) => dispatch({ type: "SET", field: "brand", value: e.target.value })}
                options={["Aston Martin", "Audi", "Bentley", "BMW", "Ferrari", "Lamborghini", "Lexus", "Maserati", "McLaren", "Mercedes", "Pagani", "Porsche", "Tesla"]}
              />
              <Input label="Price ($)" name="price" state={state} dispatch={dispatch} placeholder="0.00" />
              <Input label="Know More URL" name="knowMore" state={state} dispatch={dispatch} placeholder="https://..." />
            </Grid>
          </Section>

          <Section title="Technical Specs" icon={<Settings className="mb-2" />}>
            <Grid cols="md:grid-cols-3">
              <Input label="Engine Type" name="Engine" state={state} dispatch={dispatch} placeholder="V8, Electric, Hybrid..." />
              <Input label="Max Speed (MPH)" name="Speed" state={state} dispatch={dispatch} placeholder="200" />
              <Select
                label="Fuel Type"
                value={state.FuelType}
                onChange={(e) => dispatch({ type: "SET", field: "FuelType", value: e.target.value })}
                options={["Gasoline", "Electric", "Hybrid", "Petrol"]}
              />
              <Input label="Max Engine Torque (lb-ft)" name="MaxEngineTorque" state={state} dispatch={dispatch} placeholder="750" />
              <Input label="Horsepower" name="Horsepower" state={state} dispatch={dispatch} placeholder="1020" />
              <Input label="0-60 MPH (sec)" name="mph" state={state} dispatch={dispatch} placeholder="1.99" />
              <Select
                label="Transmission"
                value={state.Transmission}
                onChange={(e) => dispatch({ type: "SET", field: "Transmission", value: e.target.value })}
                options={["Automatic", "Manual", "Semi-Automatic", "Dual-Clutch"]}
              />
              <Select
                label="Drivetrain"
                value={state.Drivetrain}
                onChange={(e) => dispatch({ type: "SET", field: "Drivetrain", value: e.target.value })}
                options={["AWD", "RWD", "FWD", "4WD"]}
              />
            </Grid>
          </Section>

          <Section title="Chassis" icon={<Zap className="mb-2" />}>
            <Grid>
              <Input label="Front Brakes" name="FrontBrakes" state={state} dispatch={dispatch} placeholder="Carbon Ceramic" />
              <Input label="Rear Brakes" name="RearBrakes" state={state} dispatch={dispatch} placeholder="Hydraulic Ventilated" />
            </Grid>
          </Section>

          <Section title="Ratings (1-10)" icon={<Star className="mb-2" />}>
            <Slider label="Speed Mark" name="speed_mark" value={state.speed_mark} dispatch={dispatch} />
            <Slider label="Comfort Mark" name="comfort_mark" value={state.comfort_mark} dispatch={dispatch} />
            <Slider label="Safety Mark" name="safety_mark" value={state.safety_mark} dispatch={dispatch} />
          </Section>

          <Section title="Image Assets" icon={<ImageIcon className="mb-2" />}>
            <Grid>
              <Input label="Main Image URL" name="mainImg" state={state} dispatch={dispatch} placeholder="https://..." />
              <Input label="Interior URL" name="intImg" state={state} dispatch={dispatch} placeholder="https://..." />
              <Input label="Front View URL" name="frontImg" state={state} dispatch={dispatch} placeholder="https://..." />
              <Input label="Rear View URL" name="rearImg" state={state} dispatch={dispatch} placeholder="https://..." />
            </Grid>
          </Section>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => dispatch({ type: "RESET" })} className="px-8 py-3 rounded-xl border border-[#223c49] text-white hover:bg-white/5 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-[#0da6f2] rounded-xl font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={18}/>}
              {loading ? "Submitting..." : "Submit Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

/* ---------------- HELPERS ---------------- */
const Section = ({ title, icon, children }) => (
  <section className="bg-[#1a2b34]/30 border border-[#223c49] rounded-xl p-6">
    <div className="flex items-center gap-2 mb-6 text-[#0da6f2]">
      {icon}
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

const Grid = ({ children, cols = "md:grid-cols-2" }) => (
  <div className={`grid grid-cols-1 ${cols} gap-x-6 gap-y-4`}>{children}</div>
);

const Input = ({ label, name, state, dispatch, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium">{label}</label>
    <input
      value={state[name]}
      onChange={(e) => dispatch({ type: "SET", field: name, value: e.target.value })}
      placeholder={placeholder}
      className="bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2] transition-colors"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2] cursor-pointer"
    >
      <option value="" className="bg-[#101c22] text-white">Select Option</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#101c22] text-white">
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Slider = ({ label, name, value, dispatch }) => (
  <div className="mb-6 relative">
    <div className="flex justify-between mb-2">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
      <span className="text-[#0da6f2] text-xs font-bold">{value}</span>
    </div>
    <input
      type="range" min="1" max="10"
      value={value}
      onChange={(e) => dispatch({ type: "SET", field: name, value: e.target.value })}
      className="w-full accent-[#0da6f2] cursor-pointer h-1.5 bg-[#101c22] rounded-lg appearance-none"
    />
  </div>
);


export default AddCar;
