#!/usr/bin/env python3
"""
================================================================================
                    OXY BREATHING AUDIO GENERATOR
================================================================================

This script generates all voice audio files for the "oxy" breathing exercise
and meditation app using the ElevenLabs API.

QUICK START:
    python3 generate_audio.py

To see all phrases without generating audio:
    python3 generate_audio.py --dry-run

To use a different voice:
    python3 generate_audio.py --voice YOUR_VOICE_ID

To use a different model:
    python3 generate_audio.py --model eleven_monolingual_v1

================================================================================
                            SETUP INSTRUCTIONS
================================================================================

1. GET AN ELEVENLABS API KEY:
   - Visit: https://elevenlabs.io
   - Sign up for a free account
   - Go to Settings > API Keys
   - Copy your API key and paste it below in ELEVENLABS_API_KEY

2. CHOOSE A VOICE:
   Recommended German voices:
   - 21m00Tcm4TlvDq8ikWAM (Rachel) - Warm, clear, natural
   - EXAVITQu4vr4xnSDxMaL (Bella) - Smooth, professional
   - TxGEqnHWrfWFTqroUFH7 (Antoni) - Calm, soothing
   - VR6AewLVsFAPc2u7mAJO (Arnold) - Deep, authoritative
   - pNInz6obpgDQGcFmaJgB (Adam) - Neutral, clear

   For a complete list, run:
       elevenlabs.client.voices()

3. CHOOSE A MODEL:
   - eleven_multilingual_v2 (default) - Best for German, most natural
   - eleven_monolingual_v1 - Lower latency but less natural
   - eleven_english_sts_v2 - English-optimized

4. INSTALLATION:
   pip3 install --break-system-packages elevenlabs requests

5. RATE LIMITING:
   - Free tier: 10,000 characters/month
   - Paid tier: Based on subscription
   - Script automatically retries if rate-limited (with 60s backoff)

================================================================================
"""

import os
import sys
import re
import json
import time
import argparse
from pathlib import Path
from typing import List, Set
from tqdm import tqdm

# Try to import elevenlabs, fall back to requests if not available
try:
    from elevenlabs import Client, VoiceSettings
    HAS_ELEVENLABS = True
except ImportError:
    HAS_ELEVENLABS = False

import requests

# === CONFIGURATION ===
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "MZHabtAqfFWWdxrbZ9iS"  # Rachel (warm, clear, natural)
MODEL_ID = "eleven_v3"  # Best for German
OUTPUT_DIR = "./audio"

# === ELEVENLABS API ENDPOINTS ===
ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1"
TEXT_TO_SPEECH_ENDPOINT = f"{ELEVENLABS_API_BASE}/text-to-speech"

