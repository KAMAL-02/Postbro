"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRealtimeStore } from '@/utils/store/realtimeStore'

const UrlInputs = () => {
  const { url, setUrl, status, loading, connect, disconnect } = useRealtimeStore()

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
  }

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    if(status === 'connected'){
      disconnect()
      setUrl('')
      return
    }
    connect()
  }

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <Input
        type="text"
        placeholder="Enter URL"
        onChange={(e) => handleUrlChange(e.target.value)}
        value={url}
        className="flex-1 border border-zinc-800 bg-[#121212] rounded-xs text-white p-2 h-8"
        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
      />

      <Button
        type="submit"
        className={`${status === 'connected' ? 'bg-green-500 hover:bg-green-600' : 'bg-[#df894c] hover:bg-orange-400'} text-black font-semibold py-2 h-8 px-4 rounded-xs cursor-pointer`}
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? 'Connecting...' : status === 'connected' ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  )
}

export { UrlInputs }
