# Bellajour — V1 Test Task

A minimal async photo processing pipeline built with Django, Celery, and Redis.

## What this demonstrates

- Clean modular architecture aligned with Bellajour's engine system
- Async job processing — each photo is scored in the background
- Context-aware scoring — narrative intent influences how photos are evaluated
- Isolated, testable pipeline — each step can be extended without touching the rest

## Stack

- Django + Django REST Framework
- Celery + Redis (async task queue)
- Pillow (image processing)
- SQLite (test DB)

## Setup
```bash
python -m venv venv
source venv/bin/activate
pip install django djangorestframework celery redis Pillow django-cors-headers
python manage.py migrate
```

## Run
```bash
# Terminal 1
python manage.py runserver

# Terminal 2
redis-server

# Terminal 3
celery -A bellajour worker --loglevel=info
```

## API Endpoints

### Upload Photos
`POST /api/upload/`

| Field | Type | Description |
|-------|------|-------------|
| photos | file(s) | One or more image files |
| intent | string | general / family / travel / portrait / event |
| prefer_portraits | boolean | Override orientation preference |

### Check Job Status
`GET /api/status/<job_id>/`

Returns job status, ranked photos, scores and scoring breakdown.

## Architecture Notes

The scoring engine is designed to accept narrative context — not just raw photo data.
This means as the Narrative Engine evolves, it can directly influence how photos
are scored and selected, keeping the pipeline coupled by intent rather than just
technical rules.