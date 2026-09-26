import React from 'react'

const teamMembers = [
  {
    name: 'HARiKiSHAN',
    instagram: '18s.harikishan',
    image: '/team/person1.jpg'
  },
  {
    name: 'DiVYA',
    instagram: '@instagram2',
    image: '/team/person2.jpg'
  },
  {
    name: 'PRiYA',
    instagram: '@instagram3',
    image: '/team/person3.jpg'
  },
  {
    name: 'SOMYA',
    instagram: '@instagram4',
    image: '/team/person4.jpg'
  },
  {
    name: 'NAiNSEE',
    instagram: '@instagram5',
    image: '/team/person5.jpg'
  },
  {
    name: 'MANVi',
    instagram: '@instagram6',
    image: '/team/person6.jpg'
  }
]

function About({ onClose }) {
  return (
    <div className="about-page">

      <button className="about-close" onClick={onClose}>
        ✕
      </button>

      <div className="about-content">

        <div className="about-hero">
          <div className="about-badge">🚀 ABOUT AI LEARN & VISUALIZE</div>

          <h1>Learn Smarter. Visualize Better.</h1>

          <p>
            AI Learn & Visualize transforms complex topics into simple
            explanations, interactive diagrams and practice questions.
            Learn any concept faster with the power of AI.
          </p>
        </div>

        <div className="team-section">

          <h2>✨ Meet Our Team</h2>

          <p className="team-subtitle">
            The people behind AI Learn & Visualize
          </p>

          <div className="team-grid">

            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>

                <div className="team-image-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />
                </div>

                <h3>{member.name}</h3>

                <a
                  href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-link"
                >
                  📸 {member.instagram}
                </a>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  )
}

export default About