# === VOICE PHRASES (extracted from app_data.js and meditation_data.js) ===
VOICE_PHRASES = [
    "1.5 Sekunden schnell und vollständig auslösen - wiederholt 30-40 mal",
    "Aktiviere das Heilungslicht in deinem Herzen",
    "Aktiviere die Gedächtniszentren in deinem Gehirn",
    "Akzeptiere Schlaflosigkeit ohne Kampf",
    "Ankere dich in dieser Moment",
    "Ankern Sie Ihre bewusste Intention",
    "Baue Konzentrations-Fundament",
    "Bereite deinen Körper auf Entspannung vor",
    "Bereite deinen Körper vollständig vor",
    "Bereiten Sie sich auf eine innere Reise vor",
    "Besteigen Sie den heiligen Berg Schritt für Schritt",
    "Betreten Sie einen schönen Wald voller goldenes Licht",
    "Betritt deine grundlegende Angst mit Mut",
    "Betritt den heiligen Wald",
    "Bringen Sie Aufmerksamkeit zu Ihrem Bauch",
    "Drei Sekunden - so leicht wie möglich einatmen",
    "Drei Sekunden durch die Nase kraftvoll einatmen",
    "Drei Sekunden einatmen",
    "Drei Sekunden einatmen - Druck aufbauen",
    "Drei Sekunden einatmen und Farbe visualisieren",
    "Drei Sekunden einatmen, Finger krümmen und Faust machen",
    "Drei Sekunden einatmen, Kopfhaut spüren",
    "Drei Sekunden einatmen, Schultern hoch",
    "Drei Sekunden einatmen, Schultern hoch zum Ohr",
    "Drei Sekunden einatmen, einen Finger krümmen",
    "Drei Sekunden energisch einatmen, den Tag begrüßen",
    "Drei Sekunden links einatmen",
    "Drei Sekunden sanft einatmen",
    "Drei Sekunden sanft einatmen wie Schmetterlingsflügel hochgehen",
    "Drei Sekunden sanft einatmen, Kiefer leicht öffnen",
    "Drei Sekunden schnell einatmen",
    "Entdecke eine verborgene Kristallhöhle",
    "Entspannen Sie progressiv alle Muskeln",
    "Entspringen Sie aus der Quelle des Lebens",
    "Erkenne Hyperarousal in deinem Körper",
    "Erkenne dein eigenes Leiden",
    "Erkenne deine Angst ohne Widerstand",
    "Erkenne deine Einsamkeit mit Mitgefühl",
    "Erkenne deine Fehler ohne Schande",
    "Erkenne deine Müdigkeit",
    "Erkenne deine habituellen Sorgen",
    "Erkenne deine kreativen Blockaden",
    "Erkenne deine reaktiven Muster",
    "Erkenne deinen lokalen Zeit-Rhythmus",
    "Erkenne die Perfektion deines Körpers",
    "Erkenne die Stimme deines inneren Kritikers",
    "Erkenne tiefe Scham mit Milde",
    "Erkenne wo deine Grenzen sind",
    "Erkenne, dass Groll nur dir selbst schadet",
    "Erkenne, dass Schuldgefühl oft unangemessen ist",
    "Erkenne, dass alle Wesen dir ähnlich sind",
    "Erkenne, dass dein Wert intrinsisch ist",
    "Erkenne, dass du Liebe würdig bist",
    "Erwache sanft und liebevoll",
    "Erwache zu deiner inneren Vitalität",
    "Erwartet den Sonnenaufgang",
    "Finden Sie Ihre natürliche Atmung",
    "Fünf Sekunden ALLE Muskeln anspannen - von Kopf bis Fuß",
    "Fünf Sekunden Körperteil anspannen - Energie hinein",
    "Fünf Sekunden Körperteil spüren und mit Atem Aufmerksamkeit schicken",
    "Fünf Sekunden direkt ins Herz einatmen",
    "Fünf Sekunden durch konstrigierten Rachen einatmen - Ozeangeräusch",
    "Fünf Sekunden durch leicht konstrigierten Rachen einatmen",
    "Fünf Sekunden durch rechts(Sonne) einatmen",
    "Fünf Sekunden einatmen",
    "Fünf Sekunden einatmen und sanft dehnen",
    "Fünf Sekunden einatmen und sich auf einer Wolke vorstellen",
    "Fünf Sekunden einatmen, Energie von Basis bis Scheitel hochziehen",
    "Fünf Sekunden einatmen, Füße in den Boden drücken",
    "Fünf Sekunden einatmen, Mond-Energie steigt",
    "Fünf Sekunden langsam einatmen",
    "Fünf Sekunden sanft einatmen",
    "Fünfeinhalb Sekunden sanft einatmen",
    "Gehe hinein in die ehrfürchtige Kathedrale",
    "Halten Sie eine schwierige Person in Ihrem Bewusstsein",
    "Heben Sie Ihre Vibrationsfrequenz mit Dankbarkeit",
    "Integriere Erdstabilität",
    "Komme zu dir an",
    "Kommen Sie in Ihrem Körper an",
    "Kontaktiere Dein Zellbewusstsein",
    "Kontaktiere dein Immun-System",
    "Kontaktiere deine innere Willenskraft",
    "Konzentrieren Sie sich auf Ihren Atem als Anker",
    "Leite deinen Körper in REM-Schlaf ein",
    "Lenken Sie Ihre Aufmerksamkeit sanft nach innen",
    "Lokalisiere die Quelle deiner Müdigkeit",
    "Lokalisiere wo du Stress speicherst",
    "Löse mentalen Nebel auf",
    "Nähern Sie sich dem Schmerz mit Mitgefühl",
    "Rechtes Nasenloch zu, durch links einatmen",
    "Reflektiere über deinen Tag",
    "Richten Sie Bewusstsein auf Ihre Beine",
    "Richten Sie Ihre Aufmerksamkeit auf Ihr Herz",
    "Richten Sie Ihre Aufmerksamkeit auf Nacken und Schultern",
    "Rufe Mondenergie an",
    "Sammle deinen zerstreuten Geist",
    "Schaffe deinen inneren Zufluchtsort für Ruhe",
    "Schaffe einen Sicherheitsraum in deinem Unbewusstsein",
    "Schaffen Sie Raum für alle Ihre Gefühle",
    "Schau auf zum Sternenlicht",
    "Schließen Sie alle Sinne nach innen",
    "Schnell ausatmen durch die Nase",
    "Schreibe tiefe Wurzeln in die Erde",
    "Sechs Sekunden ein",
    "Sechs Sekunden langsam einatmen, Faszien-Gewebe sich weiten lassen",
    "Sechs Sekunden links einatmen",
    "Sechs Sekunden sanft einatmen",
    "Sechs Sekunden tief einatmen",
    "Senden Sie bedingungslose Liebe zu sich selbst",
    "Setzen Sie sich bequem hin und schließen Sie die Augen",
    "Spüren Sie Ihre Verbindung zur Erde",
    "Starten Sie in den kosmischen Raum",
    "Steige hinab in die Tiefe des Ozeans",
    "Stelle dich deiner sozialen Angst mutig",
    "Stelle innere Sicherheit her",
    "Stellen Sie sich an einem wunderschönen Strand vor",
    "Stimme dich auf Flow ein",
    "Stimme dich auf deinen natürlichen Schlaf-Wach-Rhythmus ein",
    "Tauchen Sie in das Gewahrsein Ihrer Zellen ein",
    "Treten Sie in die Stille ein wie in einen heiligen Raum",
    "Verbinde dich mit Bergenergie",
    "Vereinigen Sie Ihre Familie in Ihrem Herzen",
    "Vier Sekunden durch die Nase einatmen",
    "Vier Sekunden durch die Zähne einatmen mit Zischgeräusch",
    "Vier Sekunden durch die gerollte Zunge einatmen - kühl",
    "Vier Sekunden durch rechts einatmen - Sonnenenergie",
    "Vier Sekunden ein/aus - leichte Zone",
    "Vier Sekunden einatmen",
    "Vier Sekunden einatmen und Lavendel-Duft visualisieren",
    "Vier Sekunden einatmen und eine Zahl denken",
    "Vier Sekunden einatmen und innere Wärme spüren",
    "Vier Sekunden einatmen während du zählst: eins, zwei, drei, vier",
    "Vier Sekunden einatmen, Augen zukneifen",
    "Vier Sekunden einatmen, Füße in den Boden drücken",
    "Vier Sekunden einatmen, Hohlkreuz leicht einziehen",
    "Vier Sekunden einatmen, Körper schaukelt sanft vor",
    "Vier Sekunden einatmen, Nacken spüren",
    "Vier Sekunden einatmen, eine Wolke vorbei-ziehen lassen",
    "Vier Sekunden in den Bauch einatmen - Bauch sollte sich dehnen",
    "Vier Sekunden kräftig einatmen - Yang Aktivität",
    "Vier Sekunden lang und tief gähnen",
    "Vier Sekunden links einatmen",
    "Vier Sekunden nur durch die Nase einatmen",
    "Vier Sekunden sanft einatmen",
    "Vier Sekunden synchron mit Herzschlag einatmen",
    "Vier Sekunden tiefe Bauch-Einatmung, Zwerchfell dehnt sich",
    "Visualisiere dich als Blumensamen in reicher Erde",
    "Werde dir deiner chronischen Anspannung bewusst",
    "Werde dir deines Atems bewusst",
    "Werden Sie empfänglich für die Essenz bedingungslosen Wohlwollens",
    "Wählen Sie eine einfache tägliche Aktivität",
    "Während drei Laufschritte einatmen",
    "Während drei Schritte einatmen",
    "Während zwei Laufschritte schnell einatmen",
    "Zwei Sekunden einatmen",
    "Zwei Sekunden hintereinander zwei schnelle Atemzüge",
    "Zwei Sekunden schnell einatmen",
    "Zwei Sekunden schnell einatmen mit Nachzieh-Atemzug",
    "Zwei Sekunden schnell einatmen, dann ein kurzer Nachzieh-Atemzug",
    "Zwei Sekunden schnell hintereinander einatmen",
    "Zwei Sekunden schnelle intensive Einatmung",
    "Zünde das Feuer deiner Transformation an",
    "Öffne dich der Natur",
    "Öffne dich für spirituelle Realitäten",
    "Öffnen Sie Ihr Herz weit",
    "Öffnen Sie Ihren Körper für umfassendes Gewahrsein",
    "Öffnen Sie sich Ihren Herzenschmerz mit Mitgefühl",
    "Öffnen Sie sich für den Fluss von Lebensenergie",
    "Öffnen Sie sich für die Chakra-Energien",
    "Öffnen Sie sich für die Gegenwart",
    "Öffnen Sie sich für die Klänge der Natur",
    "Öffnen Sie sich für echte Freude",
    "Öffnen Sie sich für emotionale Freigabe",
]


