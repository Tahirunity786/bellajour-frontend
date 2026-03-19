from rest_framework import serializers
from .models import Job, Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'score', 'score_details', 'uploaded_at']

class JobSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = ['id', 'status', 'created_at', 'updated_at', 'photos']