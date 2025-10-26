"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StatsPanelProps {
  stats: {
    streak: number
    totalXP: number
    lessonsCompleted: number
    accuracyRate: number
  }
}

export function StatsPanel({ stats }: StatsPanelProps) {
  // Generate mock data for the chart
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    xp: Math.floor(Math.random() * 100) + 50,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <Card className="bg-purple-800/50 border-purple-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6b5b95" />
            <XAxis dataKey="day" stroke="#a78bba" />
            <YAxis stroke="#a78bba" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#3d2463",
                border: "1px solid #6b5b95",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Line type="monotone" dataKey="xp" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-purple-800/50 border-purple-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Lessons Completed</span>
            <span className="text-2xl font-bold text-blue-400">{stats.lessonsCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Accuracy Rate</span>
            <span className="text-2xl font-bold text-green-400">{stats.accuracyRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Current Streak</span>
            <span className="text-2xl font-bold text-orange-400">{stats.streak} days</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
