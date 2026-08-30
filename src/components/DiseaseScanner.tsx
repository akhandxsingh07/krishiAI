import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  CloudSun,
  ShieldCheck,
  Leaf,
  Printer,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { DiseaseScanResult, Language } from '../types';
import { SAMPLE_LEAVES, SampleLeaf } from '../data/diseasesData';
import { getTranslation } from '../locales/translations';

interface DiseaseScannerProps {
  currentLang: Language;
  onAskChatbot: (query: string) => void;
}

export const DiseaseScanner: React.FC<DiseaseScannerProps> = ({
  currentLang,
  onAskChatbot,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    SAMPLE_LEAVES[0].imageUrl
  );
  const [selectedLeafMeta, setSelectedLeafMeta] =
    useState<SampleLeaf | null>(SAMPLE_LEAVES[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] =
    useState<DiseaseScanResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = (key: string) => getTranslation(currentLang, key);

  // Handle image upload from file picker / drag & drop
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setSelectedLeafMeta(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setScanResult(null);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Select a pre-loaded sample leaf
  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedLeafMeta(sample);
    setSelectedImage(sample.imageUrl);
    setScanResult(null);
    setErrorMsg(null);
  };

  // Live Camera handlers
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      setErrorMsg(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsCameraOpen(false);
      setErrorMsg(
        'Could not open camera stream. Please use the upload button or sample leaves.'
      );

      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setSelectedImage(dataUrl);
        setSelectedLeafMeta(null);
        setScanResult(null);

        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      stream.getTracks().forEach((track) => track.stop());

      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  // Convert image URL to Base64 if it's external
  const urlToBase64 = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) {
      return url;
    }

    try {
      const res = await fetch(url, {
        mode: 'cors',
      });

      const blob = await res.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result as string);
        };

        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn(
        'CORS fallback for sample image, returning standard payload',
        e
      );

      return '';
    }
  };

  // Run AI Disease Diagnosis
  const handleScanImage = async () => {
    if (!selectedImage) {
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      let payloadBase64 = selectedImage;

      if (selectedImage.startsWith('http')) {
        try {
          payloadBase64 = await urlToBase64(selectedImage);
        } catch {
          payloadBase64 = '';
        }
      }

      console.log('Starting crop analysis...');
      console.log('Image available:', Boolean(payloadBase64));
      console.log('Crop hint:', cropHint);
      console.log('Language:', currentLang);

      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: payloadBase64 || selectedImage,
          language: currentLang,
          cropHint: cropHint || selectedLeafMeta?.crop || '',
        }),
      });

      console.log('AI response status:', response.status);

      if (!response.ok) {
        let serverMessage = '';

        try {
          const errorData = await response.json();

          serverMessage =
            errorData?.error ||
            errorData?.details ||
            JSON.stringify(errorData);
        } catch {
          try {
            serverMessage = await response.text();
          } catch {
            serverMessage = '';
          }
        }

        throw new Error(
          `Server returned ${response.status}${
            serverMessage ? `: ${serverMessage}` : ''
          }`
        );
      }

      const data: DiseaseScanResult = await response.json();

      console.log('AI diagnosis received:', data);

      setScanResult(data);
      setErrorMsg(null);
    } catch (err: any) {
      console.error('Scan error:', err);

      const message =
        err?.message ||
        err?.toString() ||
        'Unknown error while analyzing the crop.';

      setErrorMsg(`AI diagnosis failed: ${message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const printDiagnosticReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 text-[#a3b18a] text-xs uppercase tracking-widest font-semibold">
          <Scan className="w-3.5 h-3.5 text-[#a3b18a]" />
          <span>Multimodal Computer Vision Engine</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-light text-[#f2f2e8] font-serif">
          {t('scanTitle')}
        </h2>

        <p className="text-sm sm:text-base text-[#f2f2e8]/70 max-w-3xl mx-auto font-light">
          {t('scanSubtitle')}
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column */}
        <div className="lg:col-span-5 space-y-5">

          <div className="p-5 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 shadow-2xl space-y-4">

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#f2f2e8] flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-[#a3b18a]" />
                <span>Crop Leaf / Symptom Image</span>
              </h3>

              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setScanResult(null);
                  }}
                  className="text-xs text-[#f2f2e8]/50 hover:text-red-400 transition-colors"
                >
                  Clear image
                </button>
              )}
            </div>

            {/* Camera or Image Preview */}
            {isCameraOpen ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#a3b18a]">

                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />

                <canvas
                  ref={canvasRef}
                  className="hidden"
                />

                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">

                  <button
                    onClick={captureCameraPhoto}
                    className="px-4 py-2 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Photo</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-semibold text-xs"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-[#a3b18a]/30 bg-[#0a110a] group">

                <img
                  src={selectedImage}
                  alt="Selected crop leaf"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />

                {/* Laser Scanning Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-[#0a110a]/70 backdrop-blur-[2px] flex flex-col items-center justify-center">

                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#a3b18a] to-transparent shadow-[0_0_15px_#a3b18a] animate-bounce absolute top-1/3" />

                    <div className="w-12 h-12 rounded-full border-2 border-[#a3b18a] border-t-transparent animate-spin mb-3" />

                    <p className="text-xs font-bold uppercase tracking-wider text-[#a3b18a] bg-[#0a110a]/90 px-4 py-1.5 rounded-full border border-[#a3b18a]/40">
                      {t('analyzingText')}
                    </p>

                  </div>
                )}

                {/* Image Overlay Controls */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-[#0a110a]/80 hover:bg-[#0a110a] text-[#f2f2e8] text-xs backdrop-blur-sm border border-[#a3b18a]/30"
                    title="Change Photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={startCamera}
                    className="p-1.5 rounded-lg bg-[#0a110a]/80 hover:bg-[#0a110a] text-[#f2f2e8] text-xs backdrop-blur-sm border border-[#a3b18a]/30"
                    title="Use Camera"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                </div>

                {selectedLeafMeta && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a110a] via-[#0a110a]/80 to-transparent p-3 text-xs">

                    <p className="font-bold text-[#a3b18a]">
                      {selectedLeafMeta.name}
                    </p>

                    <p className="text-[#f2f2e8]/70 text-[11px] line-clamp-1">
                      {selectedLeafMeta.description}
                    </p>

                  </div>
                )}

              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-[#a3b18a]/30 hover:border-[#a3b18a]/60 bg-[#0a110a]/40 hover:bg-[#0a110a]/70 p-8 text-center cursor-pointer transition-colors space-y-3"
              >

                <div className="w-12 h-12 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/30 flex items-center justify-center text-[#a3b18a] mx-auto">
                  <Upload className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-xs text-[#f2f2e8] uppercase tracking-wider">
                    {t('uploadPrompt')}
                  </p>

                  <p className="text-[11px] text-[#f2f2e8]/50 max-w-xs mx-auto">
                    {t('uploadHint')}
                  </p>
                </div>

              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
            />

            {/* Crop Hint */}
            <div className="space-y-1.5">

              <label className="text-xs font-semibold text-[#a3b18a] uppercase tracking-wider text-[11px]">
                Crop Name / Variety Hint (Optional)
              </label>

              <input
                type="text"
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                placeholder="e.g. Paddy / Wheat / Cotton / Tomato"
                className="w-full px-3 py-2 rounded-lg bg-[#0a110a] border border-[#a3b18a]/30 text-xs text-[#f2f2e8] placeholder-[#f2f2e8]/30 focus:outline-none focus:border-[#a3b18a]"
              />

            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">

              <button
                id="execute-ai-scan-btn"
                onClick={handleScanImage}
                disabled={!selectedImage || isScanning}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                  !selectedImage || isScanning
                    ? 'bg-[#1a241a] text-[#f2f2e8]/30 cursor-not-allowed border border-white/5'
                    : 'bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                <Sparkles className="w-4 h-4" />

                <span>
                  {isScanning
                    ? 'Analyzing Crop...'
                    : 'Analyze Symptoms with AI'}
                </span>
              </button>

              <button
                onClick={startCamera}
                className="p-3 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider"
                title={t('btnTakePhoto')}
              >
                <Camera className="w-4 h-4 text-[#a3b18a]" />
                <span className="hidden sm:inline">Camera</span>
              </button>

            </div>

            {/* REAL ERROR MESSAGE */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2">

                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />

                <span>{errorMsg}</span>

              </div>
            )}

          </div>

          {/* Pre-Loaded Sample Leaves */}
          <div className="p-4 rounded-xl bg-[#121b12] border border-[#a3b18a]/20 space-y-3">

            <div className="flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-[#a3b18a]">
                {t('btnSelectSample')}
              </p>

              <span className="text-[10px] uppercase tracking-widest text-[#f2f2e8]/40">
                1-Click Test
              </span>

            </div>

            <div className="grid grid-cols-3 gap-2">

              {SAMPLE_LEAVES.map((leaf) => {
                const isSelected =
                  selectedLeafMeta?.id === leaf.id;

                return (
                  <button
                    key={leaf.id}
                    onClick={() => handleSelectSample(leaf)}
                    className={`p-1.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-[#a3b18a]/20 border-[#a3b18a]'
                        : 'bg-[#141d14] border-[#a3b18a]/20 hover:border-[#a3b18a]/40'
                    }`}
                  >

                    <img
                      src={leaf.thumbnail}
                      alt={leaf.name}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[4/3] object-cover rounded mb-1.5"
                    />

                    <p className="text-[10px] font-bold text-[#f2f2e8] line-clamp-1">
                      {leaf.crop.split('(')[0]}
                    </p>

                    <p className="text-[9px] text-[#a3b18a] line-clamp-1">
                      {leaf.disease.split('(')[0]}
                    </p>

                  </button>
                );
              })}

            </div>

          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">

          {scanResult ? (
            <div
              id="diagnostic-report-card"
              className="p-6 rounded-xl bg-[#121b12] border border-[#a3b18a]/30 shadow-2xl space-y-6 text-[#f2f2e8]"
            >

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#a3b18a]/20 pb-4">

                <div>

                  <div className="flex items-center gap-2 mb-1">

                    <span className="text-xs font-bold uppercase tracking-widest text-[#a3b18a]">
                      {scanResult.cropName}
                    </span>

                    <span className="text-[#f2f2e8]/30">
                      •
                    </span>

                    <span className="text-xs text-[#f2f2e8]/70">
                      {scanResult.affectedPart}
                    </span>

                  </div>

                  <h3 className="text-xl sm:text-2xl font-light font-serif text-[#f2f2e8] flex items-center gap-2">
                    {scanResult.diseaseName}
                  </h3>

                  {scanResult.scientificName && (
                    <p className="text-xs text-[#a3b18a]/80 italic">
                      Pathogen: {scanResult.scientificName}
                    </p>
                  )}

                </div>

                {/* Score & Severity */}
                <div className="flex items-center gap-2">

                  <div className="px-3 py-1.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/30 text-center">

                    <div className="text-[9px] uppercase tracking-wider text-[#f2f2e8]/50">
                      {t('confidenceScore')}
                    </div>

                    <div className="text-sm font-bold text-[#a3b18a] font-mono">
                      {scanResult.confidence.toFixed(1)}%
                    </div>

                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-lg border text-center ${
                      scanResult.severity === 'High'
                        ? 'bg-red-950/40 border-red-500/40 text-red-300'
                        : scanResult.severity === 'Medium'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        : 'bg-[#a3b18a]/20 border-[#a3b18a]/40 text-[#a3b18a]'
                    }`}
                  >

                    <div className="text-[9px] uppercase tracking-wider text-[#f2f2e8]/50">
                      {t('severity')}
                    </div>

                    <div className="text-sm font-bold uppercase tracking-wider">
                      {scanResult.severity}
                    </div>

                  </div>

                </div>

              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs sm:text-sm text-[#f2f2e8]/90 leading-relaxed font-light">

                <span className="font-semibold text-[#a3b18a]">
                  Diagnosis Summary:{' '}
                </span>

                {scanResult.summary}

              </div>

              {/* Symptoms */}
              <div className="space-y-2">

                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#a3b18a] flex items-center gap-1.5">

                  <Info className="w-3.5 h-3.5 text-[#a3b18a]" />

                  <span>{t('symptoms')}</span>

                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  {scanResult.symptomsObserved.map(
                    (symptom, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/15 text-xs text-[#f2f2e8]/80 flex items-start gap-2"
                      >

                        <span className="w-1.5 h-1.5 rounded-full bg-[#a3b18a] mt-1.5 shrink-0" />

                        <span>{symptom}</span>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Immediate Actions */}
              <div className="space-y-2">

                <h4 className="font-semibold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">

                  <Flame className="w-3.5 h-3.5 text-amber-400" />

                  <span>Immediate 48-Hour Field Actions</span>

                </h4>

                <div className="space-y-1.5">

                  {scanResult.immediateActions.map(
                    (action, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-600/30 text-xs text-amber-100 flex items-start gap-2"
                      >

                        <span className="font-bold text-amber-300 font-mono">
                          {idx + 1}.
                        </span>

                        <span>{action}</span>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Chemical Remedies */}
              <div className="space-y-2">

                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#a3b18a] flex items-center gap-1.5">

                  <ShieldCheck className="w-3.5 h-3.5 text-[#a3b18a]" />

                  <span>{t('chemicalRemedies')}</span>

                </h4>

                <div className="overflow-x-auto rounded-lg border border-[#a3b18a]/20 bg-[#0a110a]">

                  <table className="w-full text-xs text-left">

                    <thead className="bg-[#141d14] text-[#a3b18a] font-semibold border-b border-[#a3b18a]/20 uppercase tracking-wider text-[10px]">

                      <tr>
                        <th className="p-2.5">
                          Fungicide / Chemical
                        </th>

                        <th className="p-2.5">
                          Dosage / Litre
                        </th>

                        <th className="p-2.5">
                          Application Method
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-[#a3b18a]/10 text-[#f2f2e8]/80">

                      {scanResult.chemicalRemedies.map(
                        (chem, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-[#a3b18a]/5"
                          >

                            <td className="p-2.5 font-medium text-[#f2f2e8]">
                              {chem.chemical}
                            </td>

                            <td className="p-2.5 text-[#a3b18a] font-mono">
                              {chem.dosage}
                            </td>

                            <td className="p-2.5 text-[#f2f2e8]/70">
                              {chem.applicationMethod}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* Organic Remedies */}
              <div className="space-y-2">

                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#a3b18a] flex items-center gap-1.5">

                  <Leaf className="w-3.5 h-3.5 text-[#a3b18a]" />

                  <span>{t('organicRemedies')}</span>

                </h4>

                <div className="space-y-2">

                  {scanResult.organicRemedies.map(
                    (org, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 space-y-1"
                      >

                        <p className="font-bold text-xs text-[#a3b18a]">
                          {org.remedy}
                        </p>

                        <p className="text-[11px] text-[#f2f2e8]/70">

                          <span className="text-[#f2f2e8]/40 font-medium">
                            Preparation:{' '}
                          </span>

                          {org.preparation}

                        </p>

                        <p className="text-[11px] text-[#f2f2e8]/70">

                          <span className="text-[#f2f2e8]/40 font-medium">
                            Application:{' '}
                          </span>

                          {org.application}

                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Weather & Irrigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs space-y-1">

                  <div className="flex items-center gap-1.5 font-bold text-[#a3b18a]">

                    <Droplets className="w-3.5 h-3.5" />

                    <span>{t('irrigationAdvice')}</span>

                  </div>

                  <p className="text-[#f2f2e8]/70 text-[11px] leading-relaxed">
                    {scanResult.irrigationPrecaution}
                  </p>

                </div>

                <div className="p-3 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-xs space-y-1">

                  <div className="flex items-center gap-1.5 font-bold text-amber-300">

                    <CloudSun className="w-3.5 h-3.5" />

                    <span>{t('weatherPrecaution')}</span>

                  </div>

                  <p className="text-[#f2f2e8]/70 text-[11px] leading-relaxed">
                    {scanResult.weatherAdvice}
                  </p>

                </div>

              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#a3b18a]/20">

                <button
                  onClick={() =>
                    onAskChatbot(
                      `I diagnosed ${scanResult.diseaseName} on my ${scanResult.cropName}. Can you give me more specific tips on how to prepare the spray and prevent recurrence?`
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#a3b18a] hover:bg-[#b5c49c] text-[#0a110a] font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >

                  <MessageSquareText className="w-4 h-4" />

                  <span>
                    {t('btnAskChatbotAboutThis')}
                  </span>

                </button>

                <div className="flex items-center gap-2">

                  <button
                    onClick={printDiagnosticReport}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/30 text-[#f2f2e8] text-xs uppercase tracking-wider font-semibold"
                  >

                    <Printer className="w-3.5 h-3.5 text-[#a3b18a]" />

                    <span>Print Report</span>

                  </button>

                  <button
                    onClick={() => {
                      setScanResult(null);
                      setSelectedImage(null);
                      setErrorMsg(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#141d14] hover:bg-[#1a241a] border border-[#a3b18a]/20 text-[#f2f2e8]/80 text-xs uppercase tracking-wider font-semibold"
                  >

                    <RotateCcw className="w-3.5 h-3.5" />

                    <span>Scan Another</span>

                  </button>

                </div>

              </div>

            </div>
          ) : (

            /* Idle Placeholder */
            <div className="p-8 sm:p-12 rounded-xl custom-glass border border-soft text-center space-y-4">

              <div className="w-14 h-14 rounded-full bg-[#a3b18a]/10 border border-[#a3b18a]/20 flex items-center justify-center text-[#a3b18a] mx-auto">

                <Scan className="w-6 h-6" />

              </div>

              <div className="space-y-1.5 max-w-md mx-auto">

                <h3 className="text-base font-semibold uppercase tracking-wider text-[#f2f2e8]">
                  Awaiting Image for Diagnosis
                </h3>

                <p className="text-xs text-[#f2f2e8]/60 leading-relaxed font-light">

                  Select any sample leaf on the left or upload your crop photo, then click{' '}

                  <span className="text-[#a3b18a] font-semibold">
                    "Analyze Symptoms with AI"
                  </span>

                  {' '}to receive verified ICAR treatment dosages.

                </p>

              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-4 text-left">

                <div className="p-2.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[11px]">

                  <p className="font-bold text-[#a3b18a] uppercase tracking-wider text-[10px]">
                    1. Instant CV
                  </p>

                  <p className="text-[#f2f2e8]/50 text-[10px]">
                    Identifies 30+ crop diseases
                  </p>

                </div>

                <div className="p-2.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[11px]">

                  <p className="font-bold text-[#a3b18a] uppercase tracking-wider text-[10px]">
                    2. Dosage
                  </p>

                  <p className="text-[#f2f2e8]/50 text-[10px]">
                    Exact ml/g per liter
                  </p>

                </div>

                <div className="p-2.5 rounded-lg bg-[#141d14] border border-[#a3b18a]/20 text-[11px]">

                  <p className="font-bold text-[#a3b18a] uppercase tracking-wider text-[10px]">
                    3. Organic
                  </p>

                  <p className="text-[#f2f2e8]/50 text-[10px]">
                    Bio-fungicide remedies
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};