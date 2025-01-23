import PageWrapper from '../Layout/PageWrapper'

const About = () => {
  return (
    <PageWrapper>
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-xl font-light">About</h2>
          <p className="text-neutral-800 leading-relaxed">
            Cinematographer / Filmmaker & XR Artist working on international XR Experiences, 
            Films and Games since 2020. Specializing in webXR, Unity, Unreal with a foundation 
            in Computer Science & Digital Art.
          </p>
          {/* Rest of the content */}
        </section>
      </div>
    </PageWrapper>
  )
}

export default About