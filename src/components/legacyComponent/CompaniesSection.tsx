import React from 'react'

function CompaniesSection() {
  // You can customize this with actual company logos or names
  const companies = [
    'Uniswap',
    'Aave',
    'Compound',
    '1inch',
    'Chainlink'
  ]

  return (
    <div className="w-full py-8 px-4 bg-black/40 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/60 text-sm text-center mb-6 font-light tracking-wide">
          Trusted by leading DeFi protocols
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company, index) => (
            <div
              key={index}
              className="text-white/40 hover:text-white/70 transition-colors duration-300 text-lg font-light tracking-wider"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompaniesSection

