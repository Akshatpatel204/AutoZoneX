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
  FrontBrakes: "", // Added
  RearBrakes: "",  // Added
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
      if (
        ["intImg", "frontImg", "rearImg"].includes(key) // optional
      )
        continue;
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
      Name: state.Name,
      Engine: state.Engine,
      Speed: state.Speed,
      FuelType: state.FuelType,
      MaxEngineTorque: state.MaxEngineTorque,
      FrontBrakes: state.FrontBrakes, // Included in payload
      RearBrakes: state.RearBrakes,   // Included in payload
      brand: state.brand,
      images: [
        state.mainImg,
        state.intImg,
        state.frontImg,
        state.rearImg,
      ].filter(Boolean),
      price: state.price,
      Horsepower: state.Horsepower,
      mph: state.mph,
      speed_mark: state.speed_mark,
      comfort_mark: state.comfort_mark,
      safety_mark: state.safety_mark,
      knowMore: state.knowMore
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#101c22] border border-[#223c49] rounded-2xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-[#223c49]">
              <span
                className={`text-sm font-bold ${
                  isSuccess ? "text-green-400" : "text-red-400"
                }`}
              >
                STATUS : {modal.status}
              </span>
              <button onClick={() => setModal(null)}>
                <XCircle className="text-slate-500 hover:text-white" />
              </button>
            </div>

            <div className="p-6 text-center">
              {isSuccess ? (
                <CheckCircle2 className="mx-auto text-green-400 mb-4" size={56} />
              ) : (
                <AlertCircle className="mx-auto text-red-400 mb-4" size={56} />
              )}

              <p className="text-slate-300 text-sm mb-6">{modal.message}</p>

              <button
                onClick={() =>
                  isSuccess ? navigate("/admin") : setModal(null)
                }
                className={`w-full py-3 rounded-xl font-bold ${
                  isSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isSuccess ? "Go to Dashboard" : "Fix Errors"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FORM ---------------- */}

      <div className="max-w-5xl mx-auto text-white">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <Section title="Basic Info" icon={<Info />}>
            <Grid>
              <Input label="Vehicle Name" name="Name" state={state} dispatch={dispatch} />
              <Select
                label="Brand"
                value={state.brand}
                onChange={(e) =>
                  dispatch({ type: "SET", field: "brand", value: e.target.value })
                }
                options={["Tesla", "BMW", "Ferrari", "Porsche"]}
              />
              <Input label="Price" name="price" state={state} dispatch={dispatch} />
              <Input label="Know More URL" name="knowMore" state={state} dispatch={dispatch} />
            </Grid>
          </Section>

          <Section title="Technical Specs" icon={<Settings />}>
            <Grid cols="md:grid-cols-3">
              <Input label="Engine" name="Engine" state={state} dispatch={dispatch} />
              <Input label="Max Speed" name="Speed" state={state} dispatch={dispatch} />
              <Input label="Torque" name="MaxEngineTorque" state={state} dispatch={dispatch} />
              <Input label="Horsepower" name="Horsepower" state={state} dispatch={dispatch} />
              <Input label="0-60 MPH" name="mph" state={state} dispatch={dispatch} />
              <Select
                label="Fuel Type"
                value={state.FuelType}
                onChange={(e) =>
                  dispatch({ type: "SET", field: "FuelType", value: e.target.value })
                }
                options={["Gasoline", "Electric", "Hybrid", "Petrol"]}
              />
              {/* NEW FIELDS ADDED HERE */}
              <Input label="Front Brakes" name="FrontBrakes" state={state} dispatch={dispatch} />
              <Input label="Rear Brakes" name="RearBrakes" state={state} dispatch={dispatch} />
            </Grid>
          </Section>

          <Section title="Ratings" icon={<Star />}>
            <Slider label="Speed" name="speed_mark" value={state.speed_mark} dispatch={dispatch} />
            <Slider label="Comfort" name="comfort_mark" value={state.comfort_mark} dispatch={dispatch} />
            <Slider label="Safety" name="safety_mark" value={state.safety_mark} dispatch={dispatch} />
          </Section>

          <Section title="Images" icon={<ImageIcon />}>
            <Grid>
              <Input label="Main Image URL" name="mainImg" state={state} dispatch={dispatch} />
              <Input label="Interior Image URL" name="intImg" state={state} dispatch={dispatch} />
              <Input label="Front View URL" name="frontImg" state={state} dispatch={dispatch} />
              <Input label="Rear View URL" name="rearImg" state={state} dispatch={dispatch} />
            </Grid>
          </Section>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET" })}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <RotateCcw size={18} /> Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-[#0da6f2] rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <PlusCircle />}
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
  <section className="bg-[#1a2b34]/50 border border-[#223c49] rounded-xl p-6">
    <div className="flex items-center gap-2 mb-6 text-[#0da6f2]">
      {icon}
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

const Grid = ({ children, cols = "md:grid-cols-2" }) => (
  <div className={`grid grid-cols-1 ${cols} gap-6`}>{children}</div>
);

const Input = ({ label, name, state, dispatch }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <input
      value={state[name]}
      onChange={(e) =>
        dispatch({ type: "SET", field: name, value: e.target.value })
      }
      placeholder={`Enter ${label}`}
      className="bg-[#101c22] border border-[#223c49] rounded-lg p-2.5 text-white outline-none focus:border-[#0da6f2] transition-colors"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="bg-[#101c22] border border-[#223c49] rounded-lg p-2.5 outline-none focus:border-[#0da6f2] transition-colors"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Slider = ({ label, name, value, dispatch }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-slate-400">{label}</span>
      <span className="text-[#0da6f2] font-bold">{value}</span>
    </div>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) =>
        dispatch({ type: "SET", field: name, value: e.target.value })
      }
      className="w-full accent-[#0da6f2]"
    />
  </div>
);

export default AddCar;