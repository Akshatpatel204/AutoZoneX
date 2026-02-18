import React, { useReducer, useState, useEffect, useMemo } from "react";
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
  const [brandLoading, setBrandLoading] = useState(false); // ✅ New state for brand save loader
  const [modal, setModal] = useState(null);
  
  const [dbBrands, setDbBrands] = useState([]);
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  const API_BASE = import.meta.env.VITE_backendapi;

  /* ---------------- FORMATTING HELPERS ---------------- */
  const formatBrandName = (str) => {
    if (!str) return "";
    let fixedStr = str.toLowerCase() === "rolls-royce" || str.toLowerCase() === "rolls royals" 
      ? "rolls royce" 
      : str;
    
    return fixedStr
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  /* ---------------- FETCH BRANDS ---------------- */
  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_brands`);
      setDbBrands(res.data.map(b => b.name));
    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  /* ---------------- ADD NEW BRAND ---------------- */
const handleAddBrand = async () => {
  if (!newBrandName) return;
  setBrandLoading(true); 
  try {
    const formatted = formatBrandName(newBrandName);
    
    // ✅ Change this line to use "name" to match your server's single-add logic
    await axios.post(`${API_BASE}/add_brand`, { name: formatted });
    
    await fetchBrands(); 
    dispatch({ type: "SET", field: "brand", value: formatted });
    setShowBrandInput(false);
    setNewBrandName("");
  } catch (err) {
    // This will now catch the "Brand already exists" error correctly
    alert(err.response?.data?.error || "Error adding brand");
  } finally {
    setBrandLoading(false);
  }
};

  const brandOptions = useMemo(() => {
    return dbBrands
      .map(b => formatBrandName(b))
      .sort((a, b) => a.localeCompare(b));
  }, [dbBrands]);

  /* ---------------- VALIDATION & SUBMIT ---------------- */
  const isValid = () => {
    for (let key in state) {
      if (["intImg", "frontImg", "rearImg"].includes(key)) continue;
      if (!state[key]) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setModal({ status: 400, message: "Please fill all required fields." });
      return;
    }
    setLoading(true);

    const payload = {
      ...state,
      images: [state.mainImg, state.intImg, state.frontImg, state.rearImg].filter(Boolean)
    };

    try {
      const res = await axios.post(`${API_BASE}/add_car_detail`, payload);
      setModal({ status: res.status, message: res.data.message || "Vehicle added successfully" });
      if (res.status === 201) dispatch({ type: "RESET" });
    } catch (err) {
      setModal({ status: err.response?.status || 500, message: err.response?.data?.error || "Server error" });
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = modal?.status >= 200 && modal?.status < 300;

  return (
    <>
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

      <div className="max-w-5xl mx-auto text-white p-2">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          
          <Section title="Basic Info" icon={<Info className="mb-2" />}>
            <Grid>
              <Input label="Vehicle Name" name="Name" state={state} dispatch={dispatch} placeholder="e.g. Model S Plaid" />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">Brand</label>
                {!showBrandInput ? (
                  <div className="flex gap-2">
                    <select
                      value={state.brand}
                      onChange={(e) => {
                        if (e.target.value === "ADD_NEW") setShowBrandInput(true);
                        else dispatch({ type: "SET", field: "brand", value: e.target.value });
                      }}
                      className="flex-1 bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2] cursor-pointer appearance-none transition-all"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230da6f2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                    >
                      <option value="" className="bg-[#101c22]">Select Brand</option>
                      <option value="ADD_NEW" className="bg-[#101c22] text-[#0da6f2] font-bold">+ Add New Brand</option>
                      {brandOptions.map((o) => (
                        <option key={o} value={o} className="bg-[#101c22]">{o}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2]"
                      placeholder="Enter brand name..."
                      disabled={brandLoading}
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddBrand} 
                      disabled={brandLoading || !newBrandName}
                      className="bg-[#0da6f2] px-4 rounded-lg text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center min-w-[70px]"
                    >
                      {brandLoading ? <Loader2 size={16} className="animate-spin" /> : "SAVE"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowBrandInput(false)} 
                      disabled={brandLoading}
                      className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>

              <Input label="Price ($)" name="price" state={state} dispatch={dispatch} placeholder="0.00" />
              <Input label="Know More URL" name="knowMore" state={state} dispatch={dispatch} placeholder="https://..." />
            </Grid>
          </Section>

          {/* ... Rest of the sections remain same ... */}
          <Section title="Technical Specs" icon={<Settings className="mb-2" />}>
            <Grid cols="md:grid-cols-3">
              <Input label="Engine Type" name="Engine" state={state} dispatch={dispatch} placeholder="V8, Electric..." />
              <Input label="Max Speed (MPH)" name="Speed" state={state} dispatch={dispatch} placeholder="200" />
              <Select
                label="Fuel Type"
                value={state.FuelType}
                onChange={(e) => dispatch({ type: "SET", field: "FuelType", value: e.target.value })}
                options={["Gasoline", "Electric", "Hybrid", "Petrol" , "Diesel"]}
              />
              <Input label="Max Torque (lb-ft)" name="MaxEngineTorque" state={state} dispatch={dispatch} placeholder="750" />
              <Input label="Horsepower" name="Horsepower" state={state} dispatch={dispatch} placeholder="1020" />
              <Input label="0-60 MPH (sec)" name="mph" state={state} dispatch={dispatch} placeholder="1.99" />
              <Input label="Transmission" name="Transmission" state={state} dispatch={dispatch} placeholder="7-Speed DCT" />
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
              <Input label="Rear Brakes" name="RearBrakes" state={state} dispatch={dispatch} placeholder="Hydraulic" />
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
            <button 
              type="button" 
              onClick={() => dispatch({ type: "RESET" })} 
              className="px-6 py-3 rounded-xl border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 transition-all flex items-center gap-2 font-bold"
            >
              <RotateCcw size={18} /> Reset Details
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-[#0da6f2] rounded-xl font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
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

/* --- SHARED COMPONENTS --- */
const Section = ({ title, icon, children }) => (
  <section className="bg-[#1a2b34]/30 border border-[#223c49] rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-6 text-[#0da6f2]"> {icon} <h2 className="text-lg font-bold">{title}</h2> </div>
    {children}
  </section>
);

const Grid = ({ children, cols = "md:grid-cols-2" }) => ( <div className={`grid grid-cols-1 ${cols} gap-x-6 gap-y-4`}>{children}</div> );

const Input = ({ label, name, state, dispatch, placeholder, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium">{label}</label>
    <input 
      disabled={disabled}
      value={state[name]} 
      onChange={(e) => dispatch({ type: "SET", field: name, value: e.target.value })} 
      placeholder={placeholder} 
      className="bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2] transition-colors disabled:opacity-50" 
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium">{label}</label>
    <div className="relative">
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full bg-[#101c22]/50 border border-[#223c49] rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#0da6f2] cursor-pointer appearance-none transition-all" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230da6f2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
      >
        <option value="" className="bg-[#101c22]">Select Option</option>
        {options.map((o) => ( <option key={o} value={o} className="bg-[#101c22]">{o}</option> ))}
      </select>
    </div>
  </div>
);

const Slider = ({ label, name, value, dispatch }) => (
  <div className="mb-6 relative">
    <div className="flex justify-between mb-2"> <span className="text-xs text-slate-400 font-medium uppercase">{label}</span> <span className="text-[#0da6f2] text-xs font-bold">{value}</span> </div>
    <input type="range" min="1" max="10" value={value} onChange={(e) => dispatch({ type: "SET", field: name, value: e.target.value })} className="w-full accent-[#0da6f2] cursor-pointer h-1.5 bg-[#101c22] rounded-lg appearance-none" />
  </div>
);

export default AddCar;


