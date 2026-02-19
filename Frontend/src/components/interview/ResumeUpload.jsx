import { Upload, FileText } from 'lucide-react'
import { useState } from 'react'

export default function ResumeUpload({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile)
      onFileSelect(droppedFile)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
        isDragging
          ? 'border-accent bg-accent/10'
          : 'border-primary/30 bg-slate-700/30 hover:border-primary/50'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
          <Upload className="text-primary" size={32} />
        </div>

        {!file ? (
          <>
            <p className="text-white font-semibold mb-2">
              Drag and drop your resume here
            </p>
            <p className="text-gray-400 text-sm mb-4">
              or click to browse (PDF only, max 10MB)
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
            >
              Browse Files
            </label>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="text-success" size={28} />
              <div className="text-left">
                <p className="text-white font-semibold">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null)
                onFileSelect(null)
              }}
              className="px-4 py-2 bg-danger/20 text-danger rounded-lg text-sm font-semibold hover:bg-danger/30 transition"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  )
}
