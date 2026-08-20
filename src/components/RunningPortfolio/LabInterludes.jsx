import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  PLACES,
  composeOmen,
  omenClosingFamily,
  weatherFamily,
  weatherSentence,
} from '../../lab/labData';

const ISTANBUL = { latitude: 41.0082, longitude: 28.9784 };

function istanbulDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function inlineWeather(code) {
  return weatherSentence(code).replace(/^the sky is /, '');
}

export function SomewhereInterlude() {
  const [place] = useState(() => PLACES[Math.floor(Math.random() * PLACES.length)]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current: 'temperature_2m,weather_code,is_day',
      timezone: place.timezone,
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('weather unavailable');
        return response.json();
      })
      .then((payload) => setWeather(payload.current))
      .catch((error) => {
        if (error.name !== 'AbortError') setWeather(null);
      });

    return () => controller.abort();
  }, [place]);

  return (
    <aside className="rp-lab-interlude rp-somewhere-interlude" aria-label="Somewhere, It Is lab interlude">
      <div className="rp-lab-interlude__meta">
        <span>LAB / 003</span>
        <span>{place.name.toUpperCase()} / {place.country.toUpperCase()}</span>
      </div>
      {weather ? (
        <p>
          Somewhere in <strong>{place.name}</strong>, it is{' '}
          <strong>{Math.round(weather.temperature_2m)}°C</strong> and {inlineWeather(weather.weather_code)}.
        </p>
      ) : (
        <p>Somewhere in <strong>{place.name}</strong>, the weather is still arriving.</p>
      )}
      <Link to="/lab/somewhere">OPEN INSTRUMENT <ArrowUpRight size={13} aria-hidden="true" /></Link>
    </aside>
  );
}

export function MinorOmenInterlude() {
  const [weather, setWeather] = useState(null);
  const date = istanbulDate();

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: ISTANBUL.latitude,
      longitude: ISTANBUL.longitude,
      current: 'temperature_2m,weather_code,is_day',
      timezone: 'Europe/Istanbul',
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('weather unavailable');
        return response.json();
      })
      .then((payload) => setWeather(payload.current))
      .catch((error) => {
        if (error.name !== 'AbortError') setWeather(null);
      });

    return () => controller.abort();
  }, []);

  const omen = useMemo(() => {
    const code = weather?.weather_code ?? 0;
    const seed = `${date}:${code}:${Math.round(weather?.temperature_2m || 0)}`;
    const family = weatherFamily(code);
    const closingFamily = omenClosingFamily(weather?.temperature_2m || 0, weather?.is_day ?? 1);
    return composeOmen(seed, family, closingFamily);
  }, [date, weather]);

  return (
    <aside className="rp-lab-interlude rp-omen-interlude" aria-label="Minor Omen lab interlude">
      <div className="rp-lab-interlude__meta">
        <span>LAB / 005 / MINOR OMEN</span>
        <span>{date} / ISTANBUL</span>
      </div>
      <blockquote>
        <p>{omen.opening}</p>
        <p>{omen.weatherLine}</p>
        <p className="rp-omen-interlude__closing">{omen.closing}</p>
      </blockquote>
      <div className="rp-omen-interlude__footer">
        <span>{weather ? weatherSentence(weather.weather_code).toUpperCase() : 'READING THE SKY'}</span>
        <Link to="/lab/minor-omen">OPEN INSTRUMENT <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </div>
    </aside>
  );
}
