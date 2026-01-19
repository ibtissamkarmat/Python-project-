from django.urls import path
from .views import home, create_job, user_login, user_register, user_logout, freelancers

urlpatterns = [
    path("", home, name="home"),
    path("jobs/create/", create_job, name="create_job"),
    path("login/", user_login, name="user_login"),
    path("register/", user_register, name="user_register"),
    path("logout/", user_logout, name="user_logout"),
    path("freelancers/", freelancers, name="freelancers"),

]

