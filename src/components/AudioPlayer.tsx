import React from "react";

export const AudioPlayer: React.FC = () => {
  return (
    <div>
      <audio ref="audio_tag" src="../assets/bensound-brazilsamba.mp3" controls autoPlay />
    </div>
  )
}