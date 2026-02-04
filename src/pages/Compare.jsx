import React from 'react'
import Card from "../component/Card";
import Footer from '../component/Footer';

const Compare = () => {
    return (
        <div className="overflow-hidden bg-black text-white bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCg-e_1wsAbpGbL7XlkBAWDJwHh8ihp8mEEsa1LLLwpcDeHLI3NpQ0ZINIRG1ht15OmuAz1d2XF0zr8IUS787GrpZiWem2tcAcih06zq9XkC-gvxvZerCcWOO2LZl9x3droSHEXZOkbEGdVDugjzXMTbX03Wr0VwA0H6AIMLS-tcnvLaRGsWXJ7QKkkvfo_m7_EFRv4wHe5vlBAOJwPVjqgtvSCpIy0ZXnkEme7Xn2bLP3DAtNybeWir4RCc5CXI3iIXbaC6Sn45s_i')] bg-cover bg-center h-auto">
            <div className="flex items-end justify-between mb-8 px-4 mt-4">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase" >
                        Battle of the <span className="text-primary">Machines</span>
                    </h2>
                    <p className="text-gray-400 mt-2 font-medium">
                        Side-by-side performance data visualization
                    </p>
                </div>

            </div>
            <div className="grid xl:grid-cols-3 2xl:grid-cols-3 lg:grid-cols-2  sm:grid-cols-2 grid-cols-1 gap-4 p-2 mb-10">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />

            </div>
            <Footer/>
        </div>
    )
}

export default Compare
