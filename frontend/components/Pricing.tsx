'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: ['Data Visualization', 'Real-Time Analytics', 'Customization'],
    desc: 'Small businesses and startups looking to gain data insights',
    buttonColor: 'bg-zinc-900 text-white',
    borderColor: 'border-zinc-200',
    highlight: false
  },
  {
    name: 'Business',
    price: 79,
    features: ['All Basic Plan Features', 'Integrations', 'Advanced Reporting'],
    desc: 'Growing businesses that need comprehensive data management and teamwork features',
    buttonColor: 'bg-[#a3e635] text-black',
    borderColor: 'border-[#a3e635]',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 149,
    features: ['All Pro Plan Features', 'Full Access to API', 'Dedicated Support'],
    desc: 'Larger enterprises requiring advanced data solutions and personalized support.',
    buttonColor: 'bg-zinc-900 text-white',
    borderColor: 'border-zinc-200',
    highlight: false
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-32 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-zinc-900 mb-12">Pricing</h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <span className={billingCycle === 'monthly' ? 'text-zinc-900' : 'text-zinc-400'}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-zinc-100 rounded-full p-1 relative flex items-center transition-colors"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                className="w-5 h-5 bg-black rounded-full shadow-sm"
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'text-zinc-900' : 'text-zinc-400'}>Yearly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[2.5rem] border-2 ${plan.borderColor} bg-white flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]`}
            >
              <h3 className="text-3xl font-bold text-zinc-900 mb-8">{plan.name}</h3>
              
              <div className="flex items-start justify-center mb-10 text-zinc-900">
                <span className="text-3xl font-bold mt-1">$</span>
                <span className="text-7xl font-bold tracking-tighter">{plan.price}</span>
              </div>

              <ul className="space-y-4 mb-10 w-full">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-zinc-600 text-[15px] font-medium">
                    <Check size={18} className="text-zinc-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-start gap-3 text-left mb-12 bg-zinc-50/50 p-4 rounded-2xl">
                <Info size={18} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                  {plan.desc}
                </p>
              </div>

              <button className={`w-full py-4 rounded-full ${plan.buttonColor} font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg`}>
                Learn More
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
