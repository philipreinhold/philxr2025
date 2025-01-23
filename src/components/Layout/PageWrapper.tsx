import { motion } from 'framer-motion'

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 px-6 max-w-7xl mx-auto"
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper