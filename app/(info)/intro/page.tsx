'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
          Introduction
        </motion.h1>
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
              Briefing
            </h3>
            <p className="text-gray-700 leading-relaxed">
            A floristic study of the Kani tribes involves documenting and analyzing the diversity of plant species within their environment, especially those utilized in traditional medicine, food, housing, and rituals. Such a study not only contributes to the scientific understanding of local biodiversity but also serves as a crucial step in preserving the intangible cultural heritage of the tribe. Moreover, with increasing threats from deforestation, habitat loss, and modernization, there is an urgent need to record and safeguard the botanical knowledge held by indigenous groups like the Kanis.
            This study aims to catalog the plant species commonly used by the Kani tribes, explore their ethnobotanical applications, and highlight the ecological and cultural significance of their traditional practices. The research also underlines the importance of integrating indigenous knowledge with modern conservation strategies to ensure the sustainable management of biodiversity-rich areas like the Western Ghats.
            </p>
          </motion.div>
        </div>
      </section>

      
    </div>
  )
}