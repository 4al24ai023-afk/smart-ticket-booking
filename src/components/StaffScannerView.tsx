import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { VerificationResult, User as AuthUser, Ticket } from '../types';
import { ticketService } from '../services/ticketService';

interface StaffScannerViewProps {
  currentUser: AuthUser;
}

export const StaffScannerView: React.FC<StaffScannerViewProps> = ({ currentUser }) => {
  const [manualInput, setManualInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const checkInLogs = ticketService.getCheckInLogs();
  const allTickets = ticketService.getTickets();

  // Play synthesized audio tones using Web Audio API
  const playFeedbackTone = (type: 'success' | 'warning' | 'error') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        // High pleasant ding
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'warning') {
        // Double warning buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        // Low error buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Camera handling
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. Use manual ticket code entry below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleVerify = (tokenOrNumber: string) => {
    if (!tokenOrNumber.trim()) return;
    
    const staffName = currentUser.name || 'Gate Officer';
    const result = ticketService.verifyAndAdmitTicket(tokenOrNumber.trim(), staffName);
    setVerificationResult(result);

    if (result.status === 'valid') {
      playFeedbackTone('success');
    } else if (result.status === 'already_used') {
      playFeedbackTone('warning');
    } else {
      playFeedbackTone('error');
    }

    setManualInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Gate Terminal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Gate Staff Operations Terminal</span>
            <span aria-hidden="true">·</span>
            <span>Staff: {currentUser.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ticket Verification & Gate Check-In
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scan attendee QR codes to verify authenticity, prevent duplicate entry, and record attendance.
          </p>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scanner & Manual Verification (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Camera Viewfinder Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>Live Camera Scanner</span>
              </span>

              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium rounded-lg transition-colors"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Stop Camera</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Camera</span>
                </button>
              )}
            </div>

            <div className="relative h-64 sm:h-72 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scan overlay target reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-indigo-400/80 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-400 -mt-1 -ml-1 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-400 -mt-1 -mr-1 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-400 -mb-1 -ml-1 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-400 -mb-1 -mr-1 rounded-br" />
                      {/* Animated scanning line */}
                      <div className="w-full h-0.5 bg-indigo-400/80 shadow-[0_0_12px_#6366f1] animate-bounce" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Camera Scanner Inactive
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                    Click "Start Camera" to scan paper or phone QR passes directly, or enter code below.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                  >
                    Enable Camera Scan
                  </button>
                  {cameraError && (
                    <div className="mt-3 text-xs text-amber-400 max-w-xs mx-auto">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Manual Ticket Code Entry Form */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Manual Ticket Verification
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Enter the unique ticket number (e.g. <code>TK-8491-01</code>) or the tamper-proof QR token string:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(manualInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Scan or type ticket number / QR token..."
                className="flex-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Verify Gate Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Quick Test with Existing Passes:
              </span>
              <div className="flex flex-wrap gap-2">
                {allTickets.slice(0, 3).map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => handleVerify(ticket.ticketNumber)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded-lg border border-slate-700 transition-colors"
                  >
                    {ticket.ticketNumber} ({ticket.status})
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleVerify('FAKE-COUNTERFEIT-TICKET-TOKEN')}
                  className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 text-[11px] font-mono rounded-lg border border-rose-800/60 transition-colors"
                >
                  Test Invalid Code
                </button>
              </div>
            </div>
          </div>

          {/* Verification Status Result Card */}
          {verificationResult && (
            <div
              className={`p-6 rounded-2xl border shadow-2xl transition-all ${
                verificationResult.status === 'valid'
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-emerald-900/20'
                  : verificationResult.status === 'already_used'
                  ? 'bg-amber-950/40 border-amber-500/80 text-amber-100 shadow-amber-900/20'
                  : 'bg-rose-950/40 border-rose-500/80 text-rose-100 shadow-rose-900/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    verificationResult.status === 'valid'
                      ? 'bg-emerald-500 text-slate-950'
                      : verificationResult.status === 'already_used'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-rose-500 text-slate-950'
                  }`}
                >
                  {verificationResult.status === 'valid' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : verificationResult.status === 'already_used' ? (
                    <AlertCircle className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-widest ${
                        verificationResult.status === 'valid'
                          ? 'text-emerald-400'
                          : verificationResult.status === 'already_used'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {verificationResult.status === 'valid'
                        ? 'STATUS: ENTRY GRANTED'
                        : verificationResult.status === 'already_used'
                        ? 'STATUS: DUPLICATE BLOCKED'
                        : verificationResult.status === 'cancelled'
                        ? 'STATUS: CANCELLED PASS'
                        : 'STATUS: INVALID / COUNTERFEIT'}
                    </span>
                    <span className="text-[11px] opacity-75 font-mono">
                      {new Date(verificationResult.scannedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold mt-1 mb-3 text-white">
                    {verificationResult.message}
                  </p>

                  {verificationResult.ticket && (
                    <div className="grid grid-cols-2 gap-2 p-3 bg-black/40 rounded-xl text-xs border border-white/10 text-slate-200">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Attendee Name</span>
                        <strong className="text-white text-xs">{verificationResult.ticket.attendeeName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Tier Level</span>
                        <strong className="text-white text-xs">{verificationResult.ticket.tierName}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[10px] block">Event Title</span>
                        <strong className="text-white text-xs">{verificationResult.ticket.eventTitle}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Ticket Number</span>
                        <span className="font-mono text-white text-xs">{verificationResult.ticket.ticketNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Booking Ref</span>
                        <span className="font-mono text-white text-xs">{verificationResult.ticket.bookingReference}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Gate Check-in Audit Stream (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
            <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <span>Live Gate Check-In Stream</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {checkInLogs.length} Scans Logged
              </span>
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-h-[580px] space-y-3">
              {checkInLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No scan logs recorded yet during this session.
                </div>
              ) : (
                checkInLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-white">
                        {log.ticketNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.status === 'admitted'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : log.status === 'duplicate_blocked'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                        }`}
                      >
                        {log.status === 'admitted' ? 'ADMITTED' : log.status === 'duplicate_blocked' ? 'DUPLICATE' : 'BLOCKED'}
                      </span>
                    </div>

                    <div className="text-slate-300 font-medium">
                      {log.attendeeName} · <span className="text-slate-400">{log.tierName}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>{log.eventTitle}</span>
                      <span className="font-mono">{new Date(log.scannedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
