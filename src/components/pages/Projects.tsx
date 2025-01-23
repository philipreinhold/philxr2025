import PageWrapper from '../Layout/PageWrapper'

const Projects = () => {
  return (
    <PageWrapper>
      <h2 className="text-xl font-light mb-8">Projects</h2>
      <div className="grid grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div 
            key={item}
            className="aspect-video bg-neutral-100 rounded-sm hover:bg-neutral-200 
                     transition-colors duration-300 cursor-pointer"
          />
        ))}
      </div>
    </PageWrapper>
  )
}

export default Projects