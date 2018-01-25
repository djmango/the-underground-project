from django.shortcuts import render

# views
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def apply(request):
    return render(request, 'apply.html')

def staff(request):
    return render(request, 'staff.html')