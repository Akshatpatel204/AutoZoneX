import { Trash } from 'lucide-react';


const Card = (props) => {
    return (
        <>
            <div className="bg-card-dark lg:w-120 rounded-2xl border border-black overflow-hidden p-5 h-90">
                <div className="flex items-center justify-between ">
                    <div>
                        <h3 className="text-2xl font-bold mt-1 mb-3">Ferrari 296 GTB</h3>
                    </div>
                    <button><Trash className='hover:bg-red-500 mb-3' /></button>
                </div>
                <div className="space-y-6 mt-2">
                    <div className="flex flex-col gap-2 mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 uppercase tracking-wider font-bold">Speed</span>
                            <span className="text-white font-black">9.9/10</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[99%] shadow-[0_0_10px_#256af4]"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 uppercase tracking-wider font-bold">Comfort</span>
                            <span className="text-white font-black">8.1/10</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[81%] opacity-80"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400 uppercase tracking-wider font-bold">Safety</span>
                            <span className="text-white font-black">7.5/10</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%] opacity-90"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4   border-t border-white/5 py-4">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Horsepower
                        </p>
                        <p className="text-xl font-bold">818 hp</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">0-60 MPH</p>
                        <p className="text-xl font-bold">2.9s</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Base Price
                        </p>
                        <p className="text-xl font-bold text-primary">$338k</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
