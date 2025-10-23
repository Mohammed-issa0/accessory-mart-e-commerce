"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface AdminHeaderProps {
  admin: {
    full_name: string
    email: string
  } | null
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const displayName = admin?.full_name || "مسؤول"
  const displayInitial = admin?.full_name?.charAt(0) || "م"

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">Accessory Admin</div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
              {displayInitial}
            </div>
          </div>

          {admin && (
            <Button variant="ghost" size="icon" onClick={handleLogout} disabled={loading} title="تسجيل الخروج">
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
