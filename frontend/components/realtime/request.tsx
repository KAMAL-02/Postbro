"use client";
import React from 'react'
import { UrlInputs } from '@/components/realtime/url-inputs'
import BodyInput from '@/components/realtime/body-input'

const Request = () => {
  return (
    <div className='flex flex-col h-full w-full'>
      <div className="flex-none">
        <UrlInputs />
      </div>
      <div className="flex-1 overflow-hidden">
        <BodyInput />
      </div>
    </div>
  )
}

export default Request