def sanitize_filename(text: str) -> str:
    """
    Sanitize text for use as filename.
    Matches JavaScript sanitization: replace non-alphanumeric chars with underscore
    and limit to 40 characters.

    Args:
        text: The text to sanitize

    Returns:
        Sanitized filename with .mp3 extension
    """
    # Replace non-alphanumeric characters (except German umlauts) with underscore
    sanitized = re.sub(r'[^a-zA-ZäöüÄÖÜß0-9]', '_', text)
    # Limit to 40 characters and add .mp3 extension
    return sanitized[:40] + '.mp3'


def ensure_output_dir():
    """Create output directory if it doesn't exist."""
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)


def get_existing_audio_files() -> Set[str]:
    """Get set of already generated audio files."""
    if not Path(OUTPUT_DIR).exists():
        return set()
    return {f.name for f in Path(OUTPUT_DIR).glob('*.mp3')}


def generate_audio_elevenlabs_sdk(text: str, voice_id: str, model_id: str):
    """
    Generate audio using ElevenLabs SDK.

    Args:
        text: Text to synthesize
        voice_id: Voice ID to use
        model_id: Model ID to use

    Returns:
        Audio bytes or None if failed
    """
    try:
        if not HAS_ELEVENLABS:
            return None

        client = Client(api_key=ELEVENLABS_API_KEY)

        audio = client.generate(
            text=text,
            voice=voice_id,
            model=model_id,
            voice_settings=VoiceSettings(stability=0.5, similarity_boost=0.75)
        )

        return b''.join(audio)
    except Exception as e:
        print(f"SDK error: {e}")
        return None


