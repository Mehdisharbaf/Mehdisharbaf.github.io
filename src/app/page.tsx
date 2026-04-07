'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Server,
  Printer,
  RefreshCcw,
  PowerOff,
  Power,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PrinterStatus = 'online' | 'offline';
type JobStatus = 'Gedruckt' | 'Warteschlange' | 'Fehler: Im Docker gespeichert';

interface PrintJob {
  id: string;
  supplier: string;
  itemCount: number;
  timestamp: string;
  status: JobStatus;
}

interface AppState {
  uptime: string;
  printerStatus: PrinterStatus;
  jobs: PrintJob[];
}

export default function Dashboard() {
  const [state, setState] = useState<AppState>({
    uptime: '00:00:00',
    printerStatus: 'online',
    jobs: []
  });

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (error) {
      console.error('Failed to fetch state:', error);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const togglePrinter = async () => {
    const newStatus = state.printerStatus === 'online' ? 'offline' : 'online';
    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchState();
    } catch (error) {
      console.error('Failed to toggle printer:', error);
    }
  };

  const testWebhook = async () => {
    const suppliers = ['PetFood Express', 'Bio Tiernahrung GmbH', 'Premium Pet Supply'];
    const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const randomCount = Math.floor(Math.random() * 50) + 1;

    try {
      await fetch('/api/webhook/lieferschein', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier: randomSupplier, itemCount: randomCount }),
      });
      fetchState();
    } catch (error) {
      console.error('Failed to trigger webhook:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dr. Alder</h1>
                <p className="text-slate-400 text-sm font-medium">Smart Factory Gateway</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <Server className="h-5 w-5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase font-semibold">Gateway Uptime</span>
                <span className="text-sm font-mono text-emerald-400 font-medium">{state.uptime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Module 1: Printer Watchdog */}
          <section className="col-span-1 md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center space-x-3">
              <Printer className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-800">Drucker-Monitor</h2>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-6">
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center border-4 transition-colors duration-300",
                state.printerStatus === 'online'
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-red-50 border-red-200 text-red-600"
              )}>
                <Printer className="h-16 w-16" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {state.printerStatus === 'online' ? 'Online & Bereit' : 'Offline / Hardwarefehler'}
                </h3>
                <p className="text-slate-500 text-sm">Lokaler Etikettendrucker</p>
              </div>

              <button
                onClick={togglePrinter}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm",
                  state.printerStatus === 'online'
                    ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                )}
              >
                {state.printerStatus === 'online' ? (
                  <>
                    <PowerOff className="h-4 w-4" />
                    <span>Druckerausfall simulieren</span>
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4" />
                    <span>Drucker wiederherstellen</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Module 2: Lieferschein Print Queue */}
          <section className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-800">Warteschlange Lieferscheine</h2>
              </div>
              <button
                onClick={testWebhook}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md flex items-center space-x-2 transition-colors shadow-sm"
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Test Webhook</span>
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-3 px-5 font-medium">Job-ID</th>
                    <th className="py-3 px-5 font-medium">Lieferant</th>
                    <th className="py-3 px-5 font-medium">Zeit</th>
                    <th className="py-3 px-5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.jobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Keine Druckaufträge vorhanden
                      </td>
                    </tr>
                  ) : (
                    state.jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-5 font-mono text-sm text-slate-600">{job.id}</td>
                        <td className="py-3 px-5 font-medium text-slate-900">{job.supplier} <span className="text-xs text-slate-500 font-normal ml-1">({job.itemCount} Pos.)</span></td>
                        <td className="py-3 px-5 text-sm text-slate-500">
                          {new Date(job.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3 px-5">
                          <span className={cn(
                            "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            job.status === 'Gedruckt' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            job.status === 'Warteschlange' && "bg-amber-50 text-amber-700 border-amber-200",
                            job.status === 'Fehler: Im Docker gespeichert' && "bg-red-50 text-red-700 border-red-200"
                          )}>
                            {job.status === 'Gedruckt' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {job.status === 'Warteschlange' && <Clock className="h-3.5 w-3.5" />}
                            {job.status === 'Fehler: Im Docker gespeichert' && <AlertCircle className="h-3.5 w-3.5" />}
                            <span>{job.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
