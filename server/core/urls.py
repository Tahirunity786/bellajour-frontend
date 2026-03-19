from django.urls import path
from .views import UploadView, JobStatusView

urlpatterns = [
    path('upload/', UploadView.as_view(), name='upload'),
    path('status/<int:job_id>/', JobStatusView.as_view(), name='job-status'),
]