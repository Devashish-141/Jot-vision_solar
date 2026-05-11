'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { WEATHER_THRESHOLDS, MELBOURNE_COORDS } from '@/lib/constants';
import type { WeatherData } from '@/lib/types';

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${MELBOURNE_COORDS.lat}&longitude=${MELBOURNE_COORDS.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=precipitation_probability_max&timezone=Australia%2FSydney&forecast_days=1`
        );
        const data = await res.json();
        const current = data.current;
        const daily = data.daily;

        const weatherCode = current.weather_code;
        let condition = 'Clear';
        let icon = 'sun';
        if (weatherCode >= 61) { condition = 'Rain'; icon = 'rain'; }
        else if (weatherCode >= 45) { condition = 'Cloudy'; icon = 'cloud'; }
        else if (weatherCode >= 2) { condition = 'Partly Cloudy'; icon = 'cloud'; }

        setWeather({
          temperature: Math.round(current.temperature_2m),
          condition,
          icon,
          wind_speed: Math.round(current.wind_speed_10m),
          rain_probability: daily.precipitation_probability_max?.[0] ?? 0,
          humidity: current.relative_humidity_2m,
        });
      } catch {
        // Fallback mock data
        setWeather({
          temperature: 18,
          condition: 'Partly Cloudy',
          icon: 'cloud',
          wind_speed: 15,
          rain_probability: 30,
          humidity: 65,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const showWarning = weather && (
    weather.rain_probability > WEATHER_THRESHOLDS.RAIN_PROBABILITY ||
    weather.wind_speed > WEATHER_THRESHOLDS.WIND_SPEED
  );

  const WeatherIcon = weather?.icon === 'rain' ? CloudRain : weather?.icon === 'cloud' ? Cloud : Sun;

  if (loading) {
    return (
      <Card className="card-hover border-light-gray">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 bg-light-gray rounded" />
            <div className="h-8 w-20 bg-light-gray rounded" />
            <div className="h-3 w-full bg-light-gray rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border-light-gray overflow-hidden">
      {showWarning && (
        <div className="bg-solar-orange text-white px-4 py-2.5 flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>⚠️ Weather Alert: Roof work may be impacted. Review dispatch schedule.</span>
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-mid-gray uppercase tracking-wider">Melbourne, VIC</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-charcoal">{weather?.temperature}°C</span>
              <span className="text-sm text-dark-gray">{weather?.condition}</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
            <WeatherIcon className="w-8 h-8 text-vision-green" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-dark-gray">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-mid-gray" />
            <span>{weather?.wind_speed} km/h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-mid-gray" />
            <span>{weather?.rain_probability}% rain</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-mid-gray" />
            <span>{weather?.humidity}% humidity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
