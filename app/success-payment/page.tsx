import React from 'react';
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';

export default function SuccessPaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
              <div className="relative bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16" style={{ color: '#12B76A' }} strokeWidth={2.5} />
              </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#101828' }}>
            ¡Éxito!
          </h1>
          <p className="text-base mb-8" style={{ color: '#667085' }}>
            Tu transacción se ha completado con éxito
          </p>

          {/* Payment Details */}
          {/* <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#667085' }}>Amount Paid</span>
                <span className="text-2xl font-bold" style={{ color: '#101828' }}>$149.99</span>
              </div>
              <div className="w-full h-px" style={{ backgroundColor: '#EAECF0' }}></div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#667085' }}>Transaction ID</span>
                <span className="text-sm font-mono" style={{ color: '#344054' }}>TXN-2025-1005-4892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#667085' }}>Date & Time</span>
                <span className="text-sm" style={{ color: '#344054' }}>Oct 5, 2025 - 14:32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#667085' }}>Payment Method</span>
                <span className="text-sm" style={{ color: '#344054' }}>•••• 4242</span>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          {/* <div className="space-y-3">
            <button className="w-full rounded-xl py-4 px-6 font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90" 
                    style={{ backgroundColor: '#ff7db0' }}>
              Download Receipt
              <Download className="w-5 h-5" />
            </button>
            
            <button className="w-full rounded-xl py-4 px-6 font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90" 
                    style={{ backgroundColor: '#F2F4F7', color: '#344054' }}>
              Email Receipt
              <Mail className="w-5 h-5" />
            </button>
          </div> */}

          {/* Continue Button */}
          {/* <button className="w-full mt-6 text-base font-medium flex items-center justify-center gap-2 transition-all hover:gap-3" 
                  style={{ color: '#ff7db0' }}>
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button> */}
        </div>

        {/* Support Text */}
        <p className="text-center text-sm mt-6" style={{ color: '#98A2B3' }}>
          ¿Necesitas ayuda? <a href="mailto:soporte@safinder.es" className="font-medium" style={{ color: '#ff7db0' }}>Contacta Soporte</a>
        </p>
      </div>
    </div>
  );
}