import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Track Paks',
  description: 'track pAKs For Wherever Your Tracks Take You',
  keywords: 'bags, packs, camping, fishing, climbing',
}

export default Meta
