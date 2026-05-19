"""
Flux 1.1 Pro Ultra로 서풍몰 상품/카테고리 이미지 일괄 생성.

각 이미지는 사실적 스튜디오 푸드 포토그래피 스타일로 생성되며
AI 합성 흔적(과장된 디테일, 비현실적 조명, 인공적 질감)을 배제하기 위해
"professional food photography" 계열 프롬프트와 자연 조명 지시어를 사용한다.

실행:
    python scripts/generate_shop_images.py
    python scripts/generate_shop_images.py --only gulbi-10-1     # 단건
    python scripts/generate_shop_images.py --overwrite           # 기존 파일 덮어쓰기
"""
import argparse
import os
import sys
import time
from pathlib import Path

import requests

ENV_PATH = Path(r"D:/2_Projects/automation/planning-automation/.env")
for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
    if line.startswith("FAL_KEY="):
        os.environ["FAL_KEY"] = line.split("=", 1)[1].strip()
        break

try:
    import fal_client
except ImportError:
    print("fal-client 미설치: pip install fal-client")
    sys.exit(1)

SHOP_ROOT = Path(r"D:/2_Projects/web/Maker_homepade/seopung-shop/public/images")

STYLE_BASE = (
    "authentic documentary food photography, bright natural daylight, "
    "pure white or light wood background, crisp clean minimalist composition, "
    "true-to-life natural colors, no color grading, no filter, no retouching, "
    "no HDR look, no glow, no blue tint, no warm tint, "
    "realistic unprocessed appearance, sharp focus throughout, "
    "no text, no watermark, no labels, "
    "modern contemporary Korean e-commerce product shot, "
    "fresh vibrant youthful brand aesthetic, confident and progressive feel"
)

STYLE_PRODUCT = (
    "clean studio product photography on pure white seamless background, "
    "top-down or straight-on 45-degree angle, natural soft shadow, "
    "bright and airy, minimal props, modern Korean online shop style, "
    "crisp clear product focus, youthful and energetic mood, "
) + STYLE_BASE

STYLE_CATEGORY = (
    "clean lifestyle product arrangement, bright light background, "
    "modern minimalist styling, contemporary young Korean e-commerce look, "
    "fresh optimistic mood, "
) + STYLE_BASE


