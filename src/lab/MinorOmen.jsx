import { useEffect, useMemo, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import {
  composeOmen,
  omenClosingFamily,
  weatherFamily,
  weatherSentence,
} from './labData';

const ISTANBUL = { latitude: 41.0082, longitude: 28.9784 };

function istanbulDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function MinorOmen() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const date = istanbulDate();

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: ISTANBUL.latitude,
      longitude: ISTANBUL.longitude,
      current: 'temperature_2m,weather_code,is_day',
      daily: 'sunrise,sunset',
      timezone: 'Europe/Istanbul',
      forecast_days: '1',
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('weather unavailable');
        return response.json();
      })
      .then((payload) => {
        setWeather(payload);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, []);

  const omen = useMemo(() => {
    if (!weather?.current) return null;
    const code = weather?.current?.weather_code ?? 0;
    const family = weatherFamily(code);
    const seed = `${date}:${code}:${Math.round(weather?.current?.temperature_2m || 0)}`;
    const closingFamily = omenClosingFamily(
      weather?.current?.temperature_2m || 0,
      weather?.current?.is_day ?? 1
    );
    return {
      ...composeOmen(seed, family, closingFamily),
      number: 10 + (Math.abs(seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 89),
    };
  }, [date, weather]);

  const sunrise = weather?.daily?.sunrise?.[0]?.slice(-5);
  const sunset = weather?.daily?.sunset?.[0]?.slice(-5);

  return (
    <ExperimentFrame
      number="005"
      title="Minor Omen"
      question="One small, deterministic warning drawn from Istanbul's current conditions."
    >
      <div className="omen" aria-live="polite">
        <div className="omen__meta">
          <span>{omen ? `OMEN ${omen.number}` : 'READING THE SKY'}</span><span>{date}</span><span>ISTANBUL</span>
        </div>
        {omen && (
          <>
            <p>{omen.opening}</p>
            <p>{omen.weatherLine}</p>
            <p className="omen__closing">{omen.closing}</p>
          </>
        )}
        <div className="omen__conditions">
          {status === 'ready' && <span>{weatherSentence(weather.current.weather_code).toUpperCase()}</span>}
          {status === 'loading' && <span>READING THE SKY</span>}
          {status === 'error' && <span>THE SKY IS UNAVAILABLE; NO OMEN WAS DRAWN</span>}
          {sunrise && <span>SUNRISE {sunrise}</span>}
          {sunset && <span>SUNSET {sunset}</span>}
        </div>
        <small>Valid while conditions hold. Interpretation is the responsibility of the reader.</small>
      </div>
    </ExperimentFrame>
  );
}
