import React, { useState } from 'react';
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const plans = [
  {
    id: 'monthly',
    name: 'Plan Mensual',
    price: 15,
    period: 'mes',
    description: 'Perfecto para probar y mantener flexibilidad',
    features: [
      'Acceso completo a todas las clases',
      'Meditaciones guiadas ilimitadas',
      'Progreso y gamificación',
      'Talleres incluidos',
      'Soporte prioritario'
    ],
    popular: false,
    color: 'blue'
  },
  {
    id: 'yearly',
    name: 'Plan Anual',
    price: 120,
    originalPrice: 180,
    period: 'año',
    description: '¡Ahorra €60 al año!',
    features: [
      'Acceso completo a todas las clases',
      'Meditaciones guiadas ilimitadas',
      'Progreso y gamificación',
      'Talleres incluidos',
      'Soporte prioritario',
      'Certificados de finalización',
      'Acceso anticipado a nuevo contenido'
    ],
    popular: true,
    color: 'green',
    badge: 'Más popular'
  }
];

const testimonials = [
  {
    name: 'Ana M.',
    text: 'Las clases de Lidia han transformado mi rutina diaria. Me siento más tranquila y fuerte.',
    role: 'Suscriptora anual'
  },
  {
    name: 'Carlos R.',
    text: 'Perfecto para mi horario. Puedo practicar cuando quiera y el seguimiento me mantiene motivado.',
    role: 'Suscriptor mensual'
  },
  {
    name: 'María L.',
    text: 'La gamificación hace que cada práctica sea más divertida. ¡Ya llevo 30 días seguidos!',
    role: 'Suscriptora anual'
  }
];

export default function Checkout() {
  const { user, isTrialActive } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const finalPrice = selectedPlanData ? 
    (appliedDiscount ? selectedPlanData.price * (1 - appliedDiscount) : selectedPlanData.price) : 0;

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Simulate Stripe payment flow
    try {
      // In real app, this would integrate with Stripe
      console.log('Processing subscription:', {
        plan: selectedPlan,
        coupon: couponCode,
        user: user?.email
      });

      // Mock success after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or back to app
      navigate('/', { 
        replace: true,
        state: { message: 'Suscripción activada correctamente' }
      });
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'exalumno50') {
      setAppliedDiscount(0.5);
    } else if (couponCode.toLowerCase() === 'bienvenida20') {
      setAppliedDiscount(0.2);
    } else {
      alert('Código de cupón no válido');
    }
  };

  const trialDaysRemaining = user && isTrialActive() && user.trial_ends_at ? 
    Math.ceil((new Date(user.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Elige tu plan
            </h1>
            <p className="text-gray-600 mt-1">
              Acceso completo a toda la plataforma
            </p>
          </div>
        </div>

        {/* Trial info */}
        {user && isTrialActive() && (
          <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-center text-center">
              <div>
                <h3 className="font-semibold text-amber-900">
                  Tu prueba gratuita vence en {trialDaysRemaining} días
                </h3>
                <p className="text-amber-700 text-sm">
                  Suscríbete ahora para continuar disfrutando de todo el contenido
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plans */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? plan.color === 'green' 
                        ? 'border-green-500 shadow-green-100' 
                        : 'border-blue-500 shadow-blue-100'
                      : 'border-gray-200 hover:border-gray-300'
                  } shadow-lg`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {/* Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  {selectedPlan === plan.id && (
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                      plan.color === 'green' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold text-gray-900">
                          €{plan.price}
                        </span>
                        <span className="text-gray-600">/{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg text-gray-400 line-through">
                            €{plan.originalPrice}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            Ahorra €{plan.originalPrice - plan.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Lo que dicen nuestros miembros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-3 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h3>

            {selectedPlanData && (
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">{selectedPlanData.name}</span>
                  <span className="font-semibold">€{selectedPlanData.price}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({(appliedDiscount * 100)}%)</span>
                    <span>-€{(selectedPlanData.price * appliedDiscount).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>€{finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de descuento
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ej: EXALUMNO50"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Aplicar
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Códigos disponibles:</p>
                <p>• EXALUMNO50 - 50% de descuento</p>
                <p>• BIENVENIDA20 - 20% de descuento</p>
              </div>
            </div>

            {/* Subscribe Button */}
            {user ? (
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  'Suscribirse ahora'
                )}
              </button>
            ) : (
              <Link
                to="/auth"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
              >
                Inicia sesión para suscribirte
              </Link>
            )}

            {/* Security badges */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>Activación inmediata</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                🔒 Pago seguro con Stripe • Cancela en cualquier momento
              </p>
            </div>

            {/* Money back guarantee */}
            <div className="mt-4 bg-green-50 rounded-lg p-3 text-center">
              <Crown className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-900">
                Garantía de 30 días
              </p>
              <p className="text-xs text-green-700">
                Si no estás satisfecha, te devolvemos tu dinero
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}