'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Home, Settings, LogOut, TrendingUp, Users, DollarSign } from 'lucide-react'

interface DashboardStats {
  totalBookings: number
  upcomingBookings: number
  occupancyRate: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    occupancyRate: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-header shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-accent">Villa Manager Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-text hover:text-accent transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/villa" className="card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-accent mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-accent">Villa Profile</h3>
                <p className="text-text text-sm">Manage your villa's profile</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/calendar" className="card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-accent mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-accent">Calendar Bookings</h3>
                <p className="text-text text-sm">View and manage bookings</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="card hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-accent mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-accent">Settings</h3>
                <p className="text-text text-sm">Configure villa settings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-header rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Bookings</p>
                <p className="text-2xl font-semibold text-accent">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-header rounded-lg">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Upcoming Bookings</p>
                <p className="text-2xl font-semibold text-accent">{stats.upcomingBookings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-header rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Occupancy Rate</p>
                <p className="text-2xl font-semibold text-accent">{stats.occupancyRate}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-header rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Revenue</p>
                <p className="text-2xl font-semibold text-accent">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-accent mb-4">Recent Activity</h2>
          <div className="card">
            <p className="text-text text-sm">No activity found</p>
          </div>
        </div>
      </div>
    </div>
  )
} 