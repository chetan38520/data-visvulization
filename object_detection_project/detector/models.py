from django.db import models
from django.contrib.auth.models import User

class DetectionRecord(models.Model):
    DETECTION_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('live', 'Live Stream'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    detection_type = models.CharField(max_length=10, choices=DETECTION_TYPE_CHOICES)
    original_file = models.FileField(upload_to='uploads/', null=True, blank=True)
    result_file = models.FileField(upload_to='results/', null=True, blank=True)
    detected_objects = models.JSONField(default=dict)
    total_objects = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']

class InventoryLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    items_count = models.JSONField(default=dict)
    location = models.CharField(max_length=200, blank=True)
    
    class Meta:
        ordering = ['-timestamp']

class SecurityAlert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True)
    alert_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='medium')
    details = models.JSONField(default=dict)
    resolved = models.BooleanField(default=False)
    image = models.ImageField(upload_to='alerts/', null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
