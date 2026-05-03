/*

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const VideoSession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Oka unique room name create cheyali
  const jitsiRoomName = `MindCare_Session_${roomId || 'DefaultRoom'}`;

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      
      <div className="p-4 bg-black/40 backdrop-blur-md flex items-center justify-between text-white z-50 border-b border-white/10">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-xs font-bold opacity-70 hover:opacity-100 transition"
        >
          <ChevronLeft size={16}/> EXIT SESSION
        </button>
        <div className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">
          MindCare Live Portal
        </div>
      </div>
      
      
      <div className="flex-1 w-full h-full bg-slate-900">
        <iframe
          src={`https://meet.jit.si/${jitsiRoomName}#config.prejoinPageEnabled=false`}
          allow="camera; microphone; display-capture; fullscreen; clipboard-write; self-view-display"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};

export default VideoSession;

*/