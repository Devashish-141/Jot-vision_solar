'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jobService } from '@/lib/supabase/service';
import { MELBOURNE_COORDS } from '@/lib/constants';
import type { Job, StaffLocation } from '@/lib/types';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: MELBOURNE_COORDS.lat,
  lng: MELBOURNE_COORDS.lng,
};

const createStaffIcon = () => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="16" fill="#5C8F5A" stroke="white" stroke-width="2"/>
  <svg x="8" y="8" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-2 2v8.36a2 2 0 0 0 2 2h.01"/>
    <circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
  </svg>
</svg>
`)}`;

const createJobIcon = () => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="#E3A25B" stroke="white" stroke-width="2"/>
</svg>
`)}`;

export function DispatchMap({ onNewJob, refreshKey }: { onNewJob: () => void; refreshKey?: number }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [staffLocations, setStaffLocations] = useState<StaffLocation[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffLocation | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, staffData] = await Promise.all([
          jobService.fetchJobs(),
          jobService.fetchStaffLocations()
        ]);
        setJobs(jobsData);
        setStaffLocations(staffData as StaffLocation[]);
      } catch (error) {
        console.error('Failed to load map data:', error);
      }
    }
    if (isLoaded) loadData();
  }, [isLoaded, refreshKey]);

  if (loadError) {
    return (
      <div className="flex-1 relative h-full min-w-0 flex items-center justify-center bg-gray-50 border-r border-light-gray">
        <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          Error loading Google Maps. Check your API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex-1 relative h-full min-w-0 flex items-center justify-center bg-gray-50 border-r border-light-gray">
        <div className="w-8 h-8 border-4 border-vision-green/30 border-t-vision-green rounded-full animate-spin" />
      </div>
    );
  }

  const jobOffsets = [
    { lat: 0.02, lng: -0.03 },
    { lat: -0.015, lng: 0.04 },
    { lat: 0.03, lng: 0.02 },
  ];

  const jobsToDisplay = jobs.filter(j => j.status === 'Work Order' && j.scheduled_date);

  return (
    <div className="flex-1 relative h-full min-w-0">
      <div className="absolute inset-0 z-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={defaultCenter}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {/* Staff Markers */}
          {staffLocations.map((loc) => (
            <MarkerF
              key={loc.id}
              position={{ lat: Number(loc.latitude), lng: Number(loc.longitude) }}
              icon={{
                url: createStaffIcon(),
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
              }}
              onClick={() => {
                setSelectedJob(null);
                setSelectedStaff(loc);
              }}
            />
          ))}

          {/* Job Markers */}
          {jobsToDisplay.map((job, i) => {
            const offset = jobOffsets[i % jobOffsets.length];
            return (
              <MarkerF
                key={job.id}
                position={{
                  lat: MELBOURNE_COORDS.lat + offset.lat,
                  lng: MELBOURNE_COORDS.lng + offset.lng,
                }}
                icon={{
                  url: createJobIcon(),
                  scaledSize: new window.google.maps.Size(24, 24),
                  anchor: new window.google.maps.Point(12, 12),
                }}
                onClick={() => {
                  setSelectedStaff(null);
                  setSelectedJob(job);
                }}
              />
            );
          })}

          {/* Info Windows */}
          {selectedStaff && (
            <InfoWindowF
              position={{ lat: selectedStaff.latitude, lng: selectedStaff.longitude }}
              onCloseClick={() => setSelectedStaff(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -20) }}
            >
              <div className="font-sans px-1 pb-1">
                <strong className="text-gray-900 block">{selectedStaff.profile?.full_name}</strong>
                <span className="text-gray-500 text-xs block">{selectedStaff.profile?.status}</span>
              </div>
            </InfoWindowF>
          )}

          {selectedJob && (
            <InfoWindowF
              position={{
                lat: MELBOURNE_COORDS.lat + jobOffsets[jobsToDisplay.indexOf(selectedJob) % jobOffsets.length].lat,
                lng: MELBOURNE_COORDS.lng + jobOffsets[jobsToDisplay.indexOf(selectedJob) % jobOffsets.length].lng,
              }}
              onCloseClick={() => setSelectedJob(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -12) }}
            >
              <div className="font-sans px-1 pb-1 max-w-[200px]">
                <strong className="text-gray-900 block mb-0.5">{selectedJob.job_number}</strong>
                <span className="text-gray-600 text-xs block truncate">{selectedJob.client?.first_name} {selectedJob.client?.last_name}</span>
                <span className="text-gray-500 text-[11px] block leading-tight mt-1">{selectedJob.address}</span>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>


      {/* Map legend */}
      <div className="absolute bottom-6 left-4 z-[10] bg-white/90 backdrop-blur-sm rounded-lg border border-light-gray p-3 shadow-sm">
        <p className="text-xs font-semibold text-charcoal mb-2">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vision-green border border-white shadow-sm" />
            <span className="text-xs text-dark-gray">Staff Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-solar-orange border border-white shadow-sm" />
            <span className="text-xs text-dark-gray">Job Site</span>
          </div>
        </div>
      </div>
    </div>
  );
}
