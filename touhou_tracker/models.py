from django.db import models
import random, string
from django.forms.models import model_to_dict

def my_random_key():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))

class TouhouTrackerColors(models.Model):
    c_hrtp = models.CharField(max_length=7, default="#f44336")
    c_soew = models.CharField(max_length=7, default="#E91E63")
    c_podd = models.CharField(max_length=7, default="#9C27B0")
    c_lls = models.CharField(max_length=7, default="#673AB7")
    c_ms = models.CharField(max_length=7, default="#3F51B5")
    c_eosd = models.CharField(max_length=7, default="#2196F3")
    c_pcb = models.CharField(max_length=7, default="#03A9F4")
    c_in = models.CharField(max_length=7, default="#00BCD4")
    c_mof = models.CharField(max_length=7, default="#009688")
    c_sa = models.CharField(max_length=7, default="#4CAF50")
    c_ufo = models.CharField(max_length=7, default="#8BC34A")
    c_td = models.CharField(max_length=7, default="#CDDC39")
    c_ddc = models.CharField(max_length=7, default="#FFEB3B")
    c_lolk = models.CharField(max_length=7, default="#FFC107")
    c_hsifs = models.CharField(max_length=7, default="#FF9800")
    c_pofv = models.CharField(max_length=7, default="#FF5722")
    c_gfw = models.CharField(max_length=7, default="#795548")

    def to_dict(self):
        return dict((k.replace('c_', ''), v) for (k, v) in model_to_dict(self).items() if 'c_' in k)

class TouhouTrackerTrack(models.Model):
    track_id = models.CharField(max_length=10, default=my_random_key)
    password = models.CharField(max_length=50)
    data = models.TextField()
    colors = models.ForeignKey(TouhouTrackerColors)
    read_only = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    parent = models.ForeignKey('TouhouTrackerTrack', null=True)