import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Download, Eye, Calendar } from 'lucide-react'
import { galleryApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Hero from '@/components/Hero'
import EmptyState from '@/components/EmptyState'

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const { data: images, isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: () => galleryApi.getGalleryImages().then(res => res.data)
  })

  // Filter images based on search query
  const filteredImages = images?.filter(item => 
    searchQuery === '' || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || []

  const openLightbox = (image: any) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero
        title="Photo Gallery"
        subtitle="Explore moments of joy, transformation, and community impact through our visual stories"
        backgroundImage="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=1080&fit=crop"
      />

      {/* Search */}
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-24 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
              {filteredImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {image.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => openLightbox(image)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="View full size"
                      >
                        <Eye className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => downloadImage(image.imageUrl, image.title)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Download image"
                      >
                        <Download className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
                      {image.title}
                    </h3>
                    <div className="flex items-center text-white text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <time>{formatDate(image.createdAt)}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={searchQuery ? "No photos found" : "No photos yet"}
              description={searchQuery ? `No results found for "${searchQuery}"` : "Photos will appear here as they are uploaded through the admin panel."}
              icon={Eye}
            />
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-b-lg">
              <h3 className="font-semibold mb-1">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-sm text-gray-300 mb-2">{selectedImage.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(selectedImage.createdAt)}</span>
                </div>
                <button
                  onClick={() => downloadImage(selectedImage.imageUrl, selectedImage.title)}
                  className="flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