def generate_audio_rest_api(text: str, voice_id: str, model_id: str) -> bytes:
    """
    Generate audio using ElevenLabs REST API (fallback).

    Args:
        text: Text to synthesize
        voice_id: Voice ID to use
        model_id: Model ID to use

    Returns:
        Audio bytes

    Raises:
        Exception: If API request fails
    """
    url = f"{TEXT_TO_SPEECH_ENDPOINT}/{voice_id}"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }

    data = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 429:
        # Rate limited - wait and retry
        print("Rate limited by ElevenLabs API. Waiting 60 seconds...")
        time.sleep(60)
        return generate_audio_rest_api(text, voice_id, model_id)

    if response.status_code != 200:
        raise Exception(
            f"ElevenLabs API error: {response.status_code} - {response.text}"
        )

    return response.content


def generate_audio_file(text: str, output_file: str, voice_id: str, model_id: str) -> bool:
    """
    Generate and save audio file.

    Args:
        text: Text to synthesize
        output_file: Path to save audio file
        voice_id: Voice ID to use
        model_id: Model ID to use

    Returns:
        True if successful, False otherwise
    """
    try:
        # Try SDK first, fall back to REST API
        audio_bytes = generate_audio_elevenlabs_sdk(text, voice_id, model_id)

        if audio_bytes is None:
            audio_bytes = generate_audio_rest_api(text, voice_id, model_id)

        # Save audio file
        with open(output_file, 'wb') as f:
            f.write(audio_bytes)

        return True
    except Exception as e:
        print(f"Error generating audio for '{text}': {e}")
        return False


