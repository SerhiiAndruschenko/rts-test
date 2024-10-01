'use client'

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Code, Laptop, Megaphone, MessageCircle, Smartphone, X, ChevronRight, PenTool, ShoppingCart, Globe, Layers, Sun, Moon, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    if (mounted) {
      document.body.className = theme
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

const GlassCard = ({ children, className = '' }) => {
  const { theme } = useTheme()
  return (
    <motion.div
      className={`backdrop-blur-md ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} rounded-2xl p-6 shadow-xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  )
}

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const [cursorVisible, setCursorVisible] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.top = `${e.clientY}px`
        cursorRef.current.style.left = `${e.clientX}px`
      }
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  useEffect(() => {
    const handleMouseEnter = () => setCursorVisible(true)
    const handleMouseLeave = () => setCursorVisible(false)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`fixed w-6 h-6 rounded-full border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-purple-500'} pointer-events-none transition-opacity duration-300 z-50 ${
        cursorVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ mixBlendMode: 'difference' }}
    />
  )
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  const { theme } = useTheme()

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-blue-500' : 'bg-purple-500'} origin-left z-50`}
      style={{ scaleX }}
    />
  )
}

const AnimatedTitle = ({ children }) => {
  const { theme } = useTheme()
  return (
    <motion.h2
      className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center bg-clip-text text-transparent ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
          : 'bg-gradient-to-r from-blue-600 to-blue-400'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {children}
    </motion.h2>
  )
}

const FloatingIcons = () => {
  const { theme } = useTheme()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[Code, Laptop, Smartphone, Megaphone, Globe, ShoppingCart, PenTool, Layers].map((Icon, index) => (
        <motion.div
          key={index}
          className={`absolute ${theme === 'dark' ? 'text-blue-300' : 'text-purple-300'} opacity-20`}
          initial={{ x: Math.random() * dimensions.width, y: Math.random() * dimensions.height }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
        >
          <Icon size={32 + Math.random() * 32} />
        </motion.div>
      ))}
    </div>
  )
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full z-50 ${
        theme === 'dark' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
      }`}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  )
}

const Header = () => {
  const { theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={`fixed top-0 left-0 w-full p-4 z-40 backdrop-blur-md ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/30'}`}>
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="#" className="text-2xl font-bold">
          <img src='/images/logo.svg' />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {['Services', 'Projects', 'Contact'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className={`hover:${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} transition-colors`}>
              {item}
            </Link>
          ))}
          <ThemeToggle />
        </div>
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`ml-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`md:hidden mt-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-4`}
        >
          {['Services', 'Projects', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`block py-2 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  )
}

const ModernLanding2024 = () => {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} overflow-hidden`}>
      <CustomCursor />
      <ScrollProgress />
      <FloatingIcons />
      <Header />

      <main>
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="text-center space-y-8 max-w-4xl mx-auto px-4 relative z-10">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Crafting Digital
              <span className={`block bg-clip-text text-transparent ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-400'
              }`}>
                Experiences That Inspire
              </span>
            </motion.h1>
            <motion.p 
              className={`text-lg sm:text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Specializing in WordPress, WooCommerce, UI/UX, React, and Next.js to create powerful, user-centric web solutions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button className={`${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-purple-700'} text-white rounded-full px-6 py-3 text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300`}>
                Explore Our Expertise
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section id="services" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedTitle>Our Specialized Services</AnimatedTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "WordPress Development", description: "Custom WordPress solutions tailored to your unique business needs, ensuring scalability and ease of management." },
                { icon: ShoppingCart, title: "WooCommerce Integration", description: "Powerful e-commerce functionality with WooCommerce, creating seamless online shopping experiences." },
                { icon: PenTool, title: "UI/UX Design", description: "Intuitive and visually stunning interfaces that enhance user engagement and satisfaction across all devices." },
                { icon: Code, title: "React Development", description: "Dynamic and responsive web applications built with React, offering smooth and interactive user experiences." },
                { icon: Layers, title: "Next.js Solutions", description: "Leveraging the power of Next.js for server-side rendering, static site generation, and optimal performance." },
                { icon: Smartphone, title: "Responsive Web Design", description: "Ensuring your website looks and functions flawlessly across all devices and screen sizes." },
                { icon: Megaphone, title: "SEO Optimization", description: "Enhancing your online visibility with search engine optimized websites and content strategies." },
                { icon: Laptop, title: "Custom Web Applications", description: "Bespoke web applications tailored to your specific business processes and requirements." },
                { icon: MessageCircle, title: "Ongoing Support & Maintenance", description: "Reliable support and regular updates to keep your website secure, fast, and up-to-date." }
              ].map((service, index) => (
                <GlassCard key={index}>
                  <service.icon className={`w-12 h-12 mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{service.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedTitle>Featured Projects</AnimatedTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((project) => (
                <motion.div
                  key={project}
                  className="relative overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={`/images/example.png`}
                    alt={`Project ${project}`}
                    width={600}
                    height={400}
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'dark' ? 'from-gray-900' : 'from-white'} to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6`}>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Project Showcase {project}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>WordPress | WooCommerce | React</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4">
            <AnimatedTitle>Let's Create Together</AnimatedTitle>
            <GlassCard className="max-w-2xl mx-auto">
              <form className="space-y-4">
                <Input placeholder="Your Name" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                <Input type="email" placeholder="Your Email" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                <Textarea placeholder="Tell us about your project" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                <Button type="submit" className={`w-full ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-purple-700'} text-white`}>Start Your Project</Button>
              </form>
            </GlassCard>
          </div>
        </section>
      </main>

      <footer className={theme === 'dark' ? 'py-8 bg-gray-800' : 'py-8 bg-gray-200'}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>© 2024 WebCraft Pro. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Terms</Link>
            <Link href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>Privacy</Link>
          </nav>
        </div>
      </footer>

      <motion.button
        className={`fixed bottom-4 right-4 p-4 ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-purple-700'} text-white rounded-full shadow-lg transition-colors z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsContactOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {isContactOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GlassCard className="w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Contact</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsContactOpen(false)}>
                <X className={`h-4 w-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              </Button>
            </div>
            <form className="space-y-4">
              <Input placeholder="Your Name" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              <Input type="email" placeholder="Your Email" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              <Textarea placeholder="Your Message" className={`bg-white/10 border-gray-600 placeholder-gray-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              <Button type="submit" className={`w-full ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-purple-700'} text-white`}>Send</Button>
            </form>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

const App = () => (
  <ThemeProvider>
    <ModernLanding2024 />
  </ThemeProvider>
)

export default App