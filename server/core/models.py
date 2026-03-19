from django.db import models

class Job(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id} — {self.status}"


class Photo(models.Model):
    job = models.ForeignKey(Job, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/')
    score = models.FloatField(null=True, blank=True)
    score_details = models.JSONField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo {self.id} (Job {self.job.id})"