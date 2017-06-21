from django.forms import ModelForm
from touhou_tracker.models import Track

class ArticleForm(ModelForm):
    class Meta:
        model = Track
        fields = ['track_id', 'password']