# (key, target_path_rel, aspect, prompt)
IMAGES = [
    # ───── 카테고리 (5) ─────
    ("cat-frozen", "frozen.jpg", "1:1",
     "Assorted premium Korean frozen seafood neatly arranged on crushed ice: "
     "vacuum-packed mackerel fillets, hairtail slices, and peeled shrimp, "
     "light frost on surface, bright clean white background, natural daylight. "
     + STYLE_CATEGORY),

    ("cat-mealkit", "mealkit.jpg", "1:1",
     "Korean meal kit package flat lay: fresh seafood stew ingredients in "
     "clear plastic tray — mixed shellfish, squid rings, tofu cubes, napa cabbage, "
     "enoki mushrooms, small sauce pouch, neatly portioned. Bright kitchen "
     "countertop, minimal modern styling. " + STYLE_CATEGORY),

    ("cat-gulbi", "gulbi.jpg", "1:1",
     "Premium Korean dried yellow croaker (gulbi) tied with traditional straw rope, "
     "golden-brown color, salt crystals visible on skin, arranged on bamboo mat, "
     "traditional Korean fish market atmosphere, warm sunlight. " + STYLE_CATEGORY),

    ("cat-gift", "gift.jpg", "1:1",
     "Elegant Korean seafood gift box opened to reveal individually wrapped "
     "premium dried fish and frozen fillets in gold-trimmed compartments, "
     "cream-colored premium packaging, traditional Korean gift aesthetic, "
     "soft backlight, subtle shadow. " + STYLE_CATEGORY),

    ("cat-sustainable", "sustainable.jpg", "1:1",
     "Sustainably sourced seafood arrangement: fresh shrimp, pollock fillet, "
     "and oysters on slate board with small green leaves, clean ocean-inspired "
     "styling, subtle eco-friendly atmosphere, daylight from left. "
     + STYLE_CATEGORY),

    # ───── 냉동수산물 (5) ─────
    ("p-mackerel-1", "products/mackerel-1.jpg", "1:1",
     "Two fresh Korean mackerel fillets, skin-on silvery-blue striped pattern "
     "visible, neatly placed on white parchment paper over light wooden board, "
     "bright top-down studio shot, clean minimal composition. " + STYLE_PRODUCT),

    ("p-mackerel-2", "products/mackerel-2.jpg", "1:1",
     "Close-up macro of raw Korean mackerel fillet showing flesh texture and "
     "shimmering skin, beside coarse sea salt and lemon slice, on grey stone "
     "plate, natural window light. " + STYLE_PRODUCT),

    ("p-spanish-mackerel-1", "products/spanish-mackerel-1.jpg", "1:1",
     "Fresh Spanish mackerel (samchi) fillets arranged on white ceramic plate, "
     "thick white flesh with subtle pink gradient, green herb garnish, "
     "clean Korean seafood market styling. " + STYLE_PRODUCT),

    ("p-hairtail-1", "products/hairtail-1.jpg", "1:1",
     "Cleaned Korean hairtail (galchi) cut into chunks, silver skin reflecting "
     "light, arranged in circle on black slate, professional product shot, "
     "fresh-caught appearance. " + STYLE_PRODUCT),

    ("p-squid-1", "products/squid-1.jpg", "1:1",
     "Cleaned whole Korean squid, ivory-white body and tentacles, slightly "
     "moist glossy surface, placed on beige linen cloth, bright airy lighting, "
     "fresh seafood aesthetic. " + STYLE_PRODUCT),

    ("p-monkfish-1", "products/monkfish-1.jpg", "1:1",
     "Cleaned Korean monkfish (agu) pieces cut for stew, pale pink flesh and "
     "firm white meat, arranged on wooden cutting board with scallions, "
     "rustic Korean kitchen styling. " + STYLE_PRODUCT),

    # ───── 밀키트 (3) ─────
    ("p-seafood-stew-1", "products/seafood-stew-1.jpg", "1:1",
     "Korean seafood stew (haemul-tang) meal kit: clear plastic tray with "
     "clams, mussels, squid rings, shrimp, tofu, enoki mushrooms, napa cabbage "
     "and red pepper paste pouch, arranged neatly, bright kitchen counter. "
     + STYLE_PRODUCT),

    ("p-spicy-squid-1", "products/spicy-squid-1.jpg", "1:1",
     "Korean spicy squid stir-fry (ojingeo-bokkeum) meal kit: sliced squid "
     "rings, onion, carrot, green cabbage and gochujang sauce pouch in clear "
     "tray, vibrant red accents, clean modern food styling. " + STYLE_PRODUCT),

    ("p-grilled-mackerel-1", "products/grilled-mackerel-1.jpg", "1:1",
     "Four pieces of Korean marinated mackerel ready for air fryer, dark "
     "soy-ginger glaze coating on golden skin, arranged on parchment paper "
     "inside kraft paper tray, warm appetizing tone. " + STYLE_PRODUCT),

    # ───── 영광굴비 (3) ─────
    ("p-gulbi-10-1", "products/gulbi-10-1.jpg", "1:1",
     "Ten premium Yeonggwang gulbi (dried yellow croaker) tied together with "
     "traditional straw rope, golden-amber color with salt crystals, hanging "
     "against white wooden background, warm traditional Korean styling. "
     + STYLE_PRODUCT),

    ("p-gulbi-10-2", "products/gulbi-10-2.jpg", "1:1",
     "Close-up of single premium Yeonggwang gulbi showing golden skin texture, "
     "salt crystals and natural drying marks, placed on bamboo mat with "
     "traditional Korean pottery, soft warm light. " + STYLE_PRODUCT),

    ("p-gulbi-20-1", "products/gulbi-20-1.jpg", "1:1",
     "Large bundle of twenty premium Yeonggwang gulbi neatly tied in two rows "
     "with straw rope, presented in traditional Korean wooden box, golden "
     "color, subtle soft shadow, family-holiday gift aesthetic. "
     + STYLE_PRODUCT),

    ("p-bori-gulbi-1", "products/bori-gulbi-1.jpg", "1:1",
     "Traditional Korean boribi (barley-aged gulbi) displayed on barley grain "
     "bed inside shallow wooden tray, deep amber color with slightly darker "
     "skin, rustic hanok kitchen atmosphere. " + STYLE_PRODUCT),

    # ───── 선물세트 (2) ─────
    ("p-gift-a-1", "products/gift-a-1.jpg", "1:1",
     "Premium Korean Lunar New Year seafood gift box opened: gulbi bundle, "
     "mackerel fillets and Spanish mackerel fillets in individual compartments "
     "wrapped in gold paper, cream-colored box with embossed Korean pattern, "
     "elegant soft lighting. " + STYLE_PRODUCT),

    ("p-gift-thanks-1", "products/gift-thanks-1.jpg", "1:1",
     "Korean thank-you seafood gift set: compact gift box with three vacuum-packed "
     "frozen seafood items (mackerel, hairtail, squid), simple cream ribbon with "
     "gold accent, minimal elegant packaging on warm neutral background. "
     + STYLE_PRODUCT),

    # ───── ASC/MSC (2) ─────
    ("p-asc-shrimp-1", "products/asc-shrimp-1.jpg", "1:1",
     "Peeled ASC-certified whiteleg shrimp arranged in circular pattern on "
     "white ceramic plate, translucent pink flesh with glossy appearance, "
     "a few fresh green herbs scattered, clean bright studio shot. "
     + STYLE_PRODUCT),

    ("p-msc-pollock-1", "products/msc-pollock-1.jpg", "1:1",
     "MSC-certified wild-caught pollock fillets, natural white flesh with "
     "delicate flake pattern, arranged on plain crushed ice, clean "
     "sustainable seafood presentation, bright natural daylight. "
     + STYLE_PRODUCT),
]