def list_all_phrases():
    """List all phrases and their generated filenames."""
    print("\n" + "="*80)
    print("ALL VOICE PHRASES AND GENERATED FILENAMES")
    print("="*80 + "\n")

    for i, phrase in enumerate(VOICE_PHRASES, 1):
        filename = sanitize_filename(phrase)
        print(f"{i:3d}. {phrase}")
        print(f"     -> {filename}\n")

    print(f"Total phrases: {len(VOICE_PHRASES)}")


def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description="Generate audio files for OXY breathing app",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 generate_audio.py              # Generate all audio files
  python3 generate_audio.py --dry-run    # Show all phrases without generating
  python3 generate_audio.py --voice YOUR_VOICE_ID  # Use different voice
  python3 generate_audio.py --model eleven_monolingual_v1  # Use different model
        """
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show all phrases and filenames without generating audio'
    )
    parser.add_argument(
        '--voice',
        type=str,
        default=VOICE_ID,
        help=f'Voice ID to use (default: {VOICE_ID})'
    )
    parser.add_argument(
        '--model',
        type=str,
        default=MODEL_ID,
        help=f'Model ID to use (default: {MODEL_ID})'
    )

    args = parser.parse_args()

    # Handle dry-run mode
    if args.dry_run:
        list_all_phrases()
        return

    # Check API key is set
    if ELEVENLABS_API_KEY == "YOUR_API_KEY_HERE":
        print("ERROR: ELEVENLABS_API_KEY not set!")
        print("Please set your API key in the script configuration section.")
        sys.exit(1)

    # Ensure output directory exists
    ensure_output_dir()

    # Get existing files to skip
    existing_files = get_existing_audio_files()
    phrases_to_generate = [
        phrase for phrase in VOICE_PHRASES
        if sanitize_filename(phrase) not in existing_files
    ]

    if not phrases_to_generate:
        print("All audio files already exist!")
        return

    print(f"\nGenerating {len(phrases_to_generate)} audio files...")
    print(f"Using voice: {args.voice}")
    print(f"Using model: {args.model}\n")

    # Generate audio files with progress bar
    generated = 0
    failed = 0

    for phrase in tqdm(phrases_to_generate, desc="Generating audio"):
        filename = sanitize_filename(phrase)
        output_file = os.path.join(OUTPUT_DIR, filename)

        if generate_audio_file(phrase, output_file, args.voice, args.model):
            generated += 1
        else:
            failed += 1

    print(f"\n{'='*80}")
    print(f"Completed!")
    print(f"Generated: {generated}")
    print(f"Failed: {failed}")
    print(f"Total: {len(VOICE_PHRASES)}")
    print(f"Output directory: {os.path.abspath(OUTPUT_DIR)}")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    main()
