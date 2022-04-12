from django.shortcuts import render, HttpResponse
 

# Create your views here.
def index(request):
    # return(HttpResponse("This is Homepage"))                   HttpResponse is used to print a string on the site
    context = {                                                  #This is used to paas a variable into a html file
        'variable1': "I am great but not greatest",
        'variable2': "I have to work hard to remain great"
    }
    return render(request, 'index.html', context)                 #Render is used to render a html file on website

def about(request):
    return render(request, 'about.html')

    # return(HttpResponse("This is About Page"))

def services(request):
    return render(request, 'services.html')

    # return(HttpResponse("This is Services Page"))

def contact(request):
    return render(request, 'contact.html')

    # return(HttpResponse("This is Contact Page"))