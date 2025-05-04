import { AlertCircle, Lock} from "lucide-react"

export function NotAuthorized() {

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden mb-13">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor" className="text-orange-500" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10">
              <Lock
                size={48}
                className="text-orange-400"
              />
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
            <AlertCircle size={16} />
            <span>Authentication required</span>
          </div>

          <p className="mb-6 text-gray-300">
            Please log in to send realtime requests.
          </p>
        </div>
      </div>
    </div>
  )
}
