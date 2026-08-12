import React, { useState, useEffect } from 'react';
import { X, Calculator, PlusCircle, Wallet, Delete } from 'lucide-react';

export default function CalculatorModal({
  isOpen,
  onClose,
  onAddCustomAmount,
  onSetAmountReceived
}) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(e.key)) {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key.toLowerCase() === 'c') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, expression, isCalculated]);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (isCalculated) {
      setDisplay(digit === '.' ? '0.' : digit);
      setExpression('');
      setIsCalculated(false);
      return;
    }

    if (digit === '.') {
      if (display.includes('.')) return;
      setDisplay(display + '.');
    } else {
      if (display === '0') {
        setDisplay(digit);
      } else {
        setDisplay(display + digit);
      }
    }
  };

  const handleOperator = (op) => {
    let currentExp = expression;
    if (isCalculated) {
      currentExp = display;
      setIsCalculated(false);
    } else if (display !== '') {
      currentExp += ' ' + display;
    }

    setExpression(currentExp + ' ' + op);
    setDisplay('0');
  };

  const handlePercentage = () => {
    try {
      const val = parseFloat(display);
      if (!isNaN(val)) {
        const result = (val / 100).toString();
        setDisplay(result);
      }
    } catch (err) {
      setDisplay('Error');
    }
  };

  const handleBackspace = () => {
    if (isCalculated) {
      clearAll();
      return;
    }

    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setIsCalculated(false);
  };

  const calculateResult = () => {
    try {
      let fullExpr = expression;
      if (!isCalculated && display !== '') {
        fullExpr += ' ' + display;
      }
      
      if (!fullExpr.trim()) return;

      // Clean operators for JS eval: × -> *, ÷ -> /
      const sanitizeExpr = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/--/g, '+');

      // Safely evaluate simple mathematical expressions
      // eslint-disable-next-line no-new-func
      const evalResult = Function(`"use strict"; return (${sanitizeExpr})`)();
      
      if (isNaN(evalResult) || !isFinite(evalResult)) {
        setDisplay('Error');
      } else {
        const rounded = parseFloat(Number(evalResult).toFixed(2));
        setDisplay(rounded.toString());
        setExpression(fullExpr + ' =');
        setIsCalculated(true);
      }
    } catch (err) {
      setDisplay('Error');
    }
  };

  const currentResultNum = parseFloat(display) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600/30 border border-blue-500/40 rounded-lg flex items-center justify-center text-blue-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Quick Counter Calculator</h3>
              <p className="text-[10px] text-slate-400">Instant Manual Computation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculator Display Screen */}
        <div className="p-4 bg-slate-950 flex flex-col items-end justify-end border-b border-slate-800 min-h-[100px]">
          <div className="text-xs text-blue-400 font-mono tracking-wider min-h-[18px] max-w-full truncate">
            {expression || ' '}
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1 max-w-full truncate">
            ₹{display}
          </div>
        </div>

        {/* Quick Action Bar for Result */}
        {currentResultNum > 0 && (
          <div className="p-2.5 bg-slate-800/90 border-b border-slate-700/60 flex gap-2">
            {onAddCustomAmount && (
              <button
                type="button"
                onClick={() => {
                  onAddCustomAmount(currentResultNum, 'Calculated Item');
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add ₹{currentResultNum} to Bill</span>
              </button>
            )}
            {onSetAmountReceived && (
              <button
                type="button"
                onClick={() => {
                  onSetAmountReceived(currentResultNum.toString());
                  onClose();
                }}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Paid ₹{currentResultNum}</span>
              </button>
            )}
          </div>
        )}

        {/* Keypad Grid */}
        <div className="p-4 grid grid-cols-4 gap-2 bg-slate-900">
          <button
            onClick={clearAll}
            className="py-3 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300 font-bold rounded-xl text-sm transition-all active:scale-95"
          >
            C
          </button>
          <button
            onClick={handlePercentage}
            className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all active:scale-95"
          >
            %
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-sm flex items-center justify-center transition-all active:scale-95"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOperator('÷')}
            className="py-3 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 font-extrabold rounded-xl text-lg transition-all active:scale-95"
          >
            ÷
          </button>

          <button
            onClick={() => handleDigit('7')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('×')}
            className="py-3 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 font-extrabold rounded-xl text-lg transition-all active:scale-95"
          >
            ×
          </button>

          <button
            onClick={() => handleDigit('4')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('-')}
            className="py-3 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 font-extrabold rounded-xl text-lg transition-all active:scale-95"
          >
            -
          </button>

          <button
            onClick={() => handleDigit('1')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('+')}
            className="py-3 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 font-extrabold rounded-xl text-lg transition-all active:scale-95"
          >
            +
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleDigit('.')}
            className="py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold rounded-xl text-lg border border-slate-700/60 transition-all active:scale-95"
          >
            .
          </button>
          <button
            onClick={calculateResult}
            className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            =
          </button>
        </div>

      </div>
    </div>
  );
}
