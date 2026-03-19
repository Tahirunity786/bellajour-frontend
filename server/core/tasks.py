from celery import shared_task
from .models import Job, Photo
from .scoring import score_photo

@shared_task
def process_job(job_id, context=None):
    try:
        job = Job.objects.get(id=job_id)
        job.status = 'processing'
        job.save()

        for photo in job.photos.all():
            result = score_photo(photo.image.path, context=context)
            photo.score = result['score']
            photo.score_details = result['details']
            photo.save()

        job.status = 'completed'
        job.save()

    except Exception as e:
        job.status = 'failed'
        job.save()
        raise e