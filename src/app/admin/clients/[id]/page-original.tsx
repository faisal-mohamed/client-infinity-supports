'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaEdit, FaArrowLeft, FaFileAlt, FaUser, FaIdCard,
  FaCalendarAlt, FaMapMarkerAlt, FaHistory, FaEnvelope,
  FaPhone, FaVenusMars, FaGlobe, FaClipboardList
} from 'react-icons/fa';
import { getClient } from '@/lib/api';

// Renders text on a single line and automatically reduces font size
// to fit within the available container width. Uses discrete Tailwind
// size classes from largest to smallest.
function OneLineAutoSize({
  text,
  className = '',
  sizes,
}: {
  text: string;
  className?: string;
  sizes: string[]; // e.g., ['text-xl','text-lg','text-base','text-sm']
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [appliedSize, setAppliedSize] = useState<string>(sizes[0] || 'text-base');

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const compute = () => {
      for (let i = 0; i < sizes.length; i++) {
        const sizeClass = sizes[i];
        // apply class to measurement element and check fit
        measure.className = `invisible absolute whitespace-nowrap ${className} ${sizeClass}`;
        const fits = measure.scrollWidth <= container.clientWidth;
        if (fits || i === sizes.length - 1) {
          setAppliedSize(sizeClass);
          break;
        }
      }
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [text, className, sizes]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Hidden measuring element */}
      <span ref={measureRef}>{text}</span>
      {/* Visible text */}
      <p className={`whitespace-nowrap ${className} ${appliedSize}`}>{text}</p>
    </div>
  );
}

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
      setError('Invalid client ID');
      setLoading(false);
      return;
    }

    const loadClient = async () => {
      try {
        setLoading(true);
        const data = await getClient(id);
        setClient(data);
        setError('');
      } catch (err) {
        setError('Failed to load client details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);


  useEffect(() => {
    console.log(client, id);
  }, [client])

    if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex justify-center items-center min-h-[60vh]">
         <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex justify-center items-center min-h-[60vh]">
              <div className="text-center">
                {/* Spinner */}
                <div className="w-8 h-8 border-2 border-azure-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>

                {/* Text */}
                <h3 className="text-sm text-azure-400">
                    Loading Client Info
                </h3>
                <p className="text-azure-500 font-medium">
                  Please wait while we load the client Information...
                </p>

                {/* Bouncing dots */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
      </div>
      </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-4 border border-red-200">
              <div className="p-6 rounded-full bg-red-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaUser className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-red-800 mb-3">Client Not Found</h1>
              <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-soft"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
         {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-soft border border-azure-100/60 p-6 mb-6 transition-shadow duration-300">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="flex items-center gap-6">
      <button
        onClick={() => router.back()}
        className="p-3 rounded-xl bg-azure-100 text-azure-600 hover:from-azure-200 hover:to-azure-200 transition-all duration-200 shadow-md  "
        aria-label="Go back"
      >
        <FaArrowLeft className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 bg-azure-700 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-3xl font-bold text-white">
              {client?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-azure-700 mb-2 break-words leading-tight">
            {client?.commonFields?.name && client?.commonFields?.surname 
              ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
              : client?.name || 'Unknown Client'
            }
          </h1>
          <div className="flex items-center gap-4 text-sm text-azure-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
              <span className="font-medium">ID: {client.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="h-3 w-3 text-azure-300" />
              <span>Created: {new Date(client?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/admin/clients/${id}/forms`}
        className="flex items-center gap-2 text-sm text-white bg-azure-700 hover:bg-azure-600 transition-all duration-200 px-6 py-3 rounded-xl shadow-soft font-semibold"
      >
        <FaFileAlt className="h-4 w-4" /> 
        Client Forms
      </Link>
    </div>
  </div>
</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
     


        {/* Client Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Enhanced Basic Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-azure-100/60 overflow-hidden transition-all duration-200">
            <div className="px-8 py-6 bg-azure-50/50 border-b border-azure-100">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-azure-500 to-azure-600 text-white shadow-md">
                  <FaUser className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-azure-700">Basic Information</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="bg-azure-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                      <FaUser className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-azure-400 mb-1">Full Name</p>
                      <OneLineAutoSize
                        text={
                          (client?.commonFields?.name && client?.commonFields?.surname
                            ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
                            : client?.name || 'Not provided') as string
                        }
                        sizes={["text-2xl","text-xl","text-lg","text-base","text-sm"]}
                        className="font-bold text-azure-700 leading-tight"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-azure-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-azure-100 text-azure-700">
                      <FaEnvelope className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-azure-400 mb-1">Email Address</p>
                      <OneLineAutoSize
                        text={(client?.commonFields?.email || client?.email || 'Not provided') as string}
                        sizes={["text-lg","text-base","text-sm","text-xs"]}
                        className="font-semibold text-azure-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-azure-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <FaPhone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-azure-400 mb-1">Phone Number</p>
                      <p className="font-semibold text-azure-700 break-words leading-tight">
                        {client?.commonFields?.phone || client?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-azure-50 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                      <FaCalendarAlt className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-azure-400 mb-1">Account Created</p>
                      <p className="font-semibold text-azure-700">
                        {new Date(client?.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Personal Details */}
          <div className="bg-white rounded-2xl shadow-soft border border-azure-100/60 overflow-hidden transition-all duration-200">
            <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <FaIdCard className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-azure-700">Personal Details</h2>
              </div>
            </div>
            <div className="p-8">
              {client.commonFields ? (
                <div className="space-y-6">
                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaIdCard className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-azure-400 mb-1">NDIS Number</p>
                        <p className="font-bold text-azure-700">{client?.commonFields?.ndis || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                        <FaCalendarAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-azure-400 mb-1">Date of Birth</p>
                        <p className="font-bold text-azure-700">{client?.commonFields?.dob || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                        <FaVenusMars className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-azure-400 mb-1">Gender</p>
                        <p className="font-bold text-azure-700">{client?.commonFields?.sex || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-6 rounded-full bg-azure-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaIdCard className="h-12 w-12 text-azure-300" />
                  </div>
                  <h3 className="text-sm text-azure-400">No Personal Details</h3>
                  <p className="text-azure-400">Personal information has not been provided yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Address Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-azure-100/60 overflow-hidden transition-all duration-200">
            <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                  <FaMapMarkerAlt className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-azure-700">Address Information</h2>
              </div>
            </div>
            <div className="p-8">
              {client?.commonFields ? (
                <div className="space-y-6">
                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-azure-400 mb-1">Street Address</p>
                        <p className="font-bold text-azure-700 break-words leading-tight">
                          {client?.commonFields?.address || client?.commonFields?.street || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                        <FaGlobe className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-azure-400 mb-1">State</p>
                        <p className="font-bold text-azure-700 break-words leading-tight">
                          {client?.commonFields?.state || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-azure-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-azure-400 mb-1">Postcode</p>
                        <p className="font-bold text-azure-700 break-words leading-tight">
                          {client?.commonFields?.postCode || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-6 rounded-full bg-azure-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaMapMarkerAlt className="h-12 w-12 text-azure-300" />
                  </div>
                  <h3 className="text-sm text-azure-400">No Address Information</h3>
                  <p className="text-azure-400">Address details have not been provided yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Disability/Conditions */}
        {client?.commonFields && client?.commonFields?.disability && (
          <div className="bg-white rounded-2xl shadow-soft border border-azure-100/60 overflow-hidden mb-8 transition-all duration-200">
            <div className="px-8 py-6 bg-azure-50/50 border-b border-azure-100">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-azure-500 to-azure-700 text-white shadow-md">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-azure-700">Disability & Conditions</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-azure-50 rounded-xl p-6">
                <p className="text-azure-600 whitespace-pre-line leading-relaxed text-base">
                  {client?.commonFields?.disability}
                </p>
              </div>
            </div>
          </div>
        )}

       
              </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
