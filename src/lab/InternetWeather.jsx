import { useCallback, useEffect, useMemo, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';

function readConditions(battery = null) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    online: navigator.onLine,
    visibility: document.visibilityState,
    effectiveType: connection?.effectiveType || 'unreported',
    downlink: Number.isFinite(connection?.downlink) ? connection.downlink : null,
    rtt: Number.isFinite(connection?.rtt) ? connection.rtt : null,
    saveData: Boolean(connection?.saveData),
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false,
    memory: navigator.deviceMemory || null,
    cores: navigator.hardwareConcurrency || null,
    battery: battery ? Math.round(battery.level * 100) : null,
    charging: battery?.charging ?? null,
    readAt: new Date(),
  };
}

function makeForecast(conditions) {
  if (!conditions.online) return 'A local outage is passing directly over this tab.';
  if (conditions.visibility === 'hidden') return 'Attention has moved behind the horizon.';
  if (conditions.saveData) return 'Conservation protocols are active. Expect a careful atmosphere.';
  if (conditions.rtt && conditions.rtt > 350) return 'High latency is settling in. Replies may arrive from the recent past.';
  if (conditions.effectiveType === '2g' || conditions.effectiveType === 'slow-2g') return 'A narrow connection front is moving slowly through the page.';
  if (conditions.battery !== null && conditions.battery < 20 && !conditions.charging) return 'Energy pressure is falling. Seek a stable source.';
  if (conditions.reducedMotion) return 'Movement is low by request. Visibility remains calm.';
  return 'Network pressure is stable. Minor distractions may develop without warning.';
}

export default function InternetWeather() {
  const [battery, setBattery] = useState(null);
  const [conditions, setConditions] = useState(() => readConditions());

  const scan = useCallback(() => setConditions(readConditions(battery)), [battery]);

  useEffect(() => {
    let mounted = true;
    let batteryManager;
    const updateBattery = () => {
      if (!mounted || !batteryManager) return;
      setBattery(batteryManager);
      setConditions(readConditions(batteryManager));
    };

    if (navigator.getBattery) {
      navigator.getBattery().then((manager) => {
        if (!mounted) return;
        batteryManager = manager;
        updateBattery();
        manager.addEventListener('levelchange', updateBattery);
        manager.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    window.addEventListener('online', scan);
    window.addEventListener('offline', scan);
    document.addEventListener('visibilitychange', scan);
    return () => {
      mounted = false;
      window.removeEventListener('online', scan);
      window.removeEventListener('offline', scan);
      document.removeEventListener('visibilitychange', scan);
      batteryManager?.removeEventListener('levelchange', updateBattery);
      batteryManager?.removeEventListener('chargingchange', updateBattery);
    };
  }, [scan]);

  const forecast = useMemo(() => makeForecast(conditions), [conditions]);
  const time = conditions.readAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <ExperimentFrame
      number="010"
      title="Internet Weather"
      question="A fictional forecast derived from the conditions around this browser."
    >
      <div className="internet-weather">
        <div className="internet-weather__forecast" aria-live="polite">
          <span>LOCAL FORECAST / {time}</span>
          <p>{forecast}</p>
        </div>
        <dl>
          <div><dt>CONNECTIVITY</dt><dd>{conditions.online ? 'ONLINE' : 'OFFLINE'}</dd></div>
          <div><dt>VISIBILITY</dt><dd>{conditions.visibility.toUpperCase()}</dd></div>
          <div><dt>NETWORK</dt><dd>{conditions.effectiveType.toUpperCase()}</dd></div>
          <div><dt>LATENCY</dt><dd>{conditions.rtt === null ? 'WITHHELD' : `${conditions.rtt} MS`}</dd></div>
          <div><dt>BATTERY</dt><dd>{conditions.battery === null ? 'WITHHELD' : `${conditions.battery}%${conditions.charging ? ' / CHARGING' : ''}`}</dd></div>
          <div><dt>MOTION</dt><dd>{conditions.reducedMotion ? 'REDUCED' : 'AVAILABLE'}</dd></div>
          <div><dt>MEMORY</dt><dd>{conditions.memory ? `${conditions.memory} GB` : 'WITHHELD'}</dd></div>
          <div><dt>LOGICAL CORES</dt><dd>{conditions.cores || 'WITHHELD'}</dd></div>
        </dl>
        <button type="button" onClick={scan}>RESCAN CONDITIONS</button>
        <small>All readings remain in this browser. Unsupported signals are reported as withheld.</small>
      </div>
    </ExperimentFrame>
  );
}
