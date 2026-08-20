import { useCallback, useEffect, useState } from 'react';
import ExperimentFrame from './ExperimentFrame';
import { PLACES, weatherSentence } from './labData';

function choosePlace(previous) {
  const options = previous ? PLACES.filter((place) => place.name !== previous.name) : PLACES;
  return options[Math.floor(Math.random() * options.length)];
}

function localTime(timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
}

export default function Somewhere() {
  const [place, setPlace] = useState(() => choosePlace());
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');

  const loadWeather = useCallback(async (selected, signal) => {
    setStatus('loading');
    setWeather(null);
    try {
      const params = new URLSearchParams({
        latitude: selected.latitude,
        longitude: selected.longitude,
        current: 'temperature_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        timezone: 'auto',
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
      if (!response.ok) throw new Error('weather unavailable');
      const payload = await response.json();
      setWeather(payload.current);
      setStatus('ready');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadWeather(place, controller.signal);
    return () => controller.abort();
  }, [place, loadWeather]);

  return (
    <ExperimentFrame
      number="003"
      title="Somewhere, It Is…"
      question="A live postcard from a place that did not ask to be observed."
    >
      <div className="somewhere" aria-live="polite">
        <div className="somewhere__coordinates">
          {place.latitude.toFixed(4)}° / {place.longitude.toFixed(4)}°
        </div>
        <p>Somewhere in <strong>{place.name}</strong>, it is <strong>{localTime(place.timezone)}</strong>.</p>
        {status === 'loading' && <p className="somewhere__weather">The atmosphere is being consulted.</p>}
        {status === 'error' && <p className="somewhere__weather">The weather station declined to comment.</p>}
        {weather && (
          <>
            <p className="somewhere__weather">{weatherSentence(weather.weather_code)}.</p>
            <div className="somewhere__readings">
              <span>{Math.round(weather.temperature_2m)}°C</span>
              <span>WIND {Math.round(weather.wind_speed_10m)} KM/H</span>
              <span>{weather.is_day ? 'DAYLIGHT' : 'AFTER DARK'}</span>
            </div>
          </>
        )}
        <small>{place.country} / WEATHER OBSERVATION VIA OPEN-METEO</small>
        <button type="button" onClick={() => setPlace((current) => choosePlace(current))}>
          TAKE ME SOMEWHERE ELSE
        </button>
      </div>
    </ExperimentFrame>
  );
}
