"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface BookLoadingAnimationProps {
  size?: number
  color?: string
}

export const BookLoadingAnimation: React.FC<BookLoadingAnimationProps> = ({
  size = 100,
  color = "#3B82F6"
}) => {
  const duration = 1.5

  const coverVariants = {
    open: { rotateY: -180 },
    closed: { rotateY: 0 }
  }

  const pageVariants = {
    open: { rotateY: 0 },
    closed: { rotateY: 180 }
  }

  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size * 0.7 }}>
        {/* Book spine */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[10%]"
          style={{ backgroundColor: color }}
        />

        {/* Front cover */}
        <motion.div
          className="absolute left-0 top-0 right-0 bottom-0 origin-left"
          style={{ backgroundColor: color }}
          initial="closed"
          animate={["open", "closed"]}
          variants={coverVariants}
          transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        {/* Pages */}
        <motion.div
          className="absolute left-[10%] top-[5%] right-[5%] bottom-[5%] bg-white origin-left"
          initial="closed"
          animate={["open", "closed"]}
          variants={pageVariants}
          transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />

        {/* Back cover */}
        <div
          className="absolute left-0 top-0 right-0 bottom-0"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

