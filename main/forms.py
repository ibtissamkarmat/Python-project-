from django import forms
from .models import Job, StudentProfile, JobApplication

class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ["title", "description", "budget"]

class StudentProfileForm(forms.ModelForm):
    class Meta:
        model = StudentProfile
        fields = ["skills", "price_per_hour", "bio"]
        widgets = {
            "skills": forms.TextInput(attrs={"placeholder": "e.g., Python, Web Design, Data Analysis"}),
            "price_per_hour": forms.NumberInput(attrs={"placeholder": "Enter hourly rate", "min": "1"}),
            "bio": forms.Textarea(attrs={"placeholder": "Tell clients about yourself and your experience", "rows": 4})
        }

class JobApplicationForm(forms.ModelForm):
    class Meta:
        model = JobApplication
        fields = ["letter"]
        widgets = {
            "letter": forms.Textarea(attrs={
                "placeholder": "Write your application letter...",
                "rows": 8,
                "class": "form-control"
            })
        }
        labels = {
            "letter": "Application Letter"
        }
