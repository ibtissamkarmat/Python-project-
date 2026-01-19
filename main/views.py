from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Job, StudentProfile
from .forms import JobForm, StudentProfileForm

def home(request):
    jobs = Job.objects.all()
    students = StudentProfile.objects.all()
    return render(request, "main/home.html", {
        "jobs": jobs,
        "students": students
    })

def user_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "main/login.html", {"error": "Invalid credentials"})
    return render(request, "main/login.html")

def user_register(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password_confirm = request.POST.get("password_confirm")
        email = request.POST.get("email")
        
        if password != password_confirm:
            return render(request, "main/register.html", {"error": "Passwords don't match"})
        
        if User.objects.filter(username=username).exists():
            return render(request, "main/register.html", {"error": "Username already exists"})
        
        if User.objects.filter(email=email).exists():
            return render(request, "main/register.html", {"error": "Email already exists"})
        
        user = User.objects.create_user(username=username, password=password, email=email)
        login(request, user)
        return redirect("home")
    
    return render(request, "main/register.html")

def user_logout(request):
    logout(request)
    return redirect("home")

@login_required(login_url='user_login')
def create_job(request):
    if request.method == "POST":
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.posted_by = request.user
            job.save()
            return redirect("home")
    else:
        form = JobForm()

    return render(request, "main/create_job.html", {"form": form})
def freelancers(request):
    students = StudentProfile.objects.all()
    user_profile = None
    
    if request.user.is_authenticated:
        try:
            user_profile = StudentProfile.objects.get(user=request.user)
        except StudentProfile.DoesNotExist:
            user_profile = None
    
    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("user_login")
        
        form = StudentProfileForm(request.POST, instance=user_profile)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            return redirect("freelancers")
    else:
        form = StudentProfileForm(instance=user_profile) if request.user.is_authenticated else StudentProfileForm()
    
    return render(request, "main/freelancer.html", {
        "students": students,
        "user_profile": user_profile,
        "form": form
    })
