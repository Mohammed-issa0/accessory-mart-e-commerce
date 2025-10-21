import type { LucideIcon } from "lucide-react"

interface DashboardStatsProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
}

export default function DashboardStats({ title, value, subtitle, icon: Icon, trend = "neutral" }: DashboardStatsProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">{subtitle}</button>
    </div>
  )
}
