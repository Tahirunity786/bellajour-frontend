from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Job, Photo
from .serializers import JobSerializer, PhotoSerializer
from .tasks import process_job

class UploadView(APIView):
    def post(self, request):
        files = request.FILES.getlist('photos')

        if not files:
            return Response({'error': 'No photos uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        # Optional narrative context from request
        context = {
            'intent': request.data.get('intent', 'general'),
            'prefer_portraits': request.data.get('prefer_portraits', False),
        }

        job = Job.objects.create()

        for file in files:
            Photo.objects.create(job=job, image=file)

        process_job.delay(job.id, context=context)

        return Response({
            'job_id': job.id,
            'status': job.status,
            'context': context,
            'message': f'{len(files)} photo(s) uploaded. Processing started.'
        }, status=status.HTTP_201_CREATED)

class JobStatusView(APIView):
    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
            photos = job.photos.order_by('-score')  # sorted best to worst
            serializer = JobSerializer(job)
            data = serializer.data
            data['photos'] = PhotoSerializer(photos, many=True).data
            data['total_photos'] = photos.count()
            data['best_photo'] = PhotoSerializer(photos.first()).data if photos.exists() else None
            return Response(data)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)