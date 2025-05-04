import React from 'react'
import { UrlInputs } from '@/components/realtime/url-inputs'
import BodyInput from '@/components/realtime/body-input'

const Request = () => {
  return (
    <div className='flex flex-col h-full w-full overflow-hidden'>
      <UrlInputs />
      <BodyInput />
    </div>
  )
}

export default Request
