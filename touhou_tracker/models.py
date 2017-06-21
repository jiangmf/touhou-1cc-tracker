from django.db import models
import random, string

def my_random_key():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))

class Track(models.Model):
    track_id = models.CharField(max_length=10, default=my_random_key)
    password = models.CharField(max_length=50)
    data = models.TextField()
