"""Génère le QR code du site témoin pour la présentation.

Utilisation :
    python outils/qr.py https://TONPSEUDO.github.io/troc-savoirs/

Crée dans le dossier presentation/ :
    qr-troc-savoirs.png  (grande image à coller dans les diapos)
    qr-troc-savoirs.svg  (version vectorielle, nette à toutes les tailles)
"""
import pathlib
import sys

import segno

ENCRE = "#1B2A4A"   # couleur encre de la charte
FOND = "#FFFFFF"


def main() -> None:
    if len(sys.argv) != 2 or not sys.argv[1].startswith("https://"):
        sys.exit("Donne le lien du site, par exemple :\n  python outils/qr.py https://tonpseudo.github.io/troc-savoirs/")
    url = sys.argv[1]

    out = pathlib.Path(__file__).resolve().parent.parent / "presentation"
    out.mkdir(exist_ok=True)

    # Correction d'erreur "H" : le QR reste lisible même projeté de loin ou un peu flou
    qr = segno.make(url, error="h", micro=False)
    qr.save(out / "qr-troc-savoirs.png", scale=30, border=3, dark=ENCRE, light=FOND)
    qr.save(out / "qr-troc-savoirs.svg", scale=10, border=3, dark=ENCRE, light=FOND)

    print(f"QR code pour {url}")
    print(f"  -> {out / 'qr-troc-savoirs.png'}")
    print(f"  -> {out / 'qr-troc-savoirs.svg'}")


if __name__ == "__main__":
    main()
