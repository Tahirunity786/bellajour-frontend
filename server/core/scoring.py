from PIL import Image

def score_photo(image_path, context=None):
    """
    Scores a photo based on technical quality.
    Accepts optional narrative context to influence scoring weights.

    context example:
    {
        "intent": "family",        # family | travel | event | portrait
        "prefer_portraits": True,  # override orientation preference
        "min_resolution": 4000000  # custom resolution threshold
    }
    """

    context = context or {}

    try:
        img = Image.open(image_path)
        width, height = img.size

        # --- Configurable weights from context ---
        min_res = context.get('min_resolution', 8000000)
        prefer_portraits = context.get('prefer_portraits', False)
        intent = context.get('intent', 'general')

        # Rule 1: Resolution score
        resolution = width * height
        resolution_score = min(resolution / min_res, 1.0)

        # Rule 2: Aspect ratio score
        ratio = width / height
        ideal_ratio = 4 / 3
        ratio_score = 1 - min(abs(ratio - ideal_ratio) / ideal_ratio, 1.0)

        # Rule 3: Orientation score — context aware
        if prefer_portraits or intent == 'portrait':
            orientation_score = 1.0 if height > width else 0.6
        else:
            orientation_score = 1.0 if width > height else 0.6

        # Rule 4: Intent-based bonus
        intent_bonus = {
            'family': 0.05,    # slight boost — forgiving on resolution
            'travel': 0.03,    # landscape preferred
            'event': 0.02,
            'portrait': 0.04,
            'general': 0.0,
        }.get(intent, 0.0)

        # Final weighted score
        final_score = (
            resolution_score * 0.5 +
            ratio_score * 0.3 +
            orientation_score * 0.2 +
            intent_bonus
        )

        return {
            'score': round(min(final_score, 1.0), 3),
            'details': {
                'resolution_score': round(resolution_score, 3),
                'ratio_score': round(ratio_score, 3),
                'orientation_score': orientation_score,
                'intent_bonus': intent_bonus,
                'context_applied': context,
            }
        }

    except Exception as e:
        return {'score': 0.0, 'details': {'error': str(e)}}