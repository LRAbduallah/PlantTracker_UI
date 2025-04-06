'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ThesisFrontPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    <div className="min-h-screen">
      {/* University Logo/Emblem */}

      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-48 h-48 relative"
        >
          <Image
            src="https://res.cloudinary.com/dji4motp1/image/upload/v1743876700/college_n0rmej.webp"
            alt="College Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </motion.div>

        {/* Text content from the image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mt-4 p-4 rounded-lg max-w-2xl text-gray-800">
            <h1 className="text-2xl font-bold">S. T. HINDU COLLEGE</h1>
            <h2 className="text-xl font-bold mt-1">தெ. தி. இந்துக் கல்லூரி</h2>
            <p className="mt-2 text-sm md:text-base">
              Co-Educational | Nagercoil, Tamilnadu - 629 002.
              <br />
              Affiliated to Manonmaniam Sundaranar University.
              <br />
              Re-Accredited by NAAC with B++ Grade
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        {/* Main Title Card */}
        <motion.div variants={itemVariants}>
          <Card className="border border-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-green-100 pb-6">
              <CardTitle className="text-3xl md:text-4xl font-serif text-green-800">
                DIGITAL FLORA OF VELLAMBI MALAI IN VEERAPULI RESERVED FOREST
              </CardTitle>
              {/* <CardDescription className="text-lg md:text-xl mt-2 text-green-700">
                Taxonomy and Biodiversity of the Vellambi Forest
              </CardDescription> */}
            </CardHeader>

            <CardContent className="pt-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {/* Left Column - Location Details */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-4 order-2 md:order-1"
                >
                  <div className=" rounded-lg p-4 border border-green-100">
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

                  <div className=" rounded-lg p-4 border border-green-100">
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

                {/* Center Column - Field Photo */}
                <motion.div
                  variants={itemVariants}
                  className="order-1 md:order-2"
                >
                  <div className="relative h-full rounded-lg overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/dji4motp1/image/upload/v1743876701/vellambi_wdulcx.webp"
                      alt="Vellambi Forest Field Site"
                      fill
                      className=" rounded-lg"
                    />
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-2 text-sm">
      Field Photo: Vellambi Forest
    </div> */}
                  </div>
                </motion.div>

                {/* Right Column - Study Information */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-4 order-3"
                >
                  <div className=" rounded-lg p-4 border border-green-100">
                    <h3 className="font-medium text-green-800 mb-2">
                      Study Scope
                    </h3>
                    <p className="text-sm">
                      Collection of information on flowering plants and
                      traditional medicinal plants used by the indigenous
                      'Kanikaran' people of the Vellambi forest.
                    </p>
                  </div>

                  <div className=" rounded-lg p-4 border border-green-100">
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

              {/* Abstract Section */}
              <motion.div
                variants={itemVariants}
                className="mt-8 bg-white rounded-lg p-6 border border-green-100 shadow-sm"
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
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
