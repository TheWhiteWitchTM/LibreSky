import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, Cpu, Server, CheckCircle2, AlertCircle, Play, Sliders } from 'lucide-react';
import { AIModel, AIProvider, AIProviderConfig } from '../../types/ai';
import { LocalAIService } from '../../services/localAI';
import { storage } from '../../services/storage';

interface LocalAISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiService: LocalAIService;
  onConfigUpdated: () => void;
}

export const LocalAISettingsModal: React.FC<LocalAISettingsModalProps> = ({
  isOpen,
  onClose,
  aiService,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<AIProviderConfig>(aiService.getConfig());
  const [scanning, setScanning] = useState(false);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [testOutput, setTestOutput] = useState<string>('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(aiService.getConfig());
      handleScan();
    }
  }, [isOpen]);

  const handleScan = async () => {
    setScanning(true);
    setScanStatus('Scanning local ports (Ollama 11434, LM Studio 1234, LocalAI 8080)...');
    try {
      const res = await aiService.detectLocalAI();
      if (res.connected) {
        setAvailableModels(res.models);
        setConfig((prev) => ({
          ...prev,
          provider: res.provider,
          endpoint: res.endpoint,
          selectedModel: prev.selectedModel && res.models.some((m) => m.id === prev.selectedModel)
            ? prev.selectedModel
            : res.models[0]?.id || '',
        }));
        setScanStatus(`Connected to ${res.provider.toUpperCase()} with ${res.models.length} model(s) ready!`);
      } else {
        setScanStatus('No local AI detected on default ports.');
      }
    } catch (err: any) {
      setScanStatus(`Scan failed: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  const handleSave = () => {
    aiService.updateConfig(config);
    storage.setAIConfig(config);
    onConfigUpdated();
    onClose();
  };

  const handleQuickTest = async () => {
    if (!config.selectedModel) {
      setTestOutput('Please select or specify a model first.');
      return;
    }
    setTesting(true);
    setTestOutput('');
    try {
      let result = '';
      await aiService.streamChat(
        [
          { role: 'system', content: 'You are LibreSky AI.' },
          { role: 'user', content: 'Say hello to LibreSky in 1 sharp, exciting sentence!' },
        ],
        (chunk) => {
          result += chunk;
          setTestOutput(result);
        }
      );
    } catch (err: any) {
      setTestOutput(`Error testing model: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f23] bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Local AI Engine
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Privacy-First
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Zero data leaves your machine. Powered by Ollama or LM Studio.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Scan Status Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#121215] border border-[#27272a]">
            <div className="flex items-center gap-3">
              {availableModels.length > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <span className="text-xs text-zinc-300">{scanStatus || 'Click scan to discover local AI servers.'}</span>
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
              Scan
            </button>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> AI Backend Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ollama', 'lmstudio', 'localai'] as AIProvider[]).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => {
                    const defaultPort = prov === 'ollama' ? '11434' : prov === 'lmstudio' ? '1234' : '8080';
                    setConfig({
                      ...config,
                      provider: prov,
                      endpoint: `http://127.0.0.1:${defaultPort}`,
                    });
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                    config.provider === prov
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                      : 'bg-[#121215] border-[#222226] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {prov === 'ollama' ? '🦙 Ollama' : prov === 'lmstudio' ? '🔮 LM Studio' : '⚡ LocalAI'}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Endpoint URL
            </label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              placeholder="http://127.0.0.1:11434"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Active Model
            </label>
            {availableModels.length > 0 ? (
              <select
                value={config.selectedModel}
                onChange={(e) => setConfig({ ...config, selectedModel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.size ? `(${m.size})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={config.selectedModel}
                onChange={(e) => setConfig({ ...config, selectedModel: e.target.value })}
                placeholder="e.g. llama3.2, mistral, deepseek-r1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-[#27272a] text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition font-mono"
              />
            )}
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Temperature: {config.temperature}
              </span>
              <span className="text-zinc-500">
                {config.temperature <= 0.3 ? 'Deterministic / Fact-Focused' : config.temperature >= 0.8 ? 'Creative / Grok Fun' : 'Balanced'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.2"
              step="0.05"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-zinc-800"
            />
          </div>

          {/* Live Test Playground */}
          <div className="p-3.5 rounded-xl bg-[#121215] border border-[#27272a] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-cyan-400" /> Test Connection
              </span>
              <button
                type="button"
                onClick={handleQuickTest}
                disabled={testing}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition disabled:opacity-50"
              >
                {testing ? 'Thinking...' : 'Ping AI'}
              </button>
            </div>
            {testOutput && (
              <div className="p-3 rounded-lg bg-black border border-cyan-500/30 text-xs text-cyan-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {testOutput}
              </div>
            )}
          </div>

          {/* Setup Hint */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <div className="text-zinc-300 font-semibold">💡 Quick Local Setup:</div>
            <div>• <strong className="text-zinc-200">Ollama:</strong> Run <code className="text-cyan-400">ollama run llama3.2</code> in your terminal.</div>
            <div>• <strong className="text-zinc-200">LM Studio:</strong> Open LM Studio, download a model, and toggle &ldquo;Start Local Server&rdquo; on port 1234.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1f1f23] bg-[#0c0c0e]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-lg shadow-cyan-500/20 transition"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
};
