export type PrinterStatus = 'online' | 'offline';

export type JobStatus = 'Gedruckt' | 'Warteschlange' | 'Fehler: Im Docker gespeichert';

export interface PrintJob {
  id: string;
  supplier: string;
  itemCount: number;
  timestamp: string;
  status: JobStatus;
}

interface AppState {
  serverStartTime: number;
  printerStatus: PrinterStatus;
  jobs: PrintJob[];
}

// Global in-memory state
declare global {
  var appState: AppState | undefined;
}

if (!global.appState) {
  global.appState = {
    serverStartTime: Date.now(),
    printerStatus: 'online',
    jobs: [],
  };
}

export const getAppState = () => global.appState!;

export const updatePrinterStatus = (status: PrinterStatus) => {
  const state = getAppState();
  state.printerStatus = status;

  if (status === 'online') {
    // Process queued jobs
    state.jobs = state.jobs.map(job => {
      if (job.status !== 'Gedruckt') {
        return { ...job, status: 'Gedruckt' };
      }
      return job;
    });
  }
};

export const addJob = (supplier: string, itemCount: number) => {
  const state = getAppState();
  const id = `JOB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  const status: JobStatus = state.printerStatus === 'online' ? 'Gedruckt' : 'Fehler: Im Docker gespeichert';

  const newJob: PrintJob = {
    id,
    supplier,
    itemCount,
    timestamp: new Date().toISOString(),
    status,
  };

  state.jobs.unshift(newJob);
  // Keep only the last 100 jobs to avoid memory leak
  if (state.jobs.length > 100) {
    state.jobs.pop();
  }

  return newJob;
};
