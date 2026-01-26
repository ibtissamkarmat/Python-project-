from django.contrib import admin
from .models import StudentProfile, Job, JobApplication

admin.site.register(StudentProfile)
admin.site.register(Job)
admin.site.register(JobApplication)
