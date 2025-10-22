import { useState, useEffect } from 'react';
import { Mic, Volume2, Settings, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceConfig {
  enabled: boolean;
  supportedFormats: string[];
  maxFileSize: string;
  languages: string[];
  voices: string[];
  models: {
    transcription: string;
    tts: string;
  };
}

export default function VoiceSettings() {
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    fetchVoiceConfig();
  }, []);

  const fetchVoiceConfig = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/voice/config');
      const result = await response.json();
      
      if (result.success) {
        setVoiceConfig(result.data);
      } else {
        toast.error('Failed to fetch voice configuration');
      }
    } catch (error) {
      console.error('Failed to fetch voice config:', error);
      toast.error('Failed to fetch voice configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const testVoiceGeneration = async () => {
    setIsTestingVoice(true);
    try {
      const response = await fetch('http://localhost:8080/api/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Hello! This is Netia AI Receptionist. I can now process voice messages and respond naturally.',
          voice: 'alloy',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Create audio element and play the generated voice
        const audio = new Audio(`data:audio/mp3;base64,${result.data.audio}`);
        await audio.play();
        toast.success('Voice test successful!');
      } else {
        toast.error('Voice test failed');
      }
    } catch (error) {
      console.error('Voice test error:', error);
      toast.error('Voice test failed');
    } finally {
      setIsTestingVoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netia-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mic className="h-5 w-5 mr-2 text-netia-primary" />
            Voice Reception Settings
          </h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            voiceConfig?.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {voiceConfig?.enabled ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Voice Reception Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Voice Reception Disabled
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
              <Volume2 className="h-4 w-4 mr-2 text-netia-primary" />
              Voice Features
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Speech-to-Text (Whisper-1)
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Text-to-Speech (TTS-1)
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Natural Voice Conversations
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
              <Settings className="h-4 w-4 mr-2 text-netia-primary" />
              Configuration
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Max File Size: <span className="font-medium">{voiceConfig?.maxFileSize}</span></div>
              <div>Transcription Model: <span className="font-medium">{voiceConfig?.models?.transcription}</span></div>
              <div>TTS Model: <span className="font-medium">{voiceConfig?.models?.tts}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Available Voices</h3>
            <div className="grid grid-cols-2 gap-2">
              {voiceConfig?.voices?.map((voice: string) => (
                <span key={voice} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm text-center capitalize">
                  {voice}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Supported Languages</h3>
            <div className="grid grid-cols-3 gap-2">
              {voiceConfig?.languages?.map((lang: string) => (
                <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm text-center font-medium">
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">🎤 Natural Voice Reception</h4>
          <p className="text-blue-700 text-sm">
            Netia can now process voice messages and respond with natural speech, providing a more personal and engaging experience for Reddit users. Voice conversations are automatically transcribed and processed using OpenAI's Whisper and TTS models.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={testVoiceGeneration}
            disabled={isTestingVoice}
            className="btn-primary flex items-center"
          >
            {isTestingVoice ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing Voice...
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Test Voice Generation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