def generate(prompt: str, aspect: str) -> bytes | None:
    """Flux 1.1 Pro Ultra 호출 → 이미지 바이너리 반환."""
    try:
        result = fal_client.subscribe(
            "fal-ai/flux-pro/v1.1-ultra",
            arguments={
                "prompt": prompt,
                "aspect_ratio": aspect,
                "num_images": 1,
                "enable_safety_checker": True,
                "safety_tolerance": "2",
                "output_format": "jpeg",
                "raw": True,
            },
            with_logs=False,
        )
        images = result.get("images") or []
        if not images:
            return None
        url = images[0].get("url")
        if not url:
            return None
        resp = requests.get(url, timeout=60)
        return resp.content
    except Exception as e:
        print(f"    [ERR] {e}")
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="단일 key만 생성")
    parser.add_argument("--overwrite", action="store_true", help="기존 파일 덮어쓰기")
    args = parser.parse_args()

    targets = IMAGES
    if args.only:
        targets = [t for t in IMAGES if t[0] == args.only]
        if not targets:
            print(f"key not found: {args.only}")
            sys.exit(1)

    done, skipped, failed = 0, 0, 0
    for i, (key, rel, aspect, prompt) in enumerate(targets, 1):
        dest = SHOP_ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)

        if dest.exists() and not args.overwrite:
            print(f"[{i}/{len(targets)}] SKIP {rel} (exists)")
            skipped += 1
            continue

        print(f"[{i}/{len(targets)}] GEN  {rel}  ({aspect})")
        t0 = time.time()
        data = generate(prompt, aspect)
        if data is None:
            print(f"    FAIL")
            failed += 1
            continue
        dest.write_bytes(data)
        print(f"    OK ({len(data)//1024} KB, {time.time()-t0:.1f}s)")
        done += 1

    print(f"\nDONE: generated={done}, skipped={skipped}, failed={failed}")


if __name__ == "__main__":
    main()
