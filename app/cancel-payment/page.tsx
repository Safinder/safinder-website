import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

export default function CancelPaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-md">
        {/* Cancel Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ backgroundColor: '#FDDFE4' }}></div>
              <div className="relative rounded-full p-4" style={{ backgroundColor: '#FDDFE4' }}>
                <XCircle className="w-16 h-16" style={{ color: '#f33955' }} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#101828' }}>
            Pago cancelado
          </h1>
          <p className="text-base mb-8" style={{ color: '#667085' }}>
            Tu transacción no se completó. No se realizaron cargos a tu cuenta.
          </p>

          {/* Info Box */}
          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FEF0C7' }}>
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F79009' }} />
              <div className="text-left">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#7A2E0E' }}>
                  ¿Qué pasó?
                </h3>
                <p className="text-sm" style={{ color: '#7A2E0E' }}>
                  El proceso de pago fue interrumpido o cancelado. Los artículos de tu carrito siguen guardados.
                </p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          {/* <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#667085' }}>Session ID</span>
                <span className="text-sm font-mono" style={{ color: '#344054' }}>SES-2025-1005-4893</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#667085' }}>Cancelled At</span>
                <span className="text-sm" style={{ color: '#344054' }}>Oct 5, 2025 - 14:35</span>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          {/* <div className="space-y-3">
            <button className="w-full rounded-xl py-4 px-6 font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90" 
                    style={{ backgroundColor: '#ff7db0' }}>
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <button className="w-full rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90" 
                    style={{ backgroundColor: '#F2F4F7', color: '#344054' }}>
              <ArrowLeft className="w-5 h-5" />
              Return to Cart
            </button>
          </div> */}

          {/* Continue Button */}
          {/* <button className="w-full mt-6 text-base font-medium transition-all hover:opacity-70" 
                    style={{ color: '#667085' }}>
              Continuar comprando
            </button> */}
        </div>

        {/* Support Text */}
        <p className="text-center text-sm mt-6" style={{ color: '#98A2B3' }}>
          ¿Tienes problemas? <a href="mailto:soporte@safinder.es" className="font-medium" style={{ color: '#ff7db0' }}>Contacta Soporte</a>
        </p>
      </div>
    </div>
  );
}