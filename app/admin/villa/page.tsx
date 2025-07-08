'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Upload, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const villaSchema = z.object({
  name: z.string().min(1, 'Villa name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerNight: z.number().min(1, 'Price must be greater than 0'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
})

type VillaForm = z.infer<typeof villaSchema>

interface Villa {
  id: string
  name: string
  description: string
  pricePerNight: number
  phoneNumber: string
  address?: string
  logo?: string
  photos: Photo[]
}

interface Photo {
  id: string
  filename: string
  path: string
}

export default function VillaProfile() {
  const [villa, setVilla] = useState<Villa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VillaForm>({
    resolver: zodResolver(villaSchema),
  })

  useEffect(() => {
    fetchVillaData()
  }, [])

  const fetchVillaData = async () => {
    try {
      const response = await fetch('/api/admin/villa')
      if (response.ok) {
        const data = await response.json()
        setVilla(data)
        reset(data)
      }
    } catch (error) {
      console.error('Error fetching villa data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: VillaForm) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/villa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Villa updated successfully')
        fetchVillaData()
      } else {
        alert('Failed to update villa')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const response = await fetch('/api/admin/villa/photos', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        fetchVillaData()
      } else {
        alert('Failed to upload photo')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await fetch('/api/admin/villa/logo', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        fetchVillaData()
      } else {
        alert('Failed to upload logo')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/admin/villa/photos/${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchVillaData()
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-gradient">
        <div className="text-lg text-warm-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gradient">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center text-warm-600 hover:text-warm-900 mr-4 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-warm-900">Villa Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Villa Details Form */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-warm-900">Villa Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="input-field"
                  placeholder="Villa Name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input-field"
                  placeholder="Villa Description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Price per Night
                </label>
                <input
                  {...register('pricePerNight', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.pricePerNight && (
                  <p className="mt-1 text-sm text-red-600">{errors.pricePerNight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  className="input-field"
                  placeholder="Villa Phone Number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="input-field"
                  placeholder="Villa Address"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary w-full flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Logo and Photos */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-warm-900">Logo</h3>
              
              {villa?.logo && (
                <div className="mb-4">
                  <img
                    src={villa.logo}
                    alt="Villa logo"
                    className="w-32 h-32 object-cover rounded-lg border border-warm-200"
                  />
                </div>
              )}

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
                <div className="btn-secondary w-full flex items-center justify-center cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </div>
              </label>
            </div>

            {/* Photos Upload */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-warm-900">Photos</h3>
              
              <label className="block mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
                <div className="btn-secondary w-full flex items-center justify-center cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  {uploadingPhoto ? 'Uploading...' : 'Add Photo'}
                </div>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {villa?.photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.path}
                      alt={photo.filename}
                      className="w-full h-32 object-cover rounded-lg border border-warm-200"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 