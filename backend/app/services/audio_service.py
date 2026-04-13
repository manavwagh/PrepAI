import os
from typing import Optional
from deepgram import DeepgramClient
from elevenlabs.client import ElevenLabs

class AudioService:
    def __init__(self):
        self.dg_key = os.getenv("DEEPGRAM_API_KEY")
        self.el_key = os.getenv("ELEVEN_LABS_API_KEY")
        
        if self.dg_key:
            self.dg_client = DeepgramClient(self.dg_key)
        else:
            self.dg_client = None
            
        if self.el_key:
            self.el_client = ElevenLabs(api_key=self.el_key)
        else:
            self.el_client = None

    async def transcribe_audio(self, audio_content: bytes) -> Optional[str]:
        """
        Transcribes audio bytes to text using Deepgram.
        """
        if not self.dg_client or "your_" in self.dg_key:
            return "Mock transcription: The user said they have strong experience in React and Node.js."

        try:
            # Deepgram v6 (Fern) syntax
            response = self.dg_client.listen.v1.media.transcribe_file(
                request=audio_content,
                model="nova-2",
                smart_format=True,
            )
            return response.results.channels[0].alternatives[0].transcript
        except Exception as e:
            print(f"Deepgram Error: {e}")
            return None

    async def generate_speech(self, text: str, voice_id: str = "JBFqnCBsd6RMkjVDRZzb") -> Optional[bytes]:
        """
        Converts text to speech bytes using ElevenLabs.
        Provides a mock fallback if no API key is present.
        """
        if not self.el_client or "your_" in self.el_key:
            print("ElevenLabs Key missing or placeholder. Returning mock audio pulse.")
            # Return a tiny 1-second silent MP3 or a mock beep
            return b"\xff\xfb\x90\x44\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"

        try:
            audio_generator = self.el_client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
            audio_bytes = b"".join(list(audio_generator))
            return audio_bytes
        except Exception as e:
            print(f"ElevenLabs Error: {e}. Falling back to mock audio.")
            return b"\xff\xfb\x90\x44\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"

audio_service = AudioService()
