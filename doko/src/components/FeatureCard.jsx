import React from 'react'

const FeatureCard = ({ icon, title, description }) => {
  return (
         <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-primary dark:text-primary-light text-4xl mb-4">
              <i className={icon}></i>
            </div>
            <h3 className="font-semibold text-xl mb-3 text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
          </div>

  )
}

export default FeatureCard