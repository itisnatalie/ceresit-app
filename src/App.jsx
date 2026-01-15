import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, MapPin, FileText, RotateCcw, Sparkles } from 'lucide-react';

const ChatbotPrototype = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m the Ceresit AI Assistant. How can I help you today?',
      options: [
        'Find a product',
        'Technical support',
        'Find a distributor',
        'System solutions',
        'Product certifications'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentFlow, setCurrentFlow] = useState(null);
  const [flowStep, setFlowStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const flows = {
    productFinder: {
      name: 'Product Finder',
      steps: [
        {
          question: 'What type of project are you working on?',
          options: ['Tiling', 'Facade/ETICS', 'Waterproofing', 'Repairs', 'Flooring']
        },
        {
          question: 'What is the substrate type?',
          options: ['Concrete', 'Brick', 'Plaster', 'Existing tiles', 'Wood']
        },
        {
          question: 'Is this for indoor or outdoor use?',
          options: ['Indoor', 'Outdoor', 'Both']
        },
        {
          question: 'Any special requirements?',
          options: ['Fast setting', 'Flexible', 'Waterproof', 'High adhesion', 'None']
        }
      ],
      result: {
        products: [
          {
            name: 'Ceresit CM 11 Plus',
            description: 'Adhesive for ceramic tiles',
            features: ['Indoor & outdoor', 'High adhesion', 'Easy to apply'],
            consumption: '1.5 kg/m²'
          },
          {
            name: 'Ceresit CM 17',
            description: 'Highly flexible adhesive',
            features: ['Flexible', 'Waterproof', 'For difficult substrates'],
            consumption: '1.3 kg/m²'
          }
        ]
      }
    },
    technicalSupport: {
      name: 'Technical Support',
      steps: [
        {
          question: 'Which Ceresit product are you using?',
          input: true,
          placeholder: 'e.g., CT 85, CM 11, CN 69'
        },
        {
          question: 'What issue are you experiencing?',
          options: ['Poor adhesion', 'Cracking', 'Slow drying', 'Application difficulty', 'Other']
        },
        {
          question: 'What is the current temperature?',
          options: ['Below 5°C', '5-15°C', '15-25°C', 'Above 25°C']
        }
      ],
      result: {
        solution: 'Based on your input, here are the recommendations',
        steps: [
          'Ensure substrate is clean and properly prepared',
          'Temperature should be between 5-25°C for optimal application',
          'Follow the water-to-powder ratio precisely',
          'Allow proper curing time before grouting'
        ],
        documents: ['Technical Data Sheet', 'Application Guide', 'Video Tutorial']
      }
    },
    distributor: {
      name: 'Find Distributor',
      steps: [
        {
          question: 'What is your location?',
          input: true,
          placeholder: 'City or ZIP code'
        },
        {
          question: 'What are you looking for?',
          options: ['Professional supplier', 'DIY store', 'Online shop', 'Any']
        }
      ],
      result: {
        distributors: [
          { name: 'BuildPro Warsaw', address: 'ul. Marszałkowska 45, Warsaw', distance: '2.3 km', type: 'Professional' },
          { name: 'HomeDepot Center', address: 'ul. Puławska 120, Warsaw', distance: '4.1 km', type: 'DIY Store' },
          { name: 'Ceresit Online Store', address: 'Online delivery available', distance: 'N/A', type: 'Online' }
        ]
      }
    },
    systemSolutions: {
      name: 'System Solutions',
      steps: [
        {
          question: 'What type of system do you need?',
          options: ['ETICS facade', 'Waterproofing', 'Tiling system', 'Floor system']
        },
        {
          question: 'What is the insulation type?',
          options: ['EPS (Polystyrene)', 'Mineral wool', 'Not sure']
        },
        {
          question: 'What is the climate zone?',
          options: ['Cold/Harsh', 'Moderate', 'Warm/Humid']
        }
      ],
      result: {
        systemName: 'Complete ETICS Facade System',
        components: [
          { step: '1. Primer', product: 'Ceresit CT 17' },
          { step: '2. Adhesive', product: 'Ceresit CT 85' },
          { step: '3. Insulation', product: 'EPS boards (recommended thickness: 15cm)' },
          { step: '4. Mesh', product: 'Ceresit reinforcement mesh' },
          { step: '5. Base coat', product: 'Ceresit CT 85' },
          { step: '6. Finish', product: 'Ceresit CT 60 or CT 63' }
        ],
        downloadOptions: ['System PDF', 'Bill of Materials', 'Installation Guide']
      }
    },
    certifications: {
      name: 'Certifications',
      steps: [
        {
          question: 'Which product do you need documentation for?',
          input: true,
          placeholder: 'Product code or name'
        },
        {
          question: 'What type of documentation?',
          options: ['EPD (Environmental)', 'Technical certificates', 'Safety data sheet', 'All documents']
        }
      ],
      result: {
        product: 'Ceresit CT 85',
        documents: [
          { name: 'Environmental Product Declaration (EPD)', size: '2.3 MB' },
          { name: 'Technical Certificate CE', size: '1.1 MB' },
          { name: 'Safety Data Sheet (SDS)', size: '0.8 MB' },
          { name: 'VOC Declaration', size: '0.5 MB' }
        ],
        additionalInfo: 'VOC class: A+ | Carbon footprint: 2.3 kg CO₂/kg'
      }
    }
  };

  const restartConversation = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Hello! I\'m the Ceresit AI Assistant. How can I help you today?',
        options: [
          'Find a product',
          'Technical support',
          'Find a distributor',
          'System solutions',
          'Product certifications'
        ]
      }
    ]);
    setCurrentFlow(null);
    setFlowStep(0);
    setInputValue('');
  };

  const startFlow = (flowType) => {
    const flowMap = {
      'Find a product': 'productFinder',
      'Technical support': 'technicalSupport',
      'Find a distributor': 'distributor',
      'System solutions': 'systemSolutions',
      'Product certifications': 'certifications',
      'Find another product': 'productFinder',
      'Start over': null
    };
    
    const flowKey = flowMap[flowType];
    
    if (flowType === 'Start over') {
      restartConversation();
      return;
    }

    if (flowType === 'Contact support') {
      addMessage('bot', 'I\'ll connect you with our technical support team. Please provide your contact details and someone will reach out to you within 24 hours.');
      setTimeout(() => {
        addMessage('bot', 'Is there anything else I can help you with?', ['Find a product', 'Technical support', 'Start over']);
      }, 1500);
      return;
    }
    
    setCurrentFlow(flowKey);
    setFlowStep(0);
    
    addMessage('bot', `Great! Let's help you with ${flows[flowKey].name}.`);
    setTimeout(() => {
      addMessage('bot', flows[flowKey].steps[0].question, flows[flowKey].steps[0].options, flows[flowKey].steps[0].input, flows[flowKey].steps[0].placeholder);
    }, 600);
  };

  const addMessage = (type, content, options = null, isInput = false, placeholder = '', data = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type, content, options, isInput, placeholder, data }]);
    }, 400);
  };

  const handleOptionClick = (option) => {
    addMessage('user', option);
    
    if (currentFlow) {
      const nextStep = flowStep + 1;
      
      if (nextStep < flows[currentFlow].steps.length) {
        setFlowStep(nextStep);
        setTimeout(() => {
          const step = flows[currentFlow].steps[nextStep];
          addMessage('bot', step.question, step.options, step.input, step.placeholder);
        }, 1000);
      } else {
        setTimeout(() => {
          showResult();
        }, 1000);
      }
    } else {
      startFlow(option);
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    
    addMessage('user', inputValue);
    setInputValue('');
    
    if (currentFlow) {
      const nextStep = flowStep + 1;
      
      if (nextStep < flows[currentFlow].steps.length) {
        setFlowStep(nextStep);
        setTimeout(() => {
          const step = flows[currentFlow].steps[nextStep];
          addMessage('bot', step.question, step.options, step.input, step.placeholder);
        }, 1000);
      } else {
        setTimeout(() => {
          showResult();
        }, 1000);
      }
    }
  };

  const showResult = () => {
    const result = flows[currentFlow].result;
    
    if (currentFlow === 'productFinder') {
      addMessage('bot', 'Based on your requirements, I recommend these products:');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: '', data: { type: 'products', products: result.products } }]);
      }, 800);
    } else if (currentFlow === 'technicalSupport') {
      addMessage('bot', result.solution);
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: '', data: { type: 'technical', steps: result.steps, documents: result.documents } }]);
      }, 800);
    } else if (currentFlow === 'distributor') {
      addMessage('bot', 'Here are the nearest distributors:');
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: '', data: { type: 'distributors', distributors: result.distributors } }]);
      }, 800);
    } else if (currentFlow === 'systemSolutions') {
      addMessage('bot', `Here's your complete ${result.systemName}:`);
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: '', data: { type: 'system', components: result.components, downloads: result.downloadOptions } }]);
      }, 800);
    } else if (currentFlow === 'certifications') {
      addMessage('bot', `Documentation for ${result.product}:`);
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', content: '', data: { type: 'certs', documents: result.documents, info: result.additionalInfo } }]);
      }, 800);
    }
    
    setTimeout(() => {
      addMessage('bot', 'Is there anything else I can help you with?', ['Find another product', 'Start over', 'Contact support']);
      setCurrentFlow(null);
      setFlowStep(0);
    }, 2500);
  };

  const renderMessage = (msg, index) => {
    if (msg.type === 'user') {
      return (
        <div key={index} className="flex justify-end mb-3 message-enter">
          <div className="glass-bubble-user max-w-xs px-5 py-3.5 rounded-[22px] rounded-tr-md">
            <p className="text-[15px] leading-relaxed font-medium text-white">{msg.content}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="flex justify-start mb-3 message-enter">
        <div className="glass-bubble-bot max-w-lg px-5 py-3.5 rounded-[22px] rounded-tl-md">
          {msg.content && (
            <p className="text-[15px] leading-relaxed text-gray-900 mb-2">{msg.content}</p>
          )}
          
          {msg.options && (
            <div className="flex flex-wrap gap-2 mt-3">
              {msg.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  className="glass-button px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {msg.isInput && (
            <div className="mt-3">
              <input
                type="text"
                placeholder={msg.placeholder}
                className="glass-input w-full px-4 py-3 rounded-2xl text-[15px] transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleInputSubmit();
                  }
                }}
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            </div>
          )}

          {msg.data?.type === 'products' && (
            <div className="space-y-3 mt-2">
              {msg.data.products.map((product, i) => (
                <div key={i} className="glass-card p-4 rounded-3xl transition-all duration-300 hover:scale-[1.02]">
                  <h4 className="font-bold text-gray-900 mb-1.5 text-[17px] tracking-tight">{product.name}</h4>
                  <p className="text-[14px] text-gray-600 mb-3 leading-relaxed">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.features.map((f, fi) => (
                      <span key={fi} className="glass-badge text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] text-gray-500 mb-3 font-medium">
                    Consumption: <span className="text-gray-900">{product.consumption}</span>
                  </p>
                  <button className="text-[14px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-all hover:gap-2.5">
                    View datasheet <span className="text-[12px]">→</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {msg.data?.type === 'technical' && (
            <div>
              <div className="space-y-2.5 mb-4 glass-card p-4 rounded-2xl">
                {msg.data.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 text-[14px] leading-relaxed">
                    <span className="font-bold text-blue-600 flex-shrink-0">{i + 1}.</span>
                    <span className="text-gray-800">{step}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {msg.data.documents.map((doc, i) => (
                  <button key={i} className="glass-button text-[13px] px-3.5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 font-semibold">
                    <FileText size={14} />
                    {doc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msg.data?.type === 'distributors' && (
            <div className="space-y-3">
              {msg.data.distributors.map((dist, i) => (
                <div key={i} className="glass-card p-4 rounded-3xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-[16px] tracking-tight">{dist.name}</h4>
                      <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{dist.address}</p>
                    </div>
                    <span className="text-[12px] text-gray-500 font-semibold ml-3">{dist.distance}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="glass-badge text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide">
                      {dist.type}
                    </span>
                    <button className="text-[13px] text-blue-600 hover:text-blue-700 flex items-center gap-1.5 font-semibold transition-all">
                      <MapPin size={14} />
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {msg.data?.type === 'system' && (
            <div>
              <div className="space-y-2.5 mb-4">
                {msg.data.components.map((comp, i) => (
                  <div key={i} className="flex gap-3 items-start glass-card p-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.01]">
                    <div className="w-7 h-7 rounded-full glass-badge flex items-center justify-center text-[13px] font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-gray-900 tracking-tight">{comp.step}</p>
                      <p className="text-[13px] text-gray-600 mt-0.5">{comp.product}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/30">
                {msg.data.downloads.map((dl, i) => (
                  <button key={i} className="glass-button-accent text-[13px] px-3.5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 font-semibold">
                    <FileText size={14} />
                    {dl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msg.data?.type === 'certs' && (
            <div>
              <div className="space-y-2 mb-3">
                {msg.data.documents.map((doc, i) => (
                  <div key={i} className="glass-card flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-600" />
                      <span className="text-[14px] text-gray-900 font-medium">{doc.name}</span>
                    </div>
                    <span className="text-[12px] text-gray-500 font-semibold">{doc.size}</span>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-gray-700 glass-card p-3.5 rounded-2xl font-medium">{msg.data.info}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Animated gradient background */
        .min-h-screen {
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #4facfe 75%, 
            #00f2fe 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glassmorphism styles */
        .glass-container {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
        }

        .glass-header {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .glass-bubble-bot {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .glass-bubble-user {
          background: rgba(99, 102, 241, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 4px 16px rgba(99, 102, 241, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #1f2937;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(255, 255, 255, 0.7);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .glass-button:active {
          transform: scale(0.98);
        }

        .glass-button-accent {
          background: rgba(147, 197, 253, 0.6);
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          border: 1px solid rgba(147, 197, 253, 0.5);
          color: #1e40af;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        .glass-button-accent:hover {
          background: rgba(147, 197, 253, 0.85);
          border-color: rgba(147, 197, 253, 0.7);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }

        .glass-badge {
          background: rgba(17, 24, 39, 0.75);
          backdrop-filter: blur(8px) saturate(150%);
          -webkit-backdrop-filter: blur(8px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #1f2937;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .glass-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 
            0 0 0 3px rgba(99, 102, 241, 0.1),
            inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .glass-input::placeholder {
          color: rgba(107, 114, 128, 0.8);
        }

        .glass-footer {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.25);
        }

        .icon-button {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }

        .icon-button:active {
          transform: scale(0.95);
        }

        .send-button {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .send-button:hover {
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
          transform: scale(1.05);
        }

        .send-button:active {
          transform: scale(0.95);
        }

        .fab {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.95));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fab:hover {
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
          transform: scale(1.1);
        }

        /* Smooth animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulseWave {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .message-enter {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .typing-dot {
          animation: pulseWave 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        /* Subtle specular highlights */
        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8) 50%, 
            transparent
          );
        }
      `}</style>
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 fab rounded-full flex items-center justify-center z-50"
          title="Open Ceresit AI Assistant"
        >
          <MessageCircle className="text-white" />
        </button>
      )}
      
      {isOpen && (
        <div className="w-full max-w-4xl">
          <div className="glass-container rounded-[32px] overflow-hidden relative">
            <div className="glass-header p-5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D4D0BAQHbjVOZ_S_sNQ/company-logo_200_200/company-logo_200_200/0/1719489877295/ceresit_logo?e=2147483647&v=beta&t=8rXGw0xcLy9fINcL-a2aLc6i5t8hOdEsxNlmnTcYTyY" 
                    alt="Ceresit Logo" 
                    className="w-10 h-10 object-contain rounded-full"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-[20px] text-white flex items-center gap-2 tracking-tight">
                    AI Assistant
                    <Sparkles size={18} className="text-blue-200" />
                  </h2>
                  <p className="text-[13px] text-white/70 font-medium">Building solutions, simplified</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={restartConversation}
                  className="icon-button text-white p-2.5 rounded-xl"
                  title="Restart conversation"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="icon-button text-white p-2.5 rounded-xl"
                  title="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="h-[580px] overflow-y-auto p-6 bg-gradient-to-b from-transparent to-black/5">
              {messages.map((msg, index) => renderMessage(msg, index))}
              
              {isTyping && (
                <div className="flex justify-start mb-3 message-enter">
                  <div className="glass-bubble-bot px-5 py-3.5 rounded-[22px] rounded-tl-md">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="glass-footer p-5">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                  className="glass-input flex-1 px-5 py-3.5 rounded-[24px] text-[15px]"
                />
                <button
                  onClick={handleInputSubmit}
                  className="send-button text-white p-3.5 rounded-[20px]"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[12px] text-white/60 mt-3.5 text-center flex items-center justify-center gap-1.5 font-medium">
                Powered by <span className="font-bold text-white/90">Ceresit</span> AI
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPrototype;