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
        if not self.dg_client:
            return "Mock transcription: The user said something interesting."

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
        Default voice is 'George'.
        """
        if not self.el_client:
            return None # Or return a mock b'audio'

        try:
            audio_generator = self.el_client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
            # Combine the generator into single bytes object
            audio_bytes = b"".join(list(audio_generator))
            return audio_bytes
        except Exception as e:
            print(f"ElevenLabs Error: {e}")
            return None

audio_service = AudioService()
