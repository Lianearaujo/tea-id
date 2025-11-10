
import React, { useState, useRef } from 'react';
import type { TherapyType } from '../../types.ts';
import Button from '../ui/Button.tsx';
import MicrophoneIcon from '../icons/MicrophoneIcon.tsx';
import StopIcon from '../icons/StopIcon.tsx';
import PlusIcon from '../icons/PlusIcon.tsx';

interface SessionLoggerProps {
    onSave: (notes: string, therapyType: TherapyType, audioBlob?: Blob) => void;
}

const THERAPY_TYPES: TherapyType[] = ['Fonoaudiologia', 'Psicologia (ABA)', 'Terapia Ocupacional', 'Psicopedagogia'];

const SessionLogger: React.FC<SessionLoggerProps> = ({ onSave }) => {
    const [notes, setNotes] = useState('');
    const [therapyType, setTherapyType] = useState<TherapyType>(THERAPY_TYPES[0]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | undefined>();
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<number | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setAudioBlob(blob);
                    stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
                timerIntervalRef.current = window.setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);

            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Não foi possível acessar o microfone. Por favor, verifique as permissões do seu navegador.");
            }
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if(timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notes && !audioBlob) {
            alert("Por favor, escreva uma nota ou grave um áudio para registrar a sessão.");
            return;
        }
        onSave(notes, therapyType, audioBlob);
        setNotes('');
        setAudioBlob(undefined);
    };

    return (
        <section aria-labelledby="session-logger-heading" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 id="session-logger-heading" className="text-lg font-bold text-slate-800 mb-4">Registrar Nova Sessão</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="therapy-type" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Terapia</label>
                    <select 
                        id="therapy-type" 
                        value={therapyType}
                        onChange={(e) => setTherapyType(e.target.value as TherapyType)}
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {THERAPY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="session-notes" className="block text-sm font-medium text-slate-700 mb-1">Anotações da Sessão</label>
                    <textarea 
                        id="session-notes"
                        rows={5}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Descreva os principais pontos, progressos e desafios da sessão..."
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">ou</p>
                    {!isRecording && !audioBlob && (
                        <button type="button" onClick={handleStartRecording} className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                            <MicrophoneIcon className="h-5 w-5" />
                            Gravar Áudio da Sessão
                        </button>
                    )}
                    {isRecording && (
                        <div className="flex items-center gap-4 w-full bg-red-100 p-2 rounded-lg">
                            <button type="button" onClick={handleStopRecording} className="flex-shrink-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                                <StopIcon className="h-5 w-5" />
                            </button>
                            <div className="text-red-600 font-mono font-semibold animate-pulse">Gravando... {formatTime(recordingTime)}</div>
                        </div>
                    )}
                    {audioBlob && !isRecording && (
                        <div className="flex items-center gap-2 w-full bg-green-100 p-2 rounded-lg text-green-800">
                            <p className="text-sm font-medium">Áudio gravado. Clique em salvar.</p>
                            <button type="button" onClick={() => setAudioBlob(undefined)} className="text-xs text-slate-500 hover:underline">Remover</button>
                        </div>
                    )}
                </div>
                <div className="pt-2">
                    <Button type="submit" fullWidth>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Salvar Sessão
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default SessionLogger;
