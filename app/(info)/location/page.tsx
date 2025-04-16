'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamically import map to prevent SSR issues
const Map = dynamic(() => import('./map'), { ssr: false })

export default function LocationPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
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

      {/* Study Details Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Left Column - Field Study Location */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="rounded-lg p-4 border border-green-100 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">
                Field Study Location
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Region:</span> Vellambi
                  Forest
                </p>
                <p>
                  <span className="font-medium">District:</span> Kanniya
                  Kumari
                </p>
                <p>
                  <span className="font-medium">Taluk:</span> Thovalai
                </p>
                <p>
                  <span className="font-medium">State:</span> Tamil Nadu,
                  India
                </p>
                <p>
                  <span className="font-medium">Coordinates:</span> N
                  08.38049° - 08.38947°, E 077.41245° - 077.42421°
                </p>
              </div>
            </div>

            <div className="rounded-lg p-4 border border-green-100 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">
                Soil Types:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Gravel Soil</li>
                <li>Sediment Soil</li>
                <li>Red Soil</li>
              </ul>
            </div>
          </motion.div>

          {/* Center Column - Study Scope */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="rounded-lg p-4 border border-green-100 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">
                Study Scope
              </h3>
              <p className="text-sm">
                Collection of information on flowering plants and
                traditional medicinal plants used by the indigenous
                'Kanikaran' people of the Vellambi forest.
              </p>
            </div>
            
            <div className="rounded-lg p-4 border border-green-100 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">
                About the Area
              </h3>
              <p className="text-sm leading-relaxed">
                Vellambi is a lush, biodiverse area located near Nagercoil, Tamil Nadu. The field site is surrounded by semi-evergreen forest patches, agricultural lands, and water bodies. It provides a perfect setting for ecological studies and fieldwork activities due to its rich flora and fauna.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Indigenous Community */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="rounded-lg p-4 border border-green-100 shadow-sm">
              <h3 className="font-medium text-green-800 mb-2">
                Indigenous Community
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">People:</span> Kanikaran
                </p>
                <p>
                  <span className="font-medium">Meaning:</span> Hereditary
                  proprietor of the land
                </p>
                <p>
                  <span className="font-medium">Population:</span> 200
                  people
                </p>
                <p>
                  <span className="font-medium">Literates:</span> 23
                </p>
                <p>
                  <span className="font-medium">Illiterates:</span> 177
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Abstract Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg p-6 border border-green-100 shadow-sm"
          >
            <h3 className="text-xl font-medium text-green-800 mb-3">
              Abstract
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The present study aims to collect and document information
              about flowering plants and traditional medicinal plants used
              by the people of Vellambi forest. This region represents
              biomass ranging from Southern thorn forests to evergreen hill
              shoals with grass downs, comprising a large number of
              medicinal plants. The forest area spanning 47 hectares is home
              to the indigenous 'Kanikaran' community who possess
              traditional knowledge of local flora. A very old Kali Temple
              is situated ½ km away from the forest, adding cultural
              significance to the region. This comprehensive documentation
              contributes to botanical knowledge and preserves traditional
              ethnobotanical wisdom.
            </p>

            <div className="mt-4 flex justify-end">
              <p className="italic text-sm text-gray-500">
                © 2025 - PhD Research Thesis
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Soil Info with Detail */}
      {/* <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Soil Characteristics</h2>
        <p className="text-gray-700 leading-relaxed">
          The soil in this region is predominantly <strong>lateritic and red loam</strong>, well-drained and rich in iron and aluminum. It supports a variety of plant species, including medicinal herbs, shrubs, and agricultural crops.
        </p>
      </section> */}

      {/* Local Community Extended */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Local Community</h2>
          <p className="text-gray-700 mb-4">
            The Kanikaran people living around Vellambi are primarily engaged in agriculture, fishing, and local crafts. They contribute significantly to the conservation and sustainability of the ecosystem through their traditional knowledge and harmonious living. Their deep understanding of local medicinal plants has been passed down through generations, making them valuable contributors to ethnobotanical research.
          </p>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              'https://res.cloudinary.com/dji4motp1/image/upload/v1743876701/vellambi_wdulcx.webp',
              // Add more images when available
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