'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import map to prevent SSR issues
const Map = dynamic(() => import('./map'), { ssr: false })

export default function LocationPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(https://res.cloudinary.com/dji4motp1/image/upload/v1743876701/vellambi_wdulcx.webp)' }}>
        <div className="bg-black/50 w-full h-full absolute top-0 left-0" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white text-4xl md:text-6xl font-bold text-center"
        >
          Vellambi Forest Field Site
        </motion.h1>
      </section>

      {/* About the Location */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">About the Area</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Vellambi is a lush, biodiverse area located near Nagercoil, Tamil Nadu. The field site is surrounded by semi-evergreen forest patches, agricultural lands, and water bodies. It provides a perfect setting for ecological studies and fieldwork activities due to its rich flora and fauna.
          </p>
        </motion.div>
      </section>

      {/* Image Gallery */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              'https://res.cloudinary.com/dji4motp1/image/upload/v1743876701/vellambi_wdulcx.webp',
              // 'https://source.unsplash.com/800x600/?forest,village',
            ].map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Soil Info */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Soil Characteristics</h2>
        <p className="text-gray-700 leading-relaxed">
          The soil in this region is predominantly **lateritic and red loam**, well-drained and rich in iron and aluminum. It supports a variety of plant species, including medicinal herbs, shrubs, and agricultural crops.
        </p>
      </section>

      {/* Local Community */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Local Community</h2>
          <p className="text-gray-700 mb-4">
            The people living around Vellambi are primarily engaged in agriculture, fishing, and local crafts. They contribute significantly to the conservation and sustainability of the ecosystem through their traditional knowledge and harmonious living.
          </p>
          <div className="flex gap-4 flex-wrap">
            {/* <Image src="https://source.unsplash.com/300x300/?people,village" alt="Local People" width={300} height={300} className="rounded-lg" /> */}
            {/* <Image src="https://source.unsplash.com/300x300/?farmer,india" alt="Farmer" width={300} height={300} className="rounded-lg" /> */}
          </div>
        </div>
      </section>

      {/* Map Integration */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Location on Map</h2>
        <div className="h-96 rounded-lg overflow-hidden">
          <Map />
        </div>
      </section>
    </div>
  )
}
