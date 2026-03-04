'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  AlertCircle,
  Download,
  Loader2,
  Sparkles,
  FileJson,
  Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProteinFeature } from '@/types';

interface FileUploadProps {
  onFileProcessed: (features: ProteinFeature[]) => void;
  onLoadDemo: () => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileProcessed, onLoadDemo, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewData, setPreviewData] = useState<{
    totalRecords: number;
    uniqueProteins: number;
    validRecords: number;
    preview: ProteinFeature[];
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setUploadStatus('uploading');
    setErrorMessage('');
    setPreviewData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process file');
      }

      setPreviewData({
        totalRecords: data.data.totalRecords,
        uniqueProteins: data.data.uniqueProteins,
        validRecords: data.data.validRecords,
        preview: data.data.preview
      });
      setUploadStatus('success');
      
      if (data.data.allFeatures) {
        onFileProcessed(data.data.allFeatures);
      }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        setUploadedFile(file);
        processFile(file);
      } else {
        setUploadStatus('error');
        setErrorMessage('Please upload a CSV or JSON file');
      }
    }
  }, [onFileProcessed]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      processFile(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/upload');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'protein_data_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download template:', error);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    setPreviewData(null);
  };

  return (
    <div className="relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl" />
      
      <Card className="relative glass-card rounded-3xl border-white/5 overflow-hidden">
        {/* Header Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <Upload className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <span>Data Upload</span>
                <p className="text-sm font-normal text-slate-500 mt-0.5">Upload your mass spectrometry data</p>
              </div>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onLoadDemo}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg shadow-cyan-500/25 btn-animated"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Load Demo Data
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {uploadStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 overflow-hidden ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]'
                      : 'border-white/10 hover:border-white/30 bg-gradient-to-br from-slate-800/30 to-slate-900/30'
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {/* Animated Background on Drag */}
                  {isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
                    />
                  )}
                  
                  <div className="relative z-[1] space-y-5">
                    {/* Upload Icon */}
                    <motion.div 
                      className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center relative"
                      animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                      <div className="relative bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl p-4">
                        <Upload className="h-10 w-10 text-cyan-400" />
                      </div>
                    </motion.div>
                    
                    <div>
                      <p className="text-xl font-semibold text-white mb-2">
                        {isDragging ? 'Drop your file here!' : 'Drag & drop your file here'}
                      </p>
                      <p className="text-slate-500">
                        or <span className="text-cyan-400 cursor-pointer hover:underline">browse from computer</span>
                      </p>
                    </div>
                    
                    {/* File Type Badges */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <Badge variant="outline" className="px-3 py-1.5 border-cyan-500/20 text-cyan-300 bg-cyan-500/10">
                        <Table className="h-3 w-3 mr-1.5" />
                        CSV
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1.5 border-purple-500/20 text-purple-300 bg-purple-500/10">
                        <FileJson className="h-3 w-3 mr-1.5" />
                        JSON
                      </Badge>
                      <span className="text-xs text-slate-600">Max 10MB</span>
                    </div>
                    
                    {/* Expected Columns */}
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                      {['protein_name', 'peptide_sequence', 'mz_ratio', 'intensity'].map((col, i) => (
                        <span key={col} className="flex items-center gap-1.5">
                          <code className="px-2 py-1 rounded-md bg-slate-800/50 text-slate-400 font-mono">{col}</code>
                          {i < 3 && <span className="text-slate-700">•</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {uploadStatus === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                  <Loader2 className="relative h-16 w-16 text-cyan-400 animate-spin" />
                </div>
                <p className="text-lg font-medium text-white mt-6">Processing file...</p>
                <p className="text-sm text-slate-500 mt-2">Analyzing protein features</p>
              </motion.div>
            )}

            {uploadStatus === 'success' && previewData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Success Header */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center"
                    >
                      <Check className="h-6 w-6 text-green-400" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-white">{uploadedFile?.name}</p>
                      <p className="text-sm text-slate-500">{((uploadedFile?.size || 0) / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetUpload}
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Records', value: previewData.totalRecords, color: 'cyan' },
                    { label: 'Unique Proteins', value: previewData.uniqueProteins, color: 'purple' },
                    { label: 'Valid Records', value: previewData.validRecords, color: 'green' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-4 rounded-2xl bg-slate-800/30 border border-white/5"
                    >
                      <p className={`text-3xl font-bold bg-gradient-to-r ${
                        stat.color === 'cyan' ? 'from-cyan-400 to-blue-400' :
                        stat.color === 'purple' ? 'from-purple-400 to-violet-400' :
                        'from-green-400 to-emerald-400'
                      } bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Preview Table */}
                <div className="rounded-2xl bg-slate-800/30 border border-white/5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white">Preview (first 5 records)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-500 border-b border-white/5">
                          <th className="text-left py-3 px-4 font-medium">Protein</th>
                          <th className="text-left py-3 px-4 font-medium">Peptide</th>
                          <th className="text-right py-3 px-4 font-medium">m/z</th>
                          <th className="text-right py-3 px-4 font-medium">Intensity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.preview.slice(0, 5).map((row, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 px-4 text-slate-300 font-medium">{row.proteinName}</td>
                            <td className="py-3 px-4 text-slate-400 font-mono">
                              {row.peptideSequence.slice(0, 15)}...
                            </td>
                            <td className="py-3 px-4 text-right text-cyan-400">{row.mzRatio.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-purple-400">
                              {row.intensity.toExponential(2)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {uploadStatus === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Alert className="border-red-500/30 bg-red-500/10 rounded-2xl">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <AlertDescription className="text-red-300 ml-2">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={resetUpload}
                  className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
