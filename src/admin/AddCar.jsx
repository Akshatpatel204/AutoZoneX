import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Info,
  Settings,
  Star,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

/* -------------------- INITIAL STATE -------------------- */

const initialState = {
  Name: "",
  Engine: "",
  Speed: "",
  FuelType: "",
  MaxEngineTorque: "",
  brand: "",
  images: ["", "", "", ""],
  price: "",
  knowMore: "",
  Horsepower: "",
  mph: "",
  speed_mark: 8,
  comfort_mark: 6,
  safety_mark: 4,
};

/* -------------------- REDUCER -------------------- */

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_IMAGE":
      const imgs = [...state.images];
      imgs[action.index] = action.value;
      return { ...state, images: imgs };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

/* -------------------- ALERT MODAL -------------------- */

const AlertModal = ({ status, message, onClose }) => {
  const isSuccess = status >= 200 && status < 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[92%] max-w-md bg-[#101c22] border border-[#223c49]
                      rounded-xl shadow-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <span
            className={`text-sm font-bold ${
              isSuccess ? "text-green-400" : "text-red-400"
            }`}
          >
            Status : {status}
          </span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-300 text-sm">{message}</p>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-semibold ${
              isSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------- MAIN COMPONENT -------------------- */

const AddCar = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [alert, setAlert] = useState(null);

  const isValid = () => {
    for (let key in state) {
      if (Array.isArray(state[key])) {
        if (state[key].some((v) => v.trim() === "")) return false;
      } else if (state[key] === "") {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      setAlert({
        status: 400,
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_backendapi}/add_car_detail`,
        state
      );

      setAlert({
        status: res.status,
        message: res.data.message,
      });

      if (res.status === 201) {
        dispatch({ type: "RESET" });
      }
    } catch (err) {
      setAlert({
        status: err.response?.status || 500,
        message: err.response?.data?.error || "Server error",
      });
    }
  };

  return (
    <>
      {alert && (
        <AlertModal
          status={alert.status}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="max-w-5xl mx-auto w-full text-white">
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">

          <Section title="Basic Info" icon={<Info size={22} />}>
            <Grid>
              <Input label="Vehicle Name" placeholder="Model S Plaid"
                value={state.Name}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "Name", value: e.target.value })
                }
              />
              <Select label="Brand" value={state.brand}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "brand", value: e.target.value })
                }
                options={["Tesla", "BMW", "Ferrari", "Porsche"]}
              />
              <Input label="Price" placeholder="120000"
                value={state.price}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "price", value: e.target.value })
                }
              />
              <Input label="Know More URL" placeholder="https://example.com"
                value={state.knowMore}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "knowMore", value: e.target.value })
                }
              />
            </Grid>
          </Section>

          <Section title="Technical Specs" icon={<Settings size={22} />}>
            <Grid cols="md:grid-cols-3">
              <Input label="Engine" placeholder="V8 / Electric"
                value={state.Engine}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "Engine", value: e.target.value })
                }
              />
              <Input label="Max Speed" placeholder="320 km/h"
                value={state.Speed}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "Speed", value: e.target.value })
                }
              />
              <Select label="Fuel Type" value={state.FuelType}
                onChange={(e) =>
                  dispatch({ type: "SET_FIELD", field: "FuelType", value: e.target.value })
                }
                options={["Petrol", "Diesel", "Electric", "Hybrid"]}
              />
            </Grid>
          </Section>

          <Section title="Ratings" icon={<Star size={22} />}>
            <Slider label="Speed" value={state.speed_mark}
              onChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "speed_mark", value: v })
              }
            />
            <Slider label="Comfort" value={state.comfort_mark}
              onChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "comfort_mark", value: v })
              }
            />
            <Slider label="Safety" value={state.safety_mark}
              onChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "safety_mark", value: v })
              }
            />
          </Section>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-6 py-3 border border-[#223c49] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#0da6f2] rounded-lg flex items-center gap-2"
            >
              <PlusCircle size={18} /> Submit
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

/* -------------------- HELPERS -------------------- */

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

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-[#101c22] border border-[#223c49] rounded-lg p-2.5 text-white
                 placeholder:text-slate-600 outline-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#101c22] border border-[#223c49]
                   rounded-lg p-2.5 appearance-none"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  </div>
);

const Slider = ({ label, value, onChange }) => (
  <div>
    <div className="flex justify-between mb-2">
      <span>{label}</span>
      <span className="text-[#0da6f2] font-bold">{value}</span>
    </div>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full accent-[#0da6f2]"
    />
  </div>
);

export default AddCar;
