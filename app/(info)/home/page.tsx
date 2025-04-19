'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
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
            src="https://res.cloudinary.com/dji4motp1/image/upload/v1744135049/msuniv_logo_yifrhe.png"
            alt="University Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </motion.div>

        {/* Updated Text content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mt-4 p-4 rounded-lg max-w-2xl text-gray-800">
            <h1 className="text-2xl font-bold uppercase">
              Manonmaniam Sundaranar University
            </h1>
            <p className="mt-2 text-sm md:text-base">
              Reaccredited with 'A' Grade (CGPA 3.13 Out of 4.0) by NAAC (3rd Cycle)
              <br />
              Tirunelveli - 627012, Tamilnadu, India
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
            {/* Title */}
            <div className="text-center border-b border-green-100 pb-6 pt-6 px-6">
              <h1 className="text-3xl md:text-4xl font-serif text-green-800">
                E-FLORA OF VELLAMBI MALAI IN VEERAPULI RESERVED FOREST OF KANNIYAKUMARI DISTRICT, TAMIL NADU, INDIA.
              </h1>
            </div>

            {/* Main Image */}
            <div className="p-6">
              <motion.div
                variants={itemVariants}
                className="relative h-[400px] w-full rounded-lg overflow-hidden"
              >
                <Image
                  src="https://res.cloudinary.com/dji4motp1/image/upload/v1743876701/vellambi_wdulcx.webp"
                  alt="Vellambi Forest Field Site"
                  fill
                  className="rounded-lg object-cover"
                />
              </motion.div>
              
              <div className="mt-6 flex justify-center gap-2">
              <Button 
                  onClick={() => router.push('/intro')}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  Introduction
                </Button>
                <Button 
                  onClick={() => router.push('/location')}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  View Study Details
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}