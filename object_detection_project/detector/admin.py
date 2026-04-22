from django.contrib import admin
from .models import DetectionRecord, InventoryLog, SecurityAlert

@admin.register(DetectionRecord)
class DetectionRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'detection_type', 'total_objects', 'timestamp']

@admin.register(InventoryLog)
class InventoryLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'timestamp', 'location']

@admin.register(SecurityAlert)
class SecurityAlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'alert_type', 'severity', 'resolved', 'timestamp